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

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && locales.includes(stored)) {
      setLocaleRaw(stored)
      document.documentElement.lang = stored
    } else {
      const browserLang = navigator.language.split('-')[0]
      const detected: Locale = browserLang === 'fr' ? 'fr' : 'en'
      setLocaleRaw(detected)
      document.documentElement.lang = detected
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleRaw(next)
    localStorage.setItem('locale', next)
    document.documentElement.lang = next
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
