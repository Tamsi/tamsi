'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  dictionaries,
  defaultLocale,
  locales,
  type Locale,
  type Dictionary,
} from './dictionaries'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  try {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && locales.includes(stored)) return stored
  } catch {
    // localStorage may be unavailable (private mode, sandboxed iframe, …)
  }
  const browserLang = navigator.language.split('-')[0]
  return browserLang === 'fr' ? 'fr' : 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleRaw(next)
    try {
      localStorage.setItem('locale', next)
    } catch {
      // ignore
    }
    document.title = dictionaries[next].meta.title
  }, [])

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: dictionaries[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
