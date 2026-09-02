import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, Trash2, Search, ShoppingCart } from 'lucide-react';
import { items, categories } from '../data/mockData';

export default function Sale() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Gear');
  const [cart, setCart] = useState([]);
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    // Generate TXN-XXXXX-X
    const generateId = () => {
      const p1 = Math.floor(10000 + Math.random() * 90000);
      const p2 = Math.floor(1 + Math.random() * 9);
      return `TXN-${p1}-${p2}`;
    };
    setTxnId(generateId());
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'All Gear' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.sku.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const addToCart = (item) => {
    if (item.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(line => line.item.id === item.id);
      if (existing) {
        return prev.map(line => 
          line.item.id === item.id 
            ? { ...line, qty: Math.min(line.qty + 1, item.stock) } 
            : line
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const changeQty = (itemId, delta) => {
    setCart(prev => {
      return prev.map(line => {
        if (line.item.id === itemId) {
          const newQty = line.qty + delta;
          if (newQty <= 0) return null;
          return { ...line, qty: Math.min(newQty, line.item.stock) };
        }
        return line;
      }).filter(Boolean);
    });
  };

  const subtotal = cart.reduce((sum, line) => sum + (line.item.price * line.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="flex h-screen w-full bg-bg text-text font-sans overflow-hidden">
      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6 border-b border-border-warm bg-surface shrink-0">
          <h1 className="text-[32px] font-bold">Categories</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search SKU or Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-[48px] w-72 pl-12 pr-4 bg-surface-variant border border-border-warm rounded-none text-text focus:outline-none focus:border-accent font-mono placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-3 p-6 overflow-x-auto shrink-0 border-b border-border-warm bg-surface-low">
          {['All Gear', ...categories.map(c => c.name)].map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[48px] px-6 font-mono text-[12px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-accent text-white border-2 border-accent'
                    : 'bg-surface border border-border-warm text-text-warm hover:border-border-outline'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const { stock, lowStockAt } = item;
              return (
                <div key={item.id} className="border border-border-warm hover:border-accent bg-surface flex flex-col transition-colors">
                  <div className="relative h-48 bg-surface-variant w-full shrink-0">
                    {stock > lowStockAt ? (
                      <div className="absolute top-0 left-0 bg-accent-light text-[#561f00] font-mono text-[12px] font-bold tracking-[0.1em] uppercase px-3 py-1">
                        IN STOCK: {stock}
                      </div>
                    ) : stock <= lowStockAt && stock > 0 ? (
                      <div className="absolute top-0 left-0 bg-accent-container text-[#572000] font-mono text-[12px] font-bold tracking-[0.1em] uppercase px-3 py-1">
                        LOW STOCK: {stock}
                      </div>
                    ) : (
                      <div className="absolute top-0 left-0 bg-danger text-white font-mono text-[12px] font-bold tracking-[0.1em] uppercase px-3 py-1">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="font-mono text-[14px] text-text-warm mb-1">{item.sku}</div>
                    <div className="text-[18px] font-bold uppercase line-clamp-2 mb-4 flex-1">{item.name}</div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-[24px] font-semibold text-accent-light">
                        {item.price.toFixed(2)} DT
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={stock === 0}
                        className="w-12 h-12 bg-surface-variant border border-border-warm hover:border-accent flex items-center justify-center disabled:opacity-50 disabled:hover:border-border-warm transition-colors"
                      >
                        <Plus className="w-6 h-6 text-text" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[35%] min-w-[350px] bg-surface-high border-l-2 border-border-warm flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-border-warm shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[24px] font-black uppercase tracking-tight leading-[32px]">CURRENT SALE</h2>
            <button 
              onClick={() => setCart([])}
              className="text-danger font-mono text-[12px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 hover:opacity-80"
            >
              <Trash2 className="w-4 h-4" /> CLEAR
            </button>
          </div>
          <div className="font-mono text-text-warm">{txnId}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cart.map(line => (
            <div key={line.item.id} className="bg-surface border border-border-warm p-4 flex flex-col gap-3 shrink-0">
              <div className="flex justify-between items-start gap-4">
                <div className="font-bold uppercase leading-tight flex-1">{line.item.name}</div>
                <div className="font-mono text-accent-light font-bold whitespace-nowrap">
                  {line.item.price.toFixed(2)} DT
                </div>
              </div>
              <div className="font-mono text-[14px] text-text-warm">{line.item.sku}</div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border border-border-warm bg-surface-container h-12 w-32 shrink-0">
                  <button 
                    onClick={() => changeQty(line.item.id, -1)}
                    className="flex-1 flex items-center justify-center h-full hover:bg-surface-variant transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center h-full border-x border-border-warm font-mono font-bold">
                    {line.qty}
                  </div>
                  <button 
                    onClick={() => changeQty(line.item.id, 1)}
                    className="flex-1 flex items-center justify-center h-full hover:bg-surface-variant transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-mono text-lg font-bold whitespace-nowrap">
                  {(line.item.price * line.qty).toFixed(2)} DT
                </div>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center text-text-muted font-mono mt-10">
              Cart is empty
            </div>
          )}
        </div>

        <div className="mt-auto p-6 bg-surface border-t-2 border-border-warm shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="uppercase text-text-warm text-sm font-bold tracking-wider">Subtotal</span>
            <span className="font-mono text-lg">{subtotal.toFixed(2)} DT</span>
          </div>
          <div className="flex justify-between items-center border-b border-border-warm mb-4 pb-4">
            <span className="uppercase text-text-warm text-sm font-bold tracking-wider">Tax (8%)</span>
            <span className="font-mono text-lg">{tax.toFixed(2)} DT</span>
          </div>
          <div className="flex justify-between items-end mb-6">
            <span className="text-[32px] font-black uppercase leading-none">TOTAL</span>
            <span className="text-[48px] font-bold text-accent tracking-tight leading-none">
              {total.toFixed(2)} DT
            </span>
          </div>
          <button 
            className="w-full bg-accent-light text-[#572000] font-black text-[24px] uppercase h-20 flex items-center justify-center gap-4 border-4 border-accent-light hover:bg-accent-container active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
            disabled={cart.length === 0}
          >
            <ShoppingCart className="w-8 h-8" /> LOG SALE
          </button>
        </div>
      </div>
    </div>
  );
}
