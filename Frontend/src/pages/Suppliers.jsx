import React from 'react';
import { Plus, Settings, Bell, Eye } from 'lucide-react';
import { suppliers, purchaseOrders, items } from '../data/mockData';

export default function Suppliers() {
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown';
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
          Suppliers & Purchase Orders
        </h1>
        <div className="flex gap-2 sm:gap-4 shrink-0">
          <button className="text-text-warm hover:text-accent-light flex items-center min-h-[48px] justify-center" aria-label="Settings">
            <Settings size={20} />
          </button>
          <button className="text-text-warm hover:text-accent-light flex items-center min-h-[48px] justify-center" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 flex flex-col lg:flex-row gap-4 flex-1">
        {/* Left Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="flex justify-between items-center gap-2">
            <h2 className="font-sans text-xl sm:text-[24px] font-semibold leading-[32px] text-text">Active Suppliers</h2>
            <button className="flex items-center gap-2 border-2 border-border-warm text-text h-12 px-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase hover:border-accent min-h-[48px] shrink-0">
              <Plus size={16} /> NEW
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
                  <p className="font-mono text-[14px] text-text-warm">Contact: {supplier.contactPerson}</p>
                  <p className="font-mono text-[14px] text-text-warm">Phone: {supplier.phone}</p>
                  <p className="font-mono text-[14px] text-text-warm">Terms: {supplier.terms}</p>
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
                      {category}
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
              <h2 className="font-sans text-xl sm:text-[24px] font-semibold leading-[32px] text-text">Purchase Orders</h2>
              <p className="font-mono text-[14px] text-text-warm">Manage incoming stock requests</p>
            </div>
            <button className="bg-accent-container text-[#572000] font-black text-[16px] sm:text-[18px] h-12 px-6 border-2 border-transparent uppercase hover:opacity-90 min-h-[48px] whitespace-nowrap">
              NEW PURCHASE ORDER
            </button>
          </div>

          <div className="bg-surface-low border-2 border-border-warm overflow-x-auto">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead className="bg-surface-variant border-b-2 border-border-warm">
                <tr>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">PO #</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">SUPPLIER</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">DATE</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">TOTAL COST</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text">STATUS</th>
                  <th className="p-4 font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text text-right">ACTIONS</th>
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
                          Pending
                        </span>
                      ) : (
                        <span className="bg-surface-variant text-text-warm border border-border-warm px-2 py-1 font-mono text-[12px] font-bold tracking-[0.1em] uppercase inline-block">
                          {po.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right flex justify-end">
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
