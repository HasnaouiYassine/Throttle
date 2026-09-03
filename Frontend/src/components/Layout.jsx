import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Gauge, ShoppingCart, Package, Truck, History, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'POS', icon: ShoppingCart, end: true },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/history', label: 'History', icon: History },
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
]

function NavLinks({ onNavigate }) {
  return (
    <>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 min-h-[48px] font-mono text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-75 ${
              isActive
                ? 'bg-accent-container text-[#572000] border-2 border-accent scale-[0.98]'
                : 'text-text-warm hover:bg-surface-variant border-2 border-transparent'
            }`
          }
        >
          <Icon size={20} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen lg:h-screen flex bg-bg text-text">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r-2 border-border-warm bg-surface flex-col">
        {/* Brand */}
        <div className="px-6 py-6 mb-2">
          <img
            src="/logo.png"
            alt="Throttle logo"
            className="w-full max-w-[180px] h-auto object-contain"
          />
          <p className="font-mono text-[12px] font-bold tracking-[0.1em] text-text-warm mt-3 uppercase">
            MOTO PARTS POS V1.0
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-1">
          <NavLinks />
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 mt-auto border-t-2 border-border-warm">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 bg-surface-variant border border-border-warm flex items-center justify-center">
              <ShoppingCart size={18} className="text-text-warm" />
            </div>
            <span className="font-mono text-[14px] font-medium text-text-muted">
              Shop Operator
            </span>
          </div>
        </div>
      </aside>

      {/* Content column (mobile header + page) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with burger */}
        <header className="lg:hidden sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b-2 border-border-warm bg-surface px-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-warm bg-surface-variant text-text hover:border-accent transition-colors"
          >
            <Menu size={22} />
          </button>
          <img
            src="/logo.png"
            alt="Throttle logo"
            className="h-10 w-auto max-w-[160px] object-contain"
          />
        </header>

        <main className="flex-1 min-h-0 lg:overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile drawer overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-200 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r-2 border-border-warm bg-surface transition-transform duration-200 lg:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Brand + close */}
        <div className="px-5 py-5 mb-2 flex items-start justify-between gap-3">
          <div>
            <img
              src="/logo.png"
              alt="Throttle logo"
              className="w-full max-w-[160px] h-auto object-contain"
            />
            <p className="font-mono text-[12px] font-bold tracking-[0.1em] text-text-warm mt-3 uppercase">
              MOTO PARTS POS V1.0
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-warm bg-surface-variant text-text hover:border-accent transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 mt-auto border-t-2 border-border-warm">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 bg-surface-variant border border-border-warm flex items-center justify-center">
              <ShoppingCart size={18} className="text-text-warm" />
            </div>
            <span className="font-mono text-[14px] font-medium text-text-muted">
              Shop Operator
            </span>
          </div>
        </div>
      </aside>
    </div>
  )
}
