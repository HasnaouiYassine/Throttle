import { Router } from 'express'
import Sale from '../models/Sale.js'
import Item from '../models/Item.js'
import { getNextId } from '../models/Counter.js'

const router = Router()
const paymentMethods = ['Cash', 'Card', 'Financing']

function dateMatches(timestamp, range) {
  if (!range || range === 'all') return true
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (range === 'today') return date >= today
  if (range === 'yesterday') return date >= new Date(today.getTime() - 86400000) && date < today
  if (range === 'last7') return date >= new Date(today.getTime() - 6 * 86400000)
  if (range === 'month') return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  return true
}

router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim().toLowerCase()
    const payment = String(req.query.payment || '')
    const range = String(req.query.range || 'all')

    let allSales = await Sale.find().lean()
    allSales = allSales.map((s) => { const { _id, __v, ...rest } = s; return rest })

    let filtered = allSales
      .filter((sale) => (!payment || sale.paymentMethod === payment) && dateMatches(sale.timestamp, range))
      .filter((sale) => !search || sale.txnId.toLowerCase().includes(search) || sale.lines.some((line) => line.name.toLowerCase().includes(search) || line.sku.toLowerCase().includes(search)))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json(filtered)
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {}
    const paymentMethod = body.paymentMethod || 'Cash'
    if (!paymentMethods.includes(paymentMethod) || !Array.isArray(body.lines) || body.lines.length === 0) throw new Error('INVALID_SALE')

    // Group lines by item
    const grouped = new Map()
    for (const line of body.lines) {
      const itemId = Number(line.itemId)
      const qty = Number(line.qty)
      if (!Number.isInteger(itemId) || !Number.isInteger(qty) || qty <= 0) throw new Error('INVALID_SALE')
      grouped.set(itemId, (grouped.get(itemId) || 0) + qty)
    }

    // Validate stock
    for (const [itemId, qty] of grouped) {
      const item = await Item.findOne({ id: itemId })
      if (!item) throw new Error('ITEM_NOT_FOUND')
      if (item.stock < qty) throw new Error(`INSUFFICIENT_STOCK:${item.name}`)
    }

    // Deduct stock and build sale lines
    const now = new Date().toISOString()
    const lines = []
    for (const [itemId, qty] of grouped) {
      const item = await Item.findOne({ id: itemId })
      item.stock -= qty
      item.updatedAt = now
      await item.save()
      lines.push({ itemId, qty, price: item.price, cost: item.cost, name: item.name, sku: item.sku })
    }

    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
    const taxRate = Number.isFinite(Number(body.taxRate)) ? Number(body.taxRate) : 0.08
    const id = await getNextId('sale')
    const sale = await Sale.create({
      id,
      txnId: body.txnId?.trim() || `TXN-${String(id).padStart(6, '0')}`,
      timestamp: now,
      subtotal,
      tax: subtotal * taxRate,
      total: subtotal * (1 + taxRate),
      paymentMethod,
      paymentDetail: typeof body.paymentDetail === 'string' ? body.paymentDetail.trim() : '',
      lines,
    })

    res.status(201).json(sale)
  } catch (error) { next(error) }
})

export default router
