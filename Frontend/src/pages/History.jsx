import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { sales, items } from '../data/mockData'

export default function History() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return sales.filter((s) =>
      s.lines.some((l) =>
        items.find((it) => it.id === l.itemId)?.name.toLowerCase().includes(query.toLowerCase())
      )
    )
  }, [query])

  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-2xl mb-4">Sales history</h2>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by item…"
          className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((sale) => (
          <div key={sale.id} className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {sale.lines.map((l) => items.find((it) => it.id === l.itemId)?.name).join(', ')}
              </p>
              <p className="text-xs text-text-faint mt-0.5">
                {new Date(sale.timestamp).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
              </p>
            </div>
            <span className="font-display text-lg">{sale.total} DT</span>
          </div>
        ))}
      </div>
    </div>
  )
}
