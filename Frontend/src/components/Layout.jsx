import { NavLink, Outlet } from 'react-router-dom'
import { Gauge, ShoppingCart, Package, Truck, History } from 'lucide-react'

const navItems = [
  { to: '/', label: 'POS', icon: ShoppingCart, end: true },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/history', label: 'History', icon: History },
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-bg text-text">
      <aside className="w-64 shrink-0 border-r-2 border-border-warm bg-surface flex flex-col">
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
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
