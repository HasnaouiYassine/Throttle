import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { items, categories, getCategoryId } from '../data/mockData';
import { Search, Plus, Bell, Settings, Filter, MoreVertical, ChevronLeft, ChevronRight, AlertTriangle, Package } from 'lucide-react';

export default function Inventory() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'ALL' || getCategoryId(item) === activeCategory;
      const matchesLowStock = !lowStockOnly || (item.stock <= (item.lowStockAt || 5) && item.stock > 0); 
      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [searchQuery, activeCategory, lowStockOnly]);

  return (
    <div className="flex flex-col bg-bg lg:h-full lg:overflow-hidden text-text">
      {/* HEADER BAR */}
      <header className="bg-surface-container border-b-2 border-border-warm px-4 sm:px-6 py-3 shrink-0 flex flex-col xl:flex-row gap-3 xl:justify-between xl:items-center">
        <h1 className="font-sans text-2xl sm:text-[32px] font-bold text-text uppercase tracking-tight">
          {t('inventory.title')}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="relative flex-1 sm:flex-none min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 rtl:left-auto rtl:right-3" />
            <input 
              type="text" 
              placeholder={t('inventory.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-12 bg-surface border border-border-warm text-text font-mono pl-10 pr-4 rtl:pl-4 rtl:pr-10 placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
          <button aria-label={t('a11y.notifications')} className="w-12 h-12 flex items-center justify-center bg-surface border border-border-warm hover:border-accent transition-colors">
            <Bell className="w-5 h-5 text-text-warm" />
          </button>
          <button aria-label={t('a11y.settings')} className="w-12 h-12 flex items-center justify-center bg-surface border border-border-warm hover:border-accent transition-colors">
            <Settings className="w-5 h-5 text-text-warm" />
          </button>
          <button className="bg-accent-container text-[#572000] font-mono text-[12px] font-bold tracking-[0.1em] uppercase h-12 px-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            {t('inventory.addNew')}
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="bg-surface-container p-4 border border-border-warm shrink-0 flex flex-col xl:flex-row gap-3 xl:justify-between xl:items-center m-4 mb-0">
        <div className="flex items-center gap-2 overflow-x-auto w-full">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`h-10 px-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${
              activeCategory === 'ALL'
                ? 'border-2 border-accent text-accent bg-surface-high'
                : 'border border-border-warm text-text-warm hover:border-border-outline'
            }`}
          >
            {t('inventory.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`h-10 px-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'border-2 border-accent text-accent bg-surface-high'
                  : 'border border-border-warm text-text-warm hover:border-border-outline'
              }`}
            >
              {t(`categories.${cat.id}`, { defaultValue: cat.name })}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 xl:pl-6 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="w-5 h-5 accent-accent cursor-pointer border-border-warm bg-surface"
            />
            <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm group-hover:text-text transition-colors">
              {t('inventory.lowStockOnly')}
            </span>
          </label>
          <div className="w-px h-6 bg-border-warm hidden sm:block" />
          <button className="flex items-center gap-2 h-10 px-4 border border-border-warm text-text-warm font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:text-text hover:border-border-outline transition-colors">
            <Filter className="w-4 h-4" />
            {t('inventory.moreFilters')}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-surface border border-border-warm overflow-auto flex flex-col m-4 mt-4 min-h-0">
        {/* Header row */}
        <div className="grid grid-cols-[3rem_1fr_10rem_10rem_6rem_8rem_8rem_4rem] min-w-[880px] gap-4 p-4 bg-surface-high border-b-2 border-border-warm shrink-0">
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('inventory.img')}</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('inventory.itemSku')}</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('inventory.category')}</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('inventory.sizeColor')}</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('inventory.stock')}</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('inventory.cost')}</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('inventory.price')}</div>
          <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm text-center">{t('inventory.acts')}</div>
        </div>
        
        {/* Body rows */}
        <div className="flex-1 min-h-0 lg:overflow-y-auto">
          {filteredItems.map(item => {
            const isOutOfStock = item.stock === 0;
            const isLowStock = !isOutOfStock && item.stock <= (item.lowStockAt || 5);
            
            return (
              <div 
                key={item.id} 
                className={`grid grid-cols-[3rem_1fr_10rem_10rem_6rem_8rem_8rem_4rem] min-w-[880px] gap-4 p-4 border-b border-surface-variant items-center hover:bg-surface-low transition-colors ${isOutOfStock ? 'opacity-60' : ''}`}
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
                  {t(`categories.${getCategoryId(item)}`, { defaultValue: item.category })}
                </div>
                
                <div className="font-mono text-[14px] text-text-faint">
                  {item.size && <div className="truncate">{t('inventory.sizeShort')}: {item.size}</div>}
                  {item.color && <div className="truncate">{t('inventory.colorShort')}: {item.color}</div>}
                  {!item.size && !item.color && '-'}
                </div>
                
                <div>
                  {isOutOfStock ? (
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-lg font-bold text-danger">0</span>
                      <span className="bg-danger text-white font-mono text-[10px] font-bold px-1 mt-1 rounded-sm tracking-wider">
                        {t('common.outOfStock')}
                      </span>
                    </div>
                  ) : isLowStock ? (
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-lg font-bold text-accent-container">{item.stock}</span>
                      <span className="bg-accent-container text-[#572000] font-mono text-[10px] font-bold px-1 mt-1 rounded-sm tracking-wider flex items-center gap-1">
                        {t('common.lowStock')}
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
              {t('inventory.empty')}
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-4 border-t-2 border-border-warm bg-surface-high flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center shrink-0">
        <div className="font-mono text-[14px] text-text-warm">
          {t('common.showingItems', { shown: filteredItems.length, total: filteredItems.length })}
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 border border-border-warm bg-surface font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:border-border-outline hover:text-accent transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            {t('common.prev')}
          </button>
          <button className="h-10 px-4 border border-border-warm bg-surface font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:border-border-outline hover:text-accent transition-colors flex items-center gap-1">
            {t('common.next')}
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
