import { useState, useMemo } from 'react'
import { Plus, Minus, Trash2, Search } from 'lucide-react'
import { items, categories } from '../data/mockData'

export default function Sale() {
  const [cart, setCart] = useState([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesCategory = activeCategory === 'All' || it.category === activeCategory
      const matchesQuery = it.name.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === item.id)
      if (existing) {
        return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    )
  }

  function removeLine(id) {
    setCart((prev) => prev.filter((l) => l.id !== id))
  }

  const total = cart.reduce((sum, l) => sum + l.qty * l.price, 0)

  return (
    <div className="flex h-screen">
      {/* Item picker */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl mb-4">New sale</h2>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items…"
              className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeCategory === c
                  ? 'bg-accent border-accent text-white'
                  : 'border-border text-text-muted hover:text-text'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              disabled={item.stock === 0}
              className="text-left bg-surface border border-border rounded-lg p-4 hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-medium">{item.name}</span>
                {item.stock <= item.lowStockAt && (
                  <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-warning/15 text-warning">
                    {item.stock === 0 ? 'OUT' : 'LOW'}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-faint mt-0.5">{item.variant}</p>
              <div className="flex justify-between items-end mt-3">
                <span className="text-lg font-display">{item.price} DT</span>
                <span className="text-xs text-text-muted">{item.stock} in stock</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-96 shrink-0 border-l border-border flex flex-col bg-surface">
        <div className="px-5 py-5 border-b border-border">
          <h3 className="text-lg">Current sale</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 && (
            <p className="text-sm text-text-faint">Tap an item to add it to the sale.</p>
          )}
          {cart.map((line) => (
            <div key={line.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{line.name}</p>
                <p className="text-xs text-text-faint">{line.price} DT</p>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-2 rounded-md px-1.5 py-1">
                <button onClick={() => changeQty(line.id, -1)} className="p-1 hover:text-accent">
                  <Minus size={13} />
                </button>
                <span className="text-sm w-4 text-center">{line.qty}</span>
                <button onClick={() => changeQty(line.id, 1)} className="p-1 hover:text-accent">
                  <Plus size={13} />
                </button>
              </div>
              <button onClick={() => removeLine(line.id)} className="text-text-faint hover:text-danger">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 py-5 border-t border-border space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-text-muted">Total</span>
            <span className="text-3xl font-display">{total} DT</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={() => setCart([])}
            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-md transition-colors"
          >
            Log sale
          </button>
        </div>
      </div>
    </div>
  )
}
