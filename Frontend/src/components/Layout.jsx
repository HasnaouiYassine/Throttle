import { NavLink, Outlet } from 'react-router-dom'
import { Gauge, ShoppingCart, Package, Truck, History } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Sale', icon: ShoppingCart, end: true },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/history', label: 'History', icon: History },
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-bg text-text">
      <aside className="w-56 shrink-0 border-r border-border flex flex-col">
        <div className="px-5 py-6 border-b border-border">
          <h1 className="font-display text-2xl tracking-wide">
            THROTTLE
          </h1>
          <p className="text-xs text-text-faint mt-1">Shop console</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors border-l-2 ${
                  isActive
                    ? 'border-accent text-text bg-surface'
                    : 'border-transparent text-text-muted hover:text-text hover:bg-surface/60'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border text-xs text-text-faint">
          v0.1 — Web
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
