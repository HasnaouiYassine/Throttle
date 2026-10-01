import { setServers } from 'node:dns'
import mongoose from 'mongoose'
import { config } from './config.js'

// Use Google public DNS to resolve SRV records — some local routers/ISPs
// refuse SRV queries which breaks mongodb+srv:// connections.
setServers(['8.8.8.8', '8.8.4.4'])

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('[db] Connected to MongoDB')
  } catch (error) {
    console.error('[db] MongoDB connection error:', error.message)
    process.exit(1)
  }
}
