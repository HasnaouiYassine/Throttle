import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  mongoUri: process.env.MONGODB_URI,
  frontendUrls: (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
}

if (!process.env.JWT_SECRET) {
  console.warn('[auth] WARNING: JWT_SECRET is not set — using an insecure dev fallback. Set it in .env for any real use.')
}

if (!config.mongoUri) {
  console.error('[config] MONGODB_URI is not set. Please add it to your .env file.')
  process.exit(1)
}
