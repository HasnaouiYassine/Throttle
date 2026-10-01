import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  lowStockAt: { type: Number, default: 0 },
  variant: { type: String, default: '' },
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  barcode: { type: String, default: '' },
  image: { type: String, default: '' },
  createdAt: { type: String },
  updatedAt: { type: String },
})

// Strip _id and __v from JSON output, use "id" as the identifier
itemSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  },
})

const Item = mongoose.model('Item', itemSchema)

export default Item
