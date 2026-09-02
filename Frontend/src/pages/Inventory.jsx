import { AlertTriangle, Plus } from 'lucide-react'
import { items } from '../data/mockData'

export default function Inventory() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl">Inventory</h2>
          <p className="text-sm text-text-muted mt-1">{items.length} items across all categories</p>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-md">
          <Plus size={16} /> Add item
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-text-muted text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">Item</th>
              <th className="text-left font-medium px-4 py-3">Category</th>
              <th className="text-left font-medium px-4 py-3">Variant</th>
              <th className="text-right font-medium px-4 py-3">Cost</th>
              <th className="text-right font-medium px-4 py-3">Price</th>
              <th className="text-right font-medium px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const low = item.stock <= item.lowStockAt
              return (
                <tr key={item.id} className="border-t border-border hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-text-muted">{item.category}</td>
                  <td className="px-4 py-3 text-text-muted">{item.variant}</td>
                  <td className="px-4 py-3 text-right text-text-muted">{item.cost} DT</td>
                  <td className="px-4 py-3 text-right">{item.price} DT</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 font-medium ${low ? 'text-warning' : 'text-text'}`}>
                      {low && <AlertTriangle size={13} />}
                      {item.stock}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
