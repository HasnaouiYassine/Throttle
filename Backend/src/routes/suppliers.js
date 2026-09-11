import { Router } from 'express'
import { nextId, readStore, updateStore } from '../store.js'

const router = Router()

function value(input, field, required = true) {
  const result = typeof input === 'string' ? input.trim() : ''
  if (required && !result) throw new Error(`INVALID_${field.toUpperCase()}`)
  return result
}

function payload(body, partial = false) {
  const data = {}
  for (const field of ['name', 'contactPerson', 'phone', 'terms']) {
    if (!partial || field in body) data[field] = value(body[field], field, field === 'name')
  }
  if (!partial || 'categories' in body) {
    if (!Array.isArray(body.categories)) throw new Error('INVALID_CATEGORIES')
    data.categories = [...new Set(body.categories.map((category) => value(category, 'category')))]
  }
  return data
}

router.get('/', async (req, res, next) => {
  try { res.json(await readStore((db) => db.suppliers)) } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const supplier = await updateStore((db) => {
      const created = { id: nextId(db, 'supplier'), shortId: `SUP-${String(db.nextIds.supplier - 1).padStart(3, '0')}`, ...payload(req.body || {}), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      db.suppliers.push(created)
      return created
    })
    res.status(201).json(supplier)
  } catch (error) { next(error) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const supplier = await updateStore((db) => {
      const current = db.suppliers.find((entry) => entry.id === Number(req.params.id))
      if (!current) throw new Error('NOT_FOUND')
      Object.assign(current, payload(req.body || {}, true), { updatedAt: new Date().toISOString() })
      return current
    })
    res.json(supplier)
  } catch (error) { next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await updateStore((db) => {
      const id = Number(req.params.id)
      const index = db.suppliers.findIndex((entry) => entry.id === id)
      if (index < 0) throw new Error('NOT_FOUND')
      const supplier = db.suppliers[index]
      // Keep purchase-order history readable after a supplier is removed.
      for (const order of db.orders.filter((entry) => entry.supplierId === id)) {
        order.supplierId = null
        order.supplierName = supplier.name
      }
      db.suppliers.splice(index, 1)
    })
    res.status(204).end()
  } catch (error) { next(error) }
})

export default router
