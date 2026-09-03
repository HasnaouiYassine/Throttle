import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import authRoutes from './routes/auth.js'

const app = express()

app.use(cors({ origin: config.frontendUrls }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)

app.listen(config.port, () => {
  console.log(`[throttle-backend] listening on http://localhost:${config.port}`)
})
