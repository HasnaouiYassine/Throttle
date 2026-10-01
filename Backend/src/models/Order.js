import mongoose from 'mongoose'

const orderLineSchema = new mongoose.Schema({
  itemId: { type: Number, required: true },
  qty: { type: Number, required: true },
  cost: { type: Number, required: true },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  sequence: { type: Number, required: true },
  supplierId: { type: Number, default: null },
  supplierName: { type: String, default: '' },
  date: { type: String },
  status: { type: String, enum: ['Pending', 'Received', 'Cancelled'], default: 'Pending' },
  items: { type: [orderLineSchema], default: [] },
  receivedAt: { type: String, default: null },
  createdAt: { type: String },
  updatedAt: { type: String },
})

orderSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  },
})

const Order = mongoose.model('Order', orderSchema)

export default Order
