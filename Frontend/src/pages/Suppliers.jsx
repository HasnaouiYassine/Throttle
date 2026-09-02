import { Plus } from 'lucide-react'
import { suppliers, purchaseOrders, items } from '../data/mockData'

export default function Suppliers() {
  return (
    <div className="p-8 max-w-6xl space-y-10">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Suppliers</h2>
          <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-md">
            <Plus size={16} /> Add supplier
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-surface border border-border rounded-lg p-4">
              <p className="font-medium text-sm">{s.name}</p>
              <p className="text-xs text-text-muted mt-1">{s.contact}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Purchase orders</h2>
          <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-md">
            <Plus size={16} /> New order
          </button>
        </div>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-text-muted text-xs uppercase tracking-wide">
                <th className="text-left font-medium px-4 py-3">Supplier</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Items</th>
                <th className="text-right font-medium px-4 py-3">Order cost</th>
                <th className="text-right font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => {
                const supplier = suppliers.find((s) => s.id === po.supplierId)
                const orderCost = po.items.reduce((sum, l) => sum + l.qty * l.cost, 0)
                return (
                  <tr key={po.id} className="border-t border-border hover:bg-surface/60">
                    <td className="px-4 py-3 font-medium">{supplier?.name}</td>
                    <td className="px-4 py-3 text-text-muted">{po.date}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {po.items.map((l) => items.find((it) => it.id === l.itemId)?.name).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-right">{orderCost} DT</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          po.status === 'Received'
                            ? 'bg-success/15 text-success'
                            : 'bg-warning/15 text-warning'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
