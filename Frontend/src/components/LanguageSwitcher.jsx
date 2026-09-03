import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n'

const langs = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'ar', label: 'ع', name: 'العربية' },
]

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const current = (i18n.language || 'en').split('-')[0]

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language / Langue / اللغة">
      {langs.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLanguage(l.code)}
          title={l.name}
          aria-pressed={current === l.code}
          className={`h-10 min-w-10 px-2 font-mono text-[12px] font-bold tracking-wider border-2 transition-colors ${
            current === l.code
              ? 'bg-accent-container text-[#572000] border-accent'
              : 'text-text-warm border-border-warm hover:border-border-outline'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
