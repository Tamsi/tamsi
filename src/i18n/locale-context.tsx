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
  locales,
  type Locale,
  type Dictionary,
} from './dictionaries'
import { persistLocaleCookie, readLocaleCookie } from './locale-cookie'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

type LocaleProviderProps = {
  children: ReactNode
  /** From server cookie — must match the first client render to avoid hydration errors. */
  initialLocale: Locale
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleRaw] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const cookieLocale = readLocaleCookie()
    if (cookieLocale) {
      if (cookieLocale !== initialLocale) setLocaleRaw(cookieLocale)
      return
    }
    try {
      const stored = localStorage.getItem('locale') as Locale | null
      if (stored && locales.includes(stored) && stored !== initialLocale) {
        setLocaleRaw(stored)
        persistLocaleCookie(stored)
      }
    } catch {
      // ignore
    }
  }, [initialLocale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleRaw(next)
    persistLocaleCookie(next)
    try {
      localStorage.setItem('locale', next)
    } catch {
      // ignore
    }
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
