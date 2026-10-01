import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  shortId: { type: String, required: true },
  name: { type: String, required: true },
  contactPerson: { type: String, default: '' },
  phone: { type: String, default: '' },
  terms: { type: String, default: '' },
  categories: { type: [String], default: [] },
  createdAt: { type: String },
  updatedAt: { type: String },
})

supplierSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  },
})

const Supplier = mongoose.model('Supplier', supplierSchema)

export default Supplier
