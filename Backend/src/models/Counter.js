import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
})

const Counter = mongoose.model('Counter', counterSchema)

/**
 * Atomically increment and return the next integer ID for the given type.
 * e.g. getNextId('item') → 1, 2, 3, …
 */
export async function getNextId(type) {
  const counter = await Counter.findByIdAndUpdate(
    type,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  )
  return counter.seq
}

export default Counter
