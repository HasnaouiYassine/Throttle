import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '7d',
  adminUsername: process.env.ADMIN_USERNAME || 'mabrouk',
  adminPassword: process.env.ADMIN_PASSWORD || 'mabrouk123',
  frontendUrls: (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
}

if (!process.env.JWT_SECRET) {
  console.warn('[auth] WARNING: JWT_SECRET is not set — using an insecure dev fallback. Set it in .env for any real use.')
}
