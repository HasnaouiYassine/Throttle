import { Router } from 'express'
import Order from '../models/Order.js'
import Item from '../models/Item.js'
import Supplier from '../models/Supplier.js'
import { getNextId } from '../models/Counter.js'

const router = Router()
const statuses = ['Pending', 'Received', 'Cancelled']

function orderLines(body) {
  if (!Array.isArray(body.items) || body.items.length === 0) throw new Error('INVALID_ORDER_ITEMS')
  return body.items.map((line) => {
    const itemId = Number(line.itemId)
    const qty = Number(line.qty ?? line.quantity)
    const cost = Number(line.cost)
    if (!Number.isInteger(itemId) || !Number.isInteger(qty) || qty <= 0 || !Number.isFinite(cost) || cost < 0) throw new Error('INVALID_ORDER_ITEMS')
    return { itemId, qty, cost }
  })
}

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().lean()
    res.json(orders.map((o) => { const { _id, __v, ...rest } = o; return rest }))
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {}
    const supplierId = Number(body.supplierId)
    const date = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : new Date().toISOString().slice(0, 10)
    const status = body.status || 'Pending'
    if (!Number.isInteger(supplierId) || !statuses.includes(status)) throw new Error('INVALID_ORDER')
    const items = orderLines(body)

    const supplier = await Supplier.findOne({ id: supplierId })
    if (!supplier) throw new Error('SUPPLIER_NOT_FOUND')
    for (const line of items) {
      const item = await Item.findOne({ id: line.itemId })
      if (!item) throw new Error('ITEM_NOT_FOUND')
    }

    const seq = await getNextId('order')
    const now = new Date().toISOString()
    const orderData = {
      id: `PO-${String(seq).padStart(5, '0')}`,
      sequence: seq,
      supplierId,
      supplierName: supplier.name,
      date,
      status,
      items,
      receivedAt: null,
      createdAt: now,
      updatedAt: now,
    }

    if (status === 'Received') {
      for (const line of items) {
        await Item.findOneAndUpdate({ id: line.itemId }, { $inc: { stock: line.qty }, $set: { cost: line.cost } })
      }
      orderData.receivedAt = now
    }

    const order = await Order.create(orderData)
    res.status(201).json(order)
  } catch (error) { next(error) }
})

// Purchase order updates deliberately only allow status changes.
router.patch('/:id', async (req, res, next) => {
  try {
    const status = req.body?.status
    if (!statuses.includes(status)) throw new Error('INVALID_STATUS')

    const current = await Order.findOne({ id: req.params.id })
    if (!current) throw new Error('NOT_FOUND')
    if (current.status === status) return res.json(current)
    if (current.status === 'Received') throw new Error('RECEIVED_ORDER_LOCKED')

    if (status === 'Received') {
      for (const line of current.items) {
        const item = await Item.findOne({ id: line.itemId })
        if (!item) throw new Error('ITEM_NOT_FOUND')
        item.stock += line.qty
        item.cost = line.cost
        item.updatedAt = new Date().toISOString()
        await item.save()
      }
      current.receivedAt = new Date().toISOString()
    }

    current.status = status
    current.updatedAt = new Date().toISOString()
    await current.save()
    res.json(current)
  } catch (error) { next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Order.deleteOne({ id: req.params.id })
    if (result.deletedCount === 0) throw new Error('NOT_FOUND')
    res.status(204).end()
  } catch (error) { next(error) }
})

export default router
