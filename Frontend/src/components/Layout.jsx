import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Gauge, ShoppingCart, Package, Truck, History, Menu, X, LogOut } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../auth/AuthContext'

const navItems = [
  { to: '/', i18nKey: 'nav.pos', icon: ShoppingCart, end: true },
  { to: '/inventory', i18nKey: 'nav.inventory', icon: Package },
  { to: '/suppliers', i18nKey: 'nav.suppliers', icon: Truck },
  { to: '/history', i18nKey: 'nav.history', icon: History },
  { to: '/dashboard', i18nKey: 'nav.dashboard', icon: Gauge },
]

function NavLinks({ onNavigate }) {
  const { t } = useTranslation()
  return (
    <>
      {navItems.map(({ to, i18nKey, icon: Icon, end }) => (
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
          {t(i18nKey)}
        </NavLink>
      ))}
    </>
  )
}

function OperatorBadge() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="w-10 h-10 bg-surface-variant border border-border-warm flex items-center justify-center">
        <ShoppingCart size={18} className="text-text-warm" />
      </div>
      <span className="font-mono text-[14px] font-medium text-text-muted">
        {t('brand.operator')}
      </span>
      <button
        type="button"
        onClick={logout}
        title={t('login.logout')}
        aria-label={t('login.logout')}
        className="ms-auto flex h-10 w-10 shrink-0 items-center justify-center border border-border-warm text-text-warm hover:text-danger hover:border-danger transition-colors"
      >
        <LogOut size={18} />
      </button>
    </div>
  )
}

export default function Layout() {
  const { t } = useTranslation()
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
      <aside className="hidden lg:flex w-64 shrink-0 border-e-2 border-border-warm bg-surface flex-col">
        {/* Brand */}
        <div className="px-6 py-6 mb-2">
          <img
            src="/logo.png"
            alt="Throttle logo"
            className="w-full max-w-[180px] h-auto object-contain"
          />
          <p className="font-mono text-[12px] font-bold tracking-[0.1em] text-text-warm mt-3 uppercase">
            {t('brand.tagline')}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-1">
          <NavLinks />
        </nav>

        {/* Language + theme */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <LanguageSwitcher className="justify-start" />
          <ThemeToggle className="ms-auto" />
        </div>

        {/* Footer */}
        <div className="px-4 py-4 mt-auto border-t-2 border-border-warm">
          <OperatorBadge />
        </div>
      </aside>

      {/* Content column (mobile header + page) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with burger */}
        <header className="lg:hidden sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b-2 border-border-warm bg-surface px-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t('a11y.openMenu')}
            aria-expanded={menuOpen}
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-warm bg-surface-variant text-text hover:border-accent transition-colors"
          >
            <Menu size={22} />
          </button>
          <img
            src="/logo.png"
            alt="Throttle logo"
            className="h-10 w-auto max-w-[120px] sm:max-w-[160px] object-contain"
          />
          <div className="ms-auto flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
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
        className={`fixed inset-y-0 start-0 z-50 flex w-72 max-w-[85vw] flex-col border-e-2 border-border-warm bg-surface transition-transform duration-200 lg:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
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
              {t('brand.tagline')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t('a11y.closeMenu')}
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-warm bg-surface-variant text-text hover:border-accent transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>

        {/* Language + theme */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle className="ms-auto" />
        </div>

        {/* Footer */}
        <div className="px-4 py-4 mt-auto border-t-2 border-border-warm">
          <OperatorBadge />
        </div>
      </aside>
    </div>
  )
}
