import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { requireAuth } from '../middleware/requireAuth.js'

// Hash once at boot so the plain password only lives in env/config
const passwordHash = bcrypt.hashSync(config.adminPassword, 10)

const router = Router()

// POST /api/auth/login  { username, password } -> { token, username, expiresIn }
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'MISSING_CREDENTIALS' })
  }
  const validUser = username === config.adminUsername
  const validPass = bcrypt.compareSync(password, passwordHash)
  if (!validUser || !validPass) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' })
  }
  const token = jwt.sign({ sub: username }, config.jwtSecret, {
    expiresIn: config.tokenExpiresIn,
  })
  return res.json({ token, username, expiresIn: config.tokenExpiresIn })
})

// GET /api/auth/me -> { username } (validates the token)
router.get('/me', requireAuth, (req, res) => {
  return res.json({ username: req.user.sub })
})

export default router
