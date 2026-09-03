import jwt from 'jsonwebtoken'
import { config } from '../config.js'

// Expects: Authorization: Bearer <token>
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'NO_TOKEN' })
  }
  try {
    req.user = jwt.verify(token, config.jwtSecret)
    next()
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' })
  }
}
