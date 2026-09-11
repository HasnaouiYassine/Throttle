import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border-2 border-accent">
        <div className="flex items-center justify-between border-b border-border-warm p-4">
          <h2 className="text-xl font-bold uppercase">{title}</h2>
          <button onClick={onClose} className="p-2 text-text-warm hover:text-accent" aria-label="Close"><X /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
