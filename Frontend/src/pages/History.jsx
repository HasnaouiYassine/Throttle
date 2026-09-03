import React, { useState, useEffect } from 'react';
import {
  Search,
  Settings,
  Bell,
  User,
  Download,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Banknote,
  Building2,
  X,
  Printer,
  RotateCcw,
  Receipt
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sales, items } from '../data/mockData';

const History = () => {
  const { t } = useTranslation();
  const [selectedSale, setSelectedSale] = useState(null);

  const payLabel = (method) => {
    if (method === 'Card') return t('payment.card');
    if (method === 'Cash') return t('payment.cash');
    if (method === 'Financing') return t('payment.financing');
    return method;
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setSelectedSale(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="flex flex-col bg-bg text-text lg:h-screen lg:overflow-hidden min-h-full">
      {/* HEADER BAR */}
      <header className="bg-surface-container border-b-2 border-border-warm px-4 sm:px-6 py-2 min-h-[3rem] flex justify-between items-center gap-2 sticky top-0 z-10 shrink-0">
        <div className="font-sans text-lg sm:text-[24px] font-black text-accent-light uppercase truncate">
          {t('history.title')}
        </div>
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-warm rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('history.quickLocate')}
              className="w-64 pl-10 pr-4 rtl:pl-4 rtl:pr-10 h-12 bg-surface border border-border-warm font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text placeholder-text-warm focus:outline-none focus:border-accent"
            />
          </div>
          <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:text-accent-light transition-colors" aria-label={t('a11y.settings')}>
            <Settings className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 sm:w-12 sm:h-12 hidden sm:flex items-center justify-center hover:text-accent-light transition-colors" aria-label={t('a11y.notifications')}>
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 sm:w-12 sm:h-12 hidden sm:flex items-center justify-center hover:text-accent-light transition-colors" aria-label={t('a11y.account')}>
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-6">
        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-8 sm:items-end p-4 sm:p-6 pt-4 sm:pt-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">
              {t('history.dateRange')}
            </label>
            <select className="bg-surface border-2 border-border-warm h-12 px-4 text-text font-sans focus:outline-none focus:border-accent w-full sm:w-auto">
              <option>{t('history.today')}</option>
              <option>{t('history.yesterday')}</option>
              <option>{t('history.last7')}</option>
              <option>{t('history.thisMonth')}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">
              {t('history.paymentType')}
            </label>
            <select className="bg-surface border-2 border-border-warm h-12 px-4 text-text font-sans focus:outline-none focus:border-accent w-full sm:w-auto">
              <option>{t('history.allMethods')}</option>
              <option>{t('history.card')}</option>
              <option>{t('history.cash')}</option>
              <option>{t('history.financing')}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">
              {t('history.scanSearch')}
            </label>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-warm rtl:left-auto rtl:right-4" />
              <input
                type="text"
                placeholder={t('history.scanPlaceholder')}
                className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 h-12 bg-surface border-2 border-border-warm font-mono text-[14px] text-text placeholder-text-warm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 border-2 border-border-warm bg-surface h-12 px-6 font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-surface-variant transition-colors text-text w-full sm:w-auto">
            <Download className="w-4 h-4" />
            {t('history.export')}
          </button>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-surface border-2 border-border-warm mx-4 sm:mx-6 overflow-x-auto">
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] min-w-[720px] gap-4 p-4 bg-surface-high border-b-2 border-border-warm">
            <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('history.dateTime')}</div>
            <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('history.saleId')}</div>
            <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm text-center">{t('history.items')}</div>
            <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm text-right rtl:text-left">{t('history.total')}</div>
            <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">{t('history.method')}</div>
            <div className="w-8"></div>
          </div>

          {sales.map((sale) => {
            const { date, time } = formatTimestamp(sale.timestamp);
            return (
              <div
                key={sale.id}
                onClick={() => setSelectedSale(sale)}
                className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] min-w-[720px] gap-4 p-4 border-b border-border-warm hover:bg-surface-variant border-l-4 border-l-transparent hover:border-l-accent transition-all cursor-pointer group items-center"
              >
                <div>
                  <div className="font-mono text-[14px] text-text">{date}</div>
                  <div className="text-text-warm text-xs mt-1">{time}</div>
                </div>
                <div className="font-mono text-[14px] font-bold text-accent-light">
                  {sale.txnId}
                </div>
                <div className="font-mono text-[14px] text-center">
                  {sale.lines.length}
                </div>
                <div className="font-mono text-[14px] text-right">
                  {sale.total.toFixed(2)} DT
                </div>
                <div>
                  <div className="bg-surface-high border border-border-warm text-text font-mono text-[12px] font-bold tracking-[0.1em] uppercase px-2 py-1 inline-flex items-center gap-1">
                    {sale.paymentMethod === 'Card' && <CreditCard className="w-3.5 h-3.5" />}
                    {sale.paymentMethod === 'Cash' && <Banknote className="w-3.5 h-3.5" />}
                    {sale.paymentMethod === 'Financing' && <Building2 className="w-3.5 h-3.5" />}
                    <span>{sale.paymentDetail || payLabel(sale.paymentMethod).toUpperCase()}</span>
                  </div>
                </div>
                <div className="w-8 flex justify-center text-text-warm group-hover:text-accent-light transition-colors">
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mt-4 mx-4 sm:mx-6 mb-6">
          <div className="font-mono text-[14px] text-text-warm">
            {t('common.showingRecords', { shown: sales.length, total: sales.length })}
          </div>
          <div className="flex gap-2">
            <button className="h-10 px-4 border border-border-warm bg-surface font-mono text-[12px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              {t('common.prev')}
            </button>
            <button className="h-10 px-4 border border-border-warm bg-surface font-mono text-[12px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 hover:bg-surface-variant transition-colors">
              {t('common.next')}
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </main>

      {/* RECEIPT PANEL */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
          <div 
            className="absolute inset-0 z-0" 
            onClick={() => setSelectedSale(null)} 
          />
          <div className="w-full max-w-md bg-surface h-full border-s-2 border-accent flex flex-col z-10 relative">
            <div className="bg-surface-container p-4 border-b-2 border-border-warm flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-accent-light" />
                <h2 className="font-sans text-xl sm:text-[24px] font-semibold text-text uppercase tracking-tight">
                  {t('history.details')}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedSale(null)}
                className="w-12 h-12 flex items-center justify-center text-text-warm hover:text-accent-light transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-[14px]">
              {/* Meta Section */}
              <div className="border-b-2 border-dashed border-border-warm pb-6 mb-8 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-text-warm">{t('history.saleIdLabel')}</span>
                  <span className="text-accent-light font-bold">{selectedSale.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-warm">{t('history.dateTimeLabel')}</span>
                  <span className="text-text">
                    {formatTimestamp(selectedSale.timestamp).date} {formatTimestamp(selectedSale.timestamp).time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-warm">{t('history.operatorLabel')}</span>
                  <span className="text-text">{t('brand.operator')}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-8">
                <div className="flex justify-between font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm border-b border-border-warm pb-2 mb-4">
                  <span>{t('history.item')}</span>
                  <span>{t('history.total')}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {selectedSale.lines.map((line, idx) => {
                    const item = items.find(i => i.id === line.itemId) || {};
                    return (
                      <div key={idx} className="flex flex-col">
                        <div className="flex justify-between">
                          <span className="font-bold text-text truncate max-w-[200px]" title={item.name}>{item.name || 'Unknown Item'}</span>
                          <span className="text-text">{(line.qty * line.price).toFixed(2)}</span>
                        </div>
                        <div className="text-text-warm text-xs mt-1">
                          {item.sku} &middot; {line.qty} x {line.price.toFixed(2)} DT
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-dashed border-border-warm pt-6 mb-8 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-text-warm">{t('sale.subtotal')}</span>
                  <span className="text-text">{(selectedSale.total / 1.08).toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-warm">{t('sale.tax')}</span>
                  <span className="text-text">{(selectedSale.total - (selectedSale.total / 1.08)).toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-text-warm mb-2 font-bold">{t('history.total')}</span>
                  <span className="font-sans text-4xl sm:text-[48px] font-bold text-accent leading-[48px]">
                    {selectedSale.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Box */}
              <div className="bg-surface-container p-4 border border-border-warm">
                <div className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm mb-2">
                  {t('history.paymentMethod')}
                </div>
                <div className="flex items-center gap-2 font-bold text-text">
                  {selectedSale.paymentMethod === 'Card' && <CreditCard className="w-5 h-5" />}
                  {selectedSale.paymentMethod === 'Cash' && <Banknote className="w-5 h-5" />}
                  {selectedSale.paymentMethod === 'Financing' && <Building2 className="w-5 h-5" />}
                  <span>{selectedSale.paymentDetail || payLabel(selectedSale.paymentMethod).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface-container border-t-2 border-border-warm grid grid-cols-2 gap-4 shrink-0">
              <button className="bg-surface border-2 border-border-warm text-text font-mono text-[12px] font-bold tracking-[0.1em] uppercase h-12 flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors">
                <Printer className="w-4 h-4" />
                {t('history.reprint')}
              </button>
              <button className="bg-surface border-2 border-danger text-danger font-mono text-[12px] font-bold tracking-[0.1em] uppercase h-12 flex items-center justify-center gap-2 hover:bg-danger/10 transition-colors">
                <RotateCcw className="w-4 h-4" />
                {t('history.voidReturn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
