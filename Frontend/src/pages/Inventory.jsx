import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, MoreVertical, Package, Plus, Search } from 'lucide-react'
import { categories, getCategoryId } from '../data/catalog'
import { useAppData } from '../data/AppDataContext'
import Modal from '../components/Modal'

const emptyItem = { name: '', sku: '', category: 'Engine', variant: '', size: '', color: '', price: '', cost: '', stock: '', lowStockAt: '5', barcode: '', image: '' }

function ItemForm({ item, onSave, onCancel }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(item || emptyItem)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try { await onSave({ ...form, price: Number(form.price), cost: Number(form.cost || 0), stock: Number(form.stock), lowStockAt: Number(form.lowStockAt || 0) }) } catch (reason) { setError(reason.message.replaceAll('_', ' ')) } finally { setSaving(false) }
  }
  const input = 'w-full h-11 bg-surface-container border border-border-warm px-3 text-text focus:outline-none focus:border-accent'
  return <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <label>{t('inventory.form.name')}<input className={input} required name="name" value={form.name} onChange={change} /></label>
    <label>{t('inventory.form.sku')}<input className={input} required name="sku" value={form.sku} onChange={change} /></label>
    <label>{t('inventory.form.category')}
      <select className={input} name="category" value={form.category} onChange={change}>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {t(`categories.${c.id}`, { defaultValue: c.name })}
          </option>
        ))}
      </select>
    </label>
    <label>{t('inventory.form.price')}<input className={input} required min="0" step="0.01" type="number" name="price" value={form.price} onChange={change} /></label>
    <label>{t('inventory.form.cost')}<input className={input} min="0" step="0.01" type="number" name="cost" value={form.cost} onChange={change} /></label>
    <label>{t('inventory.form.stock')}<input className={input} required min="0" step="1" type="number" name="stock" value={form.stock} onChange={change} /></label>
    <label>{t('inventory.form.lowStockAt')}<input className={input} min="0" step="1" type="number" name="lowStockAt" value={form.lowStockAt} onChange={change} /></label>
    <label>{t('inventory.form.size')}<input className={input} name="size" value={form.size || ''} onChange={change} /></label>
    <label>{t('inventory.form.color')}<input className={input} name="color" value={form.color || ''} onChange={change} /></label>
    <label>{t('inventory.form.barcode')}<input className={input} name="barcode" value={form.barcode || ''} onChange={change} /></label>
    <label className="sm:col-span-2">{t('inventory.form.image')}<input className={input} name="image" value={form.image || ''} onChange={change} /></label>
    {error && <p className="sm:col-span-2 text-danger font-mono">{error}</p>}
    <div className="sm:col-span-2 flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="h-11 px-4 border border-border-warm">{t('common.cancel')}</button>
      <button disabled={saving} className="h-11 px-5 bg-accent text-white font-bold disabled:opacity-50">{saving ? t('common.saving') : t('inventory.form.saveItem')}</button>
    </div>
  </form>
}

