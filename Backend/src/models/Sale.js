import mongoose from 'mongoose'

const saleLineSchema = new mongoose.Schema({
  itemId: { type: Number, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
}, { _id: false })

const saleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  txnId: { type: String, required: true },
  timestamp: { type: String, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'Financing'], default: 'Cash' },
  paymentDetail: { type: String, default: '' },
  lines: { type: [saleLineSchema], default: [] },
})

saleSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  },
})

const Sale = mongoose.model('Sale', saleSchema)

export default Sale
