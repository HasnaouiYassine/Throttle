import { Router } from 'express'
import { nextId, readStore, updateStore } from '../store.js'

const router = Router()
const categories = ['Engine', 'Brakes', 'Drive & Chain', 'Electrical', 'Suspension', 'Tires & Wheels', 'Filters & Fluids']

function number(value, field, { min = 0, integer = false } = {}) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < min || (integer && !Number.isInteger(parsed))) {
    throw new Error(`INVALID_${field.toUpperCase()}`)
  }
  return parsed
}

function text(value, field, { required = true } = {}) {
  const result = typeof value === 'string' ? value.trim() : ''
  if (required && !result) throw new Error(`INVALID_${field.toUpperCase()}`)
  return result
}

function itemPayload(body, { partial = false } = {}) {
  const data = {}
  if (!partial || 'name' in body) data.name = text(body.name, 'name')
  if (!partial || 'sku' in body) data.sku = text(body.sku, 'sku')
  if (!partial || 'category' in body) {
    data.category = text(body.category, 'category')
    if (!categories.includes(data.category)) throw new Error('INVALID_CATEGORY')
  }
  if (!partial || 'price' in body) data.price = number(body.price, 'price')
  if (!partial || 'cost' in body) data.cost = number(body.cost ?? 0, 'cost')
  if (!partial || 'stock' in body) data.stock = number(body.stock, 'stock', { integer: true })
  if (!partial || 'lowStockAt' in body) data.lowStockAt = number(body.lowStockAt ?? 0, 'low_stock_at', { integer: true })
  for (const field of ['variant', 'size', 'color', 'barcode', 'image']) {
    if (!partial || field in body) data[field] = text(body[field] ?? '', field, { required: false })
  }
  return data
}

router.get('/', async (req, res, next) => {
  try { res.json(await readStore((db) => db.items)) } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const payload = itemPayload(req.body || {})
    const item = await updateStore((db) => {
      if (db.items.some((entry) => entry.sku.toLowerCase() === payload.sku.toLowerCase())) throw new Error('DUPLICATE_SKU')
      const created = { id: nextId(db, 'item'), ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      db.items.push(created)
      return created
    })
    res.status(201).json(item)
  } catch (error) { next(error) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const payload = itemPayload(req.body || {}, { partial: true })
    const item = await updateStore((db) => {
      const current = db.items.find((entry) => entry.id === Number(req.params.id))
      if (!current) throw new Error('NOT_FOUND')
      if (payload.sku && db.items.some((entry) => entry.id !== current.id && entry.sku.toLowerCase() === payload.sku.toLowerCase())) throw new Error('DUPLICATE_SKU')
      Object.assign(current, payload, { updatedAt: new Date().toISOString() })
      return current
    })
    res.json(item)
  } catch (error) { next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await updateStore((db) => {
      const index = db.items.findIndex((entry) => entry.id === Number(req.params.id))
      if (index < 0) throw new Error('NOT_FOUND')
      if (db.orders.some((order) => order.items.some((line) => line.itemId === Number(req.params.id)))) throw new Error('ITEM_HAS_ORDERS')
      db.items.splice(index, 1)
    })
    res.status(204).end()
  } catch (error) { next(error) }
})

export default router
