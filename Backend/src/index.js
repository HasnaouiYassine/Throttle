import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.js'
import itemRoutes from './routes/items.js'
import supplierRoutes from './routes/suppliers.js'
import orderRoutes from './routes/orders.js'
import saleRoutes from './routes/sales.js'
import dashboardRoutes from './routes/dashboard.js'
import { requireAuth } from './middleware/requireAuth.js'

const app = express()

app.use(cors({ origin: config.frontendUrls }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/items', requireAuth, itemRoutes)
app.use('/api/suppliers', requireAuth, supplierRoutes)
app.use('/api/orders', requireAuth, orderRoutes)
app.use('/api/sales', requireAuth, saleRoutes)
app.use('/api/dashboard', requireAuth, dashboardRoutes)

app.use((error, req, res, next) => {
  const code = error.message || 'SERVER_ERROR'
  const status = code === 'NOT_FOUND' ? 404 : code.includes('DUPLICATE') || code.includes('HAS_') || code.includes('LOCKED') ? 409 : code === 'SERVER_ERROR' ? 500 : 400
  if (status === 500) console.error(error)
  res.status(status).json({ error: code })
})

connectDB()
  .then(() => app.listen(config.port, () => console.log(`[throttle-backend] listening on http://localhost:${config.port}`)))
  .catch((error) => { console.error('[throttle-backend] failed to connect to database', error); process.exit(1) })