export default function Inventory() {
  const { t } = useTranslation()
  const { items, loading, error, createItem, updateItem, deleteItem } = useAppData()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [editing, setEditing] = useState(undefined)
  const [actionError, setActionError] = useState('')
  const filteredItems = useMemo(() => items.filter((item) => {
    const query = searchQuery.toLowerCase()
    return (!query || item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query) || item.barcode?.toLowerCase().includes(query)) && (activeCategory === 'ALL' || getCategoryId(item) === activeCategory) && (!lowStockOnly || item.stock <= item.lowStockAt)
  }), [items, searchQuery, activeCategory, lowStockOnly])
  const remove = async (item) => {
    if (!window.confirm(t('inventory.deleteConfirm', { name: item.name }))) return
    setActionError('')
    try { await deleteItem(item.id) } catch { setActionError(t('inventory.deleteError')) }
  }

  return <div className="flex flex-col bg-bg lg:h-full lg:overflow-hidden text-text">
    <header className="bg-surface-container border-b-2 border-border-warm px-4 sm:px-6 py-3 shrink-0 flex flex-col xl:flex-row gap-3 xl:justify-between xl:items-center"><h1 className="font-sans text-2xl sm:text-[32px] font-bold uppercase">{t('inventory.title')}</h1><div className="flex items-center gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('inventory.searchPlaceholder')} className="h-12 w-72 max-w-full bg-surface border border-border-warm pl-10 pr-4 focus:outline-none focus:border-accent" /></div><button onClick={() => setEditing(null)} className="bg-accent-container text-[#572000] font-mono font-bold h-12 px-5 flex items-center gap-2"><Plus size={16}/>{t('inventory.addNew')}</button></div></header>
    <div className="bg-surface-container p-4 border border-border-warm m-4 mb-0 flex flex-col xl:flex-row gap-3 justify-between"><div className="flex items-center gap-2 overflow-x-auto">{[{ id: 'ALL', name: t('inventory.all') }, ...categories].map((cat) => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`h-10 px-4 font-mono text-xs font-bold uppercase whitespace-nowrap border ${activeCategory === cat.id ? 'border-2 border-accent text-accent' : 'border-border-warm text-text-warm'}`}>{cat.id === 'ALL' ? cat.name : t(`categories.${cat.id}`, { defaultValue: cat.name })}</button>)}</div><label className="flex items-center gap-2 font-mono text-xs font-bold"><input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />{t('inventory.lowStockOnly')}</label></div>
    {actionError && <div className="mx-4 mt-3 p-3 border border-danger text-danger">{actionError}</div>}
    <div className="flex-1 bg-surface border border-border-warm overflow-auto flex flex-col m-4 min-h-0"><div className="grid grid-cols-[1fr_9rem_6rem_8rem_8rem_7rem] min-w-[750px] gap-4 p-4 bg-surface-high border-b-2 border-border-warm font-mono text-xs font-bold uppercase text-text-warm"><div>{t('inventory.itemSku')}</div><div>{t('inventory.category')}</div><div>{t('inventory.stock')}</div><div>{t('inventory.cost')}</div><div>{t('inventory.price')}</div><div className="text-center">{t('inventory.acts')}</div></div><div className="flex-1 overflow-y-auto">{filteredItems.map((item) => { const low = item.stock <= item.lowStockAt; return <div key={item.id} className="grid grid-cols-[1fr_9rem_6rem_8rem_8rem_7rem] min-w-[750px] gap-4 p-4 border-b border-surface-variant items-center"><div className="flex gap-3 min-w-0"><div className="w-10 h-10 bg-surface-variant flex items-center justify-center shrink-0">{item.image ? <img src={item.image} alt="" className="w-full h-full object-cover"/> : <Package size={18}/>}</div><div className="min-w-0"><b className="block truncate">{item.name}</b><span className="font-mono text-sm text-text-warm">{item.sku}</span></div></div><div className="font-mono text-xs uppercase">{t(`categories.${getCategoryId(item)}`, { defaultValue: item.category })}</div><div className={low ? 'text-accent font-mono font-bold' : 'font-mono'}>{low && <AlertTriangle size={14} className="inline mr-1" />}{item.stock}</div><div className="font-mono">{item.cost.toFixed(2)} DT</div><div className="font-mono font-bold">{item.price.toFixed(2)} DT</div><div className="flex justify-center gap-1"><button onClick={() => setEditing(item)} aria-label={`Edit ${item.name}`} className="p-2 hover:text-accent"><MoreVertical size={20}/></button><button onClick={() => remove(item)} className="text-danger text-xs font-bold">{t('common.delete')}</button></div></div> })}{!loading && filteredItems.length === 0 && <div className="p-8 text-center font-mono text-text-warm">{error || t('inventory.empty')}</div>}{loading && <div className="p-8 text-center font-mono">{t('inventory.loading')}</div>}</div></div>
    {editing !== undefined && <Modal title={editing ? t('inventory.editTitle') : t('inventory.addTitle')} onClose={() => setEditing(undefined)}><ItemForm item={editing} onCancel={() => setEditing(undefined)} onSave={async (body) => { if (editing) await updateItem(editing.id, body); else await createItem(body); setEditing(undefined) }} /></Modal>}
  </div>
}
