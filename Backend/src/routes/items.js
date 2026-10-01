import { Router } from 'express'
import Item from '../models/Item.js'
import Order from '../models/Order.js'
import { getNextId } from '../models/Counter.js'

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
  try {
    const items = await Item.find().lean()
    res.json(items.map((item) => { const { _id, __v, ...rest } = item; return rest }))
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const payload = itemPayload(req.body || {})
    const existing = await Item.findOne({ sku: { $regex: new RegExp(`^${payload.sku}$`, 'i') } })
    if (existing) throw new Error('DUPLICATE_SKU')
    const id = await getNextId('item')
    const now = new Date().toISOString()
    const item = await Item.create({ id, ...payload, createdAt: now, updatedAt: now })
    res.status(201).json(item)
  } catch (error) { next(error) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const payload = itemPayload(req.body || {}, { partial: true })
    const current = await Item.findOne({ id: Number(req.params.id) })
    if (!current) throw new Error('NOT_FOUND')
    if (payload.sku) {
      const duplicate = await Item.findOne({ id: { $ne: current.id }, sku: { $regex: new RegExp(`^${payload.sku}$`, 'i') } })
      if (duplicate) throw new Error('DUPLICATE_SKU')
    }
    Object.assign(current, payload, { updatedAt: new Date().toISOString() })
    await current.save()
    res.json(current)
  } catch (error) { next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const itemId = Number(req.params.id)
    const item = await Item.findOne({ id: itemId })
    if (!item) throw new Error('NOT_FOUND')
    const hasOrders = await Order.findOne({ 'items.itemId': itemId })
    if (hasOrders) throw new Error('ITEM_HAS_ORDERS')
    await Item.deleteOne({ id: itemId })
    res.status(204).end()
  } catch (error) { next(error) }
})

export default router
