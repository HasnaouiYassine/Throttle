import { useMemo, useState } from 'react'
import { Download, Receipt, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppData } from '../data/AppDataContext'

function isInRange(timestamp, range) {
  const date = new Date(timestamp); const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (range === 'today') return date >= today
  if (range === 'yesterday') return date >= new Date(today.getTime() - 86400000) && date < today
  if (range === 'last7') return date >= new Date(today.getTime() - 6 * 86400000)
  if (range === 'month') return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  return true
}

function csvCell(value) { return `"${String(value ?? '').replaceAll('"', '""')}"` }

export default function History() {
  const { t } = useTranslation()
  const { sales, items, loading, error } = useAppData()
  const [range, setRange] = useState('all')
  const [payment, setPayment] = useState('')
  const [search, setSearch] = useState('')
  const [selectedSale, setSelectedSale] = useState(null)
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return sales.filter((sale) => isInRange(sale.timestamp, range) && (!payment || sale.paymentMethod === payment) && (!query || sale.txnId.toLowerCase().includes(query) || sale.lines.some((line) => (line.name || items.find((item) => item.id === line.itemId)?.name || '').toLowerCase().includes(query) || (line.sku || '').toLowerCase().includes(query))))
  }, [sales, range, payment, search, items])
  const exportCsv = () => {
    const rows = [['Transaction ID', 'Date', 'Payment method', 'Item count', 'Subtotal (DT)', 'Tax (DT)', 'Total (DT)'], ...filtered.map((sale) => [sale.txnId, new Date(sale.timestamp).toLocaleString(), sale.paymentMethod, sale.lines.reduce((sum, line) => sum + line.qty, 0), sale.subtotal.toFixed(2), sale.tax.toFixed(2), sale.total.toFixed(2)])]
    const blob = new Blob([rows.map((row) => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `sales-history-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url)
  }
  const timestamp = (sale) => new Date(sale.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
  return <div className="flex flex-col bg-bg text-text lg:h-screen min-h-full"><header className="bg-surface-container border-b-2 border-border-warm px-4 sm:px-6 py-3 flex justify-between items-center"><h1 className="text-xl sm:text-2xl font-black text-accent-light uppercase">{t('history.title')}</h1></header><main className="flex-1 overflow-y-auto p-4 sm:p-6"><div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6"><label className="font-mono text-xs font-bold text-text-warm">{t('history.dateRange')}<select value={range} onChange={(e) => setRange(e.target.value)} className="mt-2 w-full h-12 bg-surface border-2 border-border-warm px-3"><option value="all">All time</option><option value="today">{t('history.today')}</option><option value="yesterday">{t('history.yesterday')}</option><option value="last7">{t('history.last7')}</option><option value="month">{t('history.thisMonth')}</option></select></label><label className="font-mono text-xs font-bold text-text-warm">{t('history.paymentType')}<select value={payment} onChange={(e) => setPayment(e.target.value)} className="mt-2 w-full h-12 bg-surface border-2 border-border-warm px-3"><option value="">{t('history.allMethods')}</option><option value="Card">{t('history.card')}</option><option value="Cash">{t('history.cash')}</option><option value="Financing">{t('history.financing')}</option></select></label><label className="sm:col-span-2 font-mono text-xs font-bold text-text-warm">{t('history.scanSearch')}<div className="relative mt-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-warm" size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('history.scanPlaceholder')} className="w-full h-12 bg-surface border-2 border-border-warm pl-10 pr-3 focus:outline-none focus:border-accent"/></div></label></div><button onClick={exportCsv} disabled={!filtered.length} className="mb-5 flex items-center gap-2 h-12 px-5 border-2 border-border-warm bg-surface font-mono text-xs font-bold disabled:opacity-50"><Download size={16}/>{t('history.export')}</button><div className="bg-surface border-2 border-border-warm overflow-x-auto"><table className="w-full min-w-[720px]"><thead className="bg-surface-high font-mono text-xs text-text-warm"><tr><th className="p-4 text-left">{t('history.dateTime')}</th><th className="p-4 text-left">{t('history.saleId')}</th><th className="p-4 text-center">{t('history.items')}</th><th className="p-4 text-right">{t('history.total')}</th><th className="p-4 text-left">{t('history.method')}</th></tr></thead><tbody>{filtered.map((sale) => <tr key={sale.id} onClick={() => setSelectedSale(sale)} className="border-t border-border-warm cursor-pointer hover:bg-surface-variant"><td className="p-4 font-mono text-sm">{timestamp(sale)}</td><td className="p-4 font-mono font-bold text-accent-light">{sale.txnId}</td><td className="p-4 text-center">{sale.lines.reduce((sum, line) => sum + line.qty, 0)}</td><td className="p-4 text-right font-mono">{sale.total.toFixed(2)} DT</td><td className="p-4"><span className="px-2 py-1 border border-border-warm font-mono text-xs">{sale.paymentMethod}</span></td></tr>)}{!loading && !filtered.length && <tr><td colSpan="5" className="p-8 text-center text-text-warm">{error || 'No sales match these filters.'}</td></tr>}</tbody></table></div><p className="mt-4 font-mono text-sm text-text-warm">Showing {filtered.length} of {sales.length} records</p></main>{selectedSale && <ReceiptPanel sale={selectedSale} items={items} onClose={() => setSelectedSale(null)} />}</div>
}

function ReceiptPanel({ sale, items, onClose }) {
  return <div className="fixed inset-0 bg-black/80 z-50 flex justify-end"><div className="absolute inset-0" onClick={onClose}/><aside className="w-full max-w-md bg-surface h-full z-10 relative border-l-2 border-accent flex flex-col"><div className="p-4 border-b border-border-warm flex justify-between items-center"><div className="flex items-center gap-2"><Receipt className="text-accent"/><h2 className="text-xl font-bold">Transaction details</h2></div><button onClick={onClose}><X/></button></div><div className="p-6 overflow-y-auto space-y-5 font-mono"><div><p className="text-text-warm">Sale ID</p><p className="font-bold text-accent-light">{sale.txnId}</p><p className="mt-2 text-text-warm">{new Date(sale.timestamp).toLocaleString()}</p></div><div className="border-y border-dashed border-border-warm py-4 space-y-3">{sale.lines.map((line, index) => { const item = items.find((entry) => entry.id === line.itemId); return <div key={index} className="flex justify-between gap-3"><div><b>{line.name || item?.name || 'Unknown item'}</b><p className="text-sm text-text-warm">{line.sku || item?.sku || '—'} · {line.qty} × {line.price.toFixed(2)}</p></div><span>{(line.qty * line.price).toFixed(2)} DT</span></div> })}</div><div className="space-y-2"><div className="flex justify-between"><span>Subtotal</span><span>{sale.subtotal.toFixed(2)} DT</span></div><div className="flex justify-between"><span>Tax</span><span>{sale.tax.toFixed(2)} DT</span></div><div className="flex justify-between text-xl font-bold text-accent"><span>Total</span><span>{sale.total.toFixed(2)} DT</span></div></div><p className="text-text-warm">Payment: {sale.paymentMethod}</p></div></aside></div>
}
