import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Lock, Eye, EyeOff, LogIn, AlertTriangle } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ThemeToggle from '../components/ThemeToggle'

export default function Login() {
  const { t } = useTranslation()
  const { isAuthed, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthed) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const result = await login(username.trim(), password)
    setBusy(false)
    if (result.ok) {
      navigate('/', { replace: true })
    } else if (result.code === 'NETWORK') {
      setError(t('login.serverError'))
    } else {
      setError(t('login.error'))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text px-4 py-8">
      <div className="mb-6 flex items-center justify-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-surface border-2 border-border-warm p-6 sm:p-8">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Throttle logo"
          className="w-full max-w-[220px] h-auto object-contain mx-auto"
        />
        <h1 className="font-sans text-2xl font-bold text-center uppercase tracking-tight mt-6">
          {t('login.title')}
        </h1>
        <p className="font-mono text-[12px] text-text-warm text-center mt-2 uppercase tracking-[0.1em]">
          {t('login.subtitle')}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
          {error && (
            <div className="flex items-center gap-3 bg-danger/10 border border-danger text-danger px-4 py-3 font-mono text-[13px]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">
              {t('login.username')}
            </span>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted rtl:left-auto rtl:right-4" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError('')
                }}
                placeholder={t('login.usernamePlaceholder')}
                autoComplete="username"
                className="w-full min-h-[48px] pl-12 pr-4 rtl:pl-4 rtl:pr-12 bg-surface-variant border border-border-warm rounded-none text-text focus:outline-none focus:border-accent font-mono placeholder:text-text-muted"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">
              {t('login.password')}
            </span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted rtl:left-auto rtl:right-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder={t('login.passwordPlaceholder')}
                autoComplete="current-password"
                className="w-full min-h-[48px] pl-12 pr-14 rtl:pl-14 rtl:pr-12 bg-surface-variant border border-border-warm rounded-none text-text focus:outline-none focus:border-accent font-mono placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full bg-accent-container text-[#572000] font-black text-[18px] uppercase h-14 flex items-center justify-center gap-3 border-2 border-accent hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            <LogIn className="w-5 h-5 rtl:rotate-180" /> {t('login.signIn')}
          </button>
        </form>
      </div>
    </div>
  )
}
