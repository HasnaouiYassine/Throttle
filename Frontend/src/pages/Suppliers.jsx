import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Settings, Bell, Eye } from 'lucide-react';
import { suppliers, purchaseOrders, items, getCategoryId } from '../data/mockData';

export default function Suppliers() {
  const { t } = useTranslation();

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : t('suppliers.unknown');
  };

  const getStatusLabel = (status) => {
    if (status === 'Pending') return t('suppliers.pending');
    if (status === 'Received') return t('suppliers.received');
    return status;
  };

  const getPoTotal = (po) => {
    let total = 0;
    po.items.forEach(poItem => {
      if (poItem.cost !== undefined) {
        total += poItem.quantity * poItem.cost;
      } else {
        const itemRef = items.find(i => i.id === poItem.itemId);
        if (itemRef) {
          total += poItem.quantity * (itemRef.cost || 0);
        }
      }
    });
    return total.toFixed(2);
  };

  return (
    <div className="min-h-full bg-bg flex flex-col">
      {/* Header Bar */}
      <header className="bg-surface-container border-b-2 border-border-warm px-4 sm:px-6 py-2 flex justify-between items-center gap-2 sticky top-0 z-10 min-h-[3rem]">
        <h1 className="font-sans text-xl sm:text-[32px] font-bold text-accent-light truncate">
          {t('suppliers.title')}
        </h1>
        <div className="flex gap-2 sm:gap-4 shrink-0">
          <button aria-label={t('a11y.settings')} className="text-text-warm hover:text-accent-light flex items-center min-h-[48px] justify-center">
            <Settings size={20} />
          </button>
          <button aria-label={t('a11y.notifications')} className="text-text-warm hover:text-accent-light flex items-center min-h-[48px] justify-center">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 flex flex-col lg:flex-row gap-4 flex-1">
        {/* Left Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="flex justify-between items-center gap-2">
            <h2 className="font-sans text-xl sm:text-[24px] font-semibold leading-[32px] text-text">{t('suppliers.active')}</h2>
            <button className="flex items-center gap-2 border-2 border-border-warm text-text h-12 px-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:border-accent min-h-[48px] shrink-0">
              <Plus size={16} /> {t('suppliers.new')}
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="bg-surface-high border-2 border-border-warm p-4 hover:border-accent transition-colors cursor-pointer">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-sans text-[18px] font-bold text-accent-light min-w-0">{supplier.name}</h3>
                  <span className="bg-surface-variant text-text-warm px-2 py-1 font-mono text-[12px] font-bold tracking-[0.1em] border border-border-warm uppercase shrink-0">
                    {supplier.shortId || supplier.id.substring(0,6)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <p className="font-mono text-[14px] text-text-warm">{t('suppliers.contact')}: {supplier.contactPerson}</p>
                  <p className="font-mono text-[14px] text-text-warm">{t('suppliers.phone')}: {supplier.phone}</p>
                  <p className="font-mono text-[14px] text-text-warm">{t('suppliers.terms')}: {supplier.terms}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supplier.categories && supplier.categories.map((category, index) => (
                    <span 
                      key={category} 
                      className={
                        index === 0 
                        ? "bg-accent-container text-[#572000] px-2 py-1 font-mono text-[12px] font-bold tracking-[0.1em] uppercase" 
                        : "bg-surface-variant text-text-warm px-2 py-1 font-mono text-[12px] font-bold tracking-[0.1em] uppercase"
                      }
                    >
                      {t(`categories.${getCategoryId(category)}`, { defaultValue: category })}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 min-w-0">
          <div className="bg-surface-container border-2 border-border-warm p-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
            <div>
              <h2 className="font-sans text-xl sm:text-[24px] font-semibold leading-[32px] text-text">{t('suppliers.orders')}</h2>
              <p className="font-mono text-[14px] text-text-warm">{t('suppliers.ordersSubtitle')}</p>
            </div>
            <button className="bg-accent-container text-[#572000] font-black text-[16px] sm:text-[18px] h-12 px-6 border-2 border-transparent uppercase hover:opacity-90 min-h-[48px] whitespace-nowrap">
              {t('suppliers.newOrder')}
            </button>
          </div>

          <div className="bg-surface-low border-2 border-border-warm overflow-x-auto">
            <table className="w-full min-w-[680px] text-left rtl:text-right border-collapse">
              <thead className="bg-surface-variant border-b-2 border-border-warm">
                <tr>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">{t('suppliers.poNumber')}</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">{t('suppliers.supplier')}</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">{t('suppliers.date')}</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">{t('suppliers.totalCost')}</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">{t('suppliers.status')}</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text text-right rtl:text-left">{t('suppliers.actions')}</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[14px]">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="border-b border-border-outline hover:bg-surface-high transition-colors">
                    <td className={`p-4 font-bold ${po.status === 'Pending' ? 'text-accent-light' : 'text-text'}`}>
                      {po.poNumber || po.id}
                    </td>
                    <td className="p-4 text-text">{getSupplierName(po.supplierId)}</td>
                    <td className="p-4 text-text-warm">{po.date}</td>
                    <td className="p-4 text-text">{getPoTotal(po)} DT</td>
                    <td className="p-4">
                      {po.status === 'Pending' ? (
                        <span className="bg-accent-container text-[#572000] border border-accent px-2 py-1 font-mono text-[12px] font-bold tracking-[0.1em] uppercase inline-block">
                          {getStatusLabel(po.status)}
                        </span>
                      ) : (
                        <span className="bg-surface-variant text-text-warm border border-border-warm px-2 py-1 font-mono text-[12px] font-bold tracking-[0.1em] uppercase inline-block">
                          {getStatusLabel(po.status)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right rtl:text-left flex justify-end">
                      <button className="text-text-warm hover:text-accent-light p-2 inline-flex min-h-[48px] items-center justify-center">
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
