import { Router } from 'express'
import { nextId, readStore, updateStore } from '../store.js'

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
  try { res.json(await readStore((db) => db.orders)) } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {}
    const supplierId = Number(body.supplierId)
    const date = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : new Date().toISOString().slice(0, 10)
    const status = body.status || 'Pending'
    if (!Number.isInteger(supplierId) || !statuses.includes(status)) throw new Error('INVALID_ORDER')
    const items = orderLines(body)
    const order = await updateStore((db) => {
      if (!db.suppliers.some((supplier) => supplier.id === supplierId)) throw new Error('SUPPLIER_NOT_FOUND')
      if (items.some((line) => !db.items.some((item) => item.id === line.itemId))) throw new Error('ITEM_NOT_FOUND')
      const id = nextId(db, 'order')
      const supplier = db.suppliers.find((entry) => entry.id === supplierId)
      const created = { id: `PO-${String(id).padStart(5, '0')}`, sequence: id, supplierId, supplierName: supplier.name, date, status, items, receivedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      if (status === 'Received') {
        for (const line of items) {
          const item = db.items.find((entry) => entry.id === line.itemId)
          item.stock += line.qty
          item.cost = line.cost
        }
        created.receivedAt = new Date().toISOString()
      }
      db.orders.push(created)
      return created
    })
    res.status(201).json(order)
  } catch (error) { next(error) }
})

// Purchase order updates deliberately only allow status changes. This prevents
// receiving a different quantity than the one that was approved on the order.
router.patch('/:id', async (req, res, next) => {
  try {
    const status = req.body?.status
    if (!statuses.includes(status)) throw new Error('INVALID_STATUS')
    const order = await updateStore((db) => {
      const current = db.orders.find((entry) => entry.id === req.params.id)
      if (!current) throw new Error('NOT_FOUND')
      if (current.status === status) return current
      if (current.status === 'Received') throw new Error('RECEIVED_ORDER_LOCKED')
      if (status === 'Received') {
        for (const line of current.items) {
          const item = db.items.find((entry) => entry.id === line.itemId)
          if (!item) throw new Error('ITEM_NOT_FOUND')
          item.stock += line.qty
          item.cost = line.cost
          item.updatedAt = new Date().toISOString()
        }
        current.receivedAt = new Date().toISOString()
      }
      current.status = status
      current.updatedAt = new Date().toISOString()
      return current
    })
    res.json(order)
  } catch (error) { next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await updateStore((db) => {
      const index = db.orders.findIndex((entry) => entry.id === req.params.id)
      if (index < 0) throw new Error('NOT_FOUND')
      db.orders.splice(index, 1)
    })
    res.status(204).end()
  } catch (error) { next(error) }
})

export default router
