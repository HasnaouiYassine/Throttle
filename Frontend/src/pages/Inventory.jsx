import React, { useState, useMemo } from 'react';
import { items, categories } from '../data/mockData';
import { Search, Plus, Bell, Settings, Filter, MoreVertical, ChevronLeft, ChevronRight, AlertTriangle, Package } from 'lucide-react';

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
      const matchesLowStock = !lowStockOnly || (item.stock <= (item.lowStockAt || 5) && item.stock > 0); 
      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [searchQuery, activeCategory, lowStockOnly]);

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden text-text">
      {/* HEADER BAR */}
      <header className="bg-surface-container border-b-2 border-border-warm h-20 px-6 shrink-0 flex justify-between items-center">
        <h1 className="font-sans text-[32px] font-bold text-text uppercase tracking-tight">
          INVENTORY MANAGEMENT
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="SCAN BARCODE OR SEARCH..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-12 bg-surface border border-border-warm text-text font-mono pl-10 pr-4 placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-surface border border-border-warm hover:border-accent transition-colors">
            <Bell className="w-5 h-5 text-text-warm" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-surface border border-border-warm hover:border-accent transition-colors">
            <Settings className="w-5 h-5 text-text-warm" />
          </button>
          <button className="bg-accent-container text-[#572000] font-mono text-[12px] font-bold tracking-[0.1em] uppercase h-12 px-6 flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            ADD NEW ITEM
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="bg-surface-container p-4 border border-border-warm shrink-0 flex justify-between items-center m-4 mb-0">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`h-10 px-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${
              activeCategory === 'ALL'
                ? 'border-2 border-accent text-accent bg-surface-high'
                : 'border border-border-warm text-text-warm hover:border-border-outline'
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`h-10 px-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${
                activeCategory === cat.name
                  ? 'border-2 border-accent text-accent bg-surface-high'
                  : 'border border-border-warm text-text-warm hover:border-border-outline'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 pl-6 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="w-5 h-5 accent-accent cursor-pointer border-border-warm bg-surface"
            />
            <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm group-hover:text-text transition-colors">
              SHOW LOW STOCK ONLY
            </span>
          </label>
          <div className="w-px h-6 bg-border-warm" />
          <button className="flex items-center gap-2 h-10 px-4 border border-border-warm text-text-warm font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:text-text hover:border-border-outline transition-colors">
            <Filter className="w-4 h-4" />
            MORE FILTERS
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-surface border border-border-warm overflow-hidden flex flex-col m-4 mt-4">
        {/* Header row */}
        <div className="grid grid-cols-[3rem_1fr_10rem_10rem_6rem_8rem_8rem_4rem] gap-4 p-4 bg-surface-high border-b-2 border-border-warm shrink-0">
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">IMG</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">ITEM NAME & SKU</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">CATEGORY</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">SIZE / COLOR</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">STOCK</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">COST</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">SALE PRICE</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm text-center">ACTS</div>
        </div>
        
        {/* Body rows */}
        <div className="flex-1 overflow-y-auto">
          {filteredItems.map(item => {
            const isOutOfStock = item.stock === 0;
            const isLowStock = !isOutOfStock && item.stock <= (item.lowStockAt || 5);
            
            return (
              <div 
                key={item.id} 
                className={`grid grid-cols-[3rem_1fr_10rem_10rem_6rem_8rem_8rem_4rem] gap-4 p-4 border-b border-surface-variant items-center hover:bg-surface-low transition-colors ${isOutOfStock ? 'opacity-60' : ''}`}
              >
                <div>
                  <div className="w-12 h-12 bg-surface-variant border border-border-warm overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                </div>
                
                <div className="min-w-0">
                  <div className="font-semibold truncate hover:text-accent-light cursor-pointer transition-colors" title={item.name}>
                    {item.name}
                  </div>
                  <div className="font-mono text-[14px] text-text-warm truncate mt-1">
                    {item.sku}
                  </div>
                </div>
                
                <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm truncate">
                  {item.category}
                </div>
                
                <div className="font-mono text-[14px] text-text-faint">
                  {item.size && <div className="truncate">Sz: {item.size}</div>}
                  {item.color && <div className="truncate">Col: {item.color}</div>}
                  {!item.size && !item.color && '-'}
                </div>
                
                <div>
                  {isOutOfStock ? (
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-lg font-bold text-danger">0</span>
                      <span className="bg-danger text-white font-mono text-[10px] font-bold px-1 mt-1 rounded-sm tracking-wider">
                        OUT OF STOCK
                      </span>
                    </div>
                  ) : isLowStock ? (
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-lg font-bold text-accent-container">{item.stock}</span>
                      <span className="bg-accent-container text-[#572000] font-mono text-[10px] font-bold px-1 mt-1 rounded-sm tracking-wider flex items-center gap-1">
                        LOW STOCK
                      </span>
                    </div>
                  ) : (
                    <div className="font-mono text-lg font-bold">
                      {item.stock}
                    </div>
                  )}
                </div>
                
                <div className="font-mono text-text-warm">
                  {item.cost ? `${item.cost.toFixed(2)} DT` : '-'}
                </div>
                
                <div className="font-mono font-bold text-lg">
                  {item.price.toFixed(2)} DT
                </div>
                
                <div className="flex justify-center">
                  <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant hover:text-accent transition-colors rounded-sm text-text-muted">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="p-8 text-center font-mono text-text-warm">
              NO ITEMS FOUND MATCHING YOUR FILTERS.
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-4 border-t-2 border-border-warm bg-surface-high flex justify-between items-center shrink-0">
        <div className="font-mono text-[14px] text-text-warm">
          Showing 1 - {filteredItems.length} of {filteredItems.length} Items
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 border border-border-warm bg-surface font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:border-border-outline hover:text-accent transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            PREV
          </button>
          <button className="h-10 px-4 border border-border-warm bg-surface font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:border-border-outline hover:text-accent transition-colors flex items-center gap-1">
            NEXT
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
