import { Router } from 'express'
import { nextId, readStore, updateStore } from '../store.js'

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
    const sales = await readStore((db) => db.sales
      .filter((sale) => (!payment || sale.paymentMethod === payment) && dateMatches(sale.timestamp, range))
      .filter((sale) => !search || sale.txnId.toLowerCase().includes(search) || sale.lines.some((line) => line.name.toLowerCase().includes(search) || line.sku.toLowerCase().includes(search)))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    res.json(sales)
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {}
    const paymentMethod = body.paymentMethod || 'Cash'
    if (!paymentMethods.includes(paymentMethod) || !Array.isArray(body.lines) || body.lines.length === 0) throw new Error('INVALID_SALE')
    const sale = await updateStore((db) => {
      const grouped = new Map()
      for (const line of body.lines) {
        const itemId = Number(line.itemId)
        const qty = Number(line.qty)
        if (!Number.isInteger(itemId) || !Number.isInteger(qty) || qty <= 0) throw new Error('INVALID_SALE')
        grouped.set(itemId, (grouped.get(itemId) || 0) + qty)
      }
      for (const [itemId, qty] of grouped) {
        const item = db.items.find((entry) => entry.id === itemId)
        if (!item) throw new Error('ITEM_NOT_FOUND')
        if (item.stock < qty) throw new Error(`INSUFFICIENT_STOCK:${item.name}`)
      }
      const lines = [...grouped].map(([itemId, qty]) => {
        const item = db.items.find((entry) => entry.id === itemId)
        item.stock -= qty
        item.updatedAt = new Date().toISOString()
        return { itemId, qty, price: item.price, cost: item.cost, name: item.name, sku: item.sku }
      })
      const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
      const taxRate = Number.isFinite(Number(body.taxRate)) ? Number(body.taxRate) : 0.08
      const id = nextId(db, 'sale')
      const created = {
        id,
        txnId: body.txnId?.trim() || `TXN-${String(id).padStart(6, '0')}`,
        timestamp: new Date().toISOString(),
        subtotal,
        tax: subtotal * taxRate,
        total: subtotal * (1 + taxRate),
        paymentMethod,
        paymentDetail: typeof body.paymentDetail === 'string' ? body.paymentDetail.trim() : '',
        lines,
      }
      db.sales.push(created)
      return created
    })
    res.status(201).json(sale)
  } catch (error) { next(error) }
})

export default router
