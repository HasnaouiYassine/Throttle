import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Trash2, Search, ShoppingCart } from 'lucide-react';
import { categories, getCategoryId } from '../data/catalog';
import { useAppData } from '../data/AppDataContext';

export default function Sale() {
  const { t } = useTranslation();
  const { items, createSale } = useAppData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  const [txnId, setTxnId] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [savingSale, setSavingSale] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

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
      const matchesCategory = selectedCategory === 'ALL' || getCategoryId(item) === selectedCategory;
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

  const logSale = async () => {
    if (!cart.length) return;
    setSavingSale(true);
    setCheckoutError('');
    try {
      await createSale({ txnId, paymentMethod, lines: cart.map((line) => ({ itemId: line.item.id, qty: line.qty })) });
      setCart([]);
      const p1 = Math.floor(10000 + Math.random() * 90000);
      const p2 = Math.floor(1 + Math.random() * 9);
      setTxnId(`TXN-${p1}-${p2}`);
    } catch (reason) {
      setCheckoutError(reason.message.startsWith('INSUFFICIENT_STOCK') ? 'Stock changed. Please review your cart.' : 'Could not log this sale.');
    } finally {
      setSavingSale(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen w-full bg-bg text-text font-sans lg:overflow-hidden">
      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col lg:h-full lg:overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between p-4 sm:p-6 border-b border-border-warm bg-surface shrink-0">
          <h1 className="text-2xl sm:text-[32px] font-bold">{t('sale.title')}</h1>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted rtl:left-auto rtl:right-4" />
            <input
              type="text"
              placeholder={t('sale.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-[48px] w-full sm:w-72 pl-12 pr-4 rtl:pl-4 rtl:pr-12 bg-surface-variant border border-border-warm rounded-none text-text focus:outline-none focus:border-accent font-mono placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-3 p-4 sm:p-6 overflow-x-auto shrink-0 border-b border-border-warm bg-surface-low">
          {[{ id: 'ALL' }, ...categories].map(cat => {
            const isActive = selectedCategory === cat.id;
            const label = cat.id === 'ALL' ? t('common.allParts') : t(`categories.${cat.id}`, { defaultValue: cat.name });
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[48px] px-4 sm:px-6 font-mono text-[12px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-accent text-white border-2 border-accent'
                    : 'bg-surface border border-border-warm text-text-warm hover:border-border-outline'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="lg:flex-1 lg:overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map(item => {
              const { stock, lowStockAt } = item;
              return (
                <div key={item.id} className="border border-border-warm hover:border-accent bg-surface flex flex-col transition-colors">
                  <div className="relative h-48 bg-surface-variant w-full shrink-0 overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className={`w-full h-full object-contain p-4 ${stock === 0 ? 'grayscale opacity-50' : ''}`}
                      />
                    )}
                    {stock > lowStockAt ? (
                      <div className="absolute top-0 start-0 bg-accent-light text-[#561f00] font-mono text-[12px] font-bold tracking-[0.1em] uppercase px-3 py-1">
                        {t('common.inStock')}: {stock}
                      </div>
                    ) : stock <= lowStockAt && stock > 0 ? (
                      <div className="absolute top-0 start-0 bg-accent-container text-[#572000] font-mono text-[12px] font-bold tracking-[0.1em] uppercase px-3 py-1">
                        {t('common.lowStock')}: {stock}
                      </div>
                    ) : (
                      <div className="absolute top-0 start-0 bg-danger text-white font-mono text-[12px] font-bold tracking-[0.1em] uppercase px-3 py-1">
                        {t('common.outOfStock')}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="font-mono text-[14px] text-text-warm mb-1 truncate">{item.sku}</div>
                    <div className="text-[18px] font-bold uppercase line-clamp-2 mb-4 flex-1">{item.name}</div>
                    <div className="flex items-center justify-between mt-auto gap-2">
                      <div className="text-[22px] sm:text-[24px] font-semibold text-accent-light whitespace-nowrap">
                        {item.price.toFixed(2)} DT
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={stock === 0}
                        aria-label={t('a11y.addToCart', { name: item.name })}
                        className="w-12 h-12 shrink-0 bg-surface-variant border border-border-warm hover:border-accent flex items-center justify-center disabled:opacity-50 disabled:hover:border-border-warm transition-colors"
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
      <div className="w-full lg:w-[35%] lg:min-w-[350px] bg-surface-high border-t-2 lg:border-t-0 lg:border-s-2 border-border-warm flex flex-col lg:h-full lg:overflow-hidden shrink-0">
        <div className="p-4 sm:p-6 border-b border-border-warm shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-xl sm:text-[24px] font-black uppercase tracking-tight leading-[32px]">{t('sale.currentSale')}</h2>
            <button 
              onClick={() => setCart([])}
              className="text-danger font-mono text-[12px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 hover:opacity-80 shrink-0"
            >
              <Trash2 className="w-4 h-4" /> {t('sale.clear')}
            </button>
          </div>
          <div className="font-mono text-text-warm">{txnId}</div>
        </div>

        <div className="lg:flex-1 lg:overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {cart.map(line => (
            <div key={line.item.id} className="bg-surface border border-border-warm p-4 flex flex-col gap-3 shrink-0">
              <div className="flex gap-3">
                <div className="w-14 h-14 shrink-0 bg-surface-variant border border-border-warm overflow-hidden">
                  {line.item.image && (
                    <img src={line.item.image} alt={line.item.name} className="w-full h-full object-contain p-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="font-bold uppercase leading-tight flex-1 truncate" title={line.item.name}>{line.item.name}</div>
                    <div className="font-mono text-accent-light font-bold whitespace-nowrap">
                      {line.item.price.toFixed(2)} DT
                    </div>
                  </div>
                  <div className="font-mono text-[14px] text-text-warm mt-1 truncate">{line.item.sku}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="flex items-center border border-border-warm bg-surface-container h-12 w-32 shrink-0">
                  <button 
                    onClick={() => changeQty(line.item.id, -1)}
                    aria-label={t('a11y.decQty')}
                    className="flex-1 flex items-center justify-center h-full hover:bg-surface-variant transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center h-full border-x border-border-warm font-mono font-bold">
                    {line.qty}
                  </div>
                  <button 
                    onClick={() => changeQty(line.item.id, 1)}
                    aria-label={t('a11y.incQty')}
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
              {t('sale.cartEmpty')}
            </div>
          )}
        </div>

        <div className="mt-auto p-4 sm:p-6 bg-surface border-t-2 border-border-warm shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="uppercase text-text-warm text-sm font-bold tracking-wider">{t('sale.subtotal')}</span>
            <span className="font-mono text-lg">{subtotal.toFixed(2)} DT</span>
          </div>
          <div className="flex justify-between items-center border-b border-border-warm mb-4 pb-4">
            <span className="uppercase text-text-warm text-sm font-bold tracking-wider">{t('sale.tax')}</span>
            <span className="font-mono text-lg">{tax.toFixed(2)} DT</span>
          </div>
          <div className="flex justify-between items-end mb-6 gap-2">
            <span className="text-2xl sm:text-[32px] font-black uppercase leading-none">{t('sale.total')}</span>
            <span className="text-3xl sm:text-[48px] font-bold text-accent tracking-tight leading-none whitespace-nowrap">
              {total.toFixed(2)} DT
            </span>
          </div>
          {checkoutError && <p className="mb-3 text-danger font-mono text-sm">{checkoutError}</p>}
          <button 
            onClick={logSale}
            className="w-full bg-accent-light text-[#572000] font-black text-xl sm:text-[24px] uppercase h-16 sm:h-20 flex items-center justify-center gap-4 border-4 border-accent-light hover:bg-accent-container active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
            disabled={cart.length === 0 || savingSale}
          >
            <ShoppingCart className="w-8 h-8" /> {savingSale ? 'SAVING…' : t('sale.logSale')}
          </button>
        </div>
      </div>
    </div>
  );
}
