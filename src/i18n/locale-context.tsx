'use client'

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
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

const localeListeners = new Set<() => void>()

function subscribeLocale(onStoreChange: () => void) {
  localeListeners.add(onStoreChange)
  return () => {
    localeListeners.delete(onStoreChange)
  }
}

function emitLocaleChange() {
  for (const listener of localeListeners) listener()
}

function readStoredLocale(): Locale | null {
  const cookieLocale = readLocaleCookie()
  if (cookieLocale) return cookieLocale
  try {
    const stored = localStorage.getItem('locale')
    return stored && locales.includes(stored as Locale) ? (stored as Locale) : null
  } catch {
    return null
  }
}

type LocaleProviderProps = {
  children: ReactNode
  /** From server cookie — must match the first client render to avoid hydration errors. */
  initialLocale: Locale
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    () => readStoredLocale() ?? initialLocale,
    () => initialLocale,
  )

  useEffect(() => {
    document.documentElement.lang = locale
    if (!readLocaleCookie() && readStoredLocale()) {
      persistLocaleCookie(locale)
    }
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    persistLocaleCookie(next)
    try {
      localStorage.setItem('locale', next)
    } catch {
      // ignore
    }
    document.documentElement.lang = next
    document.title = dictionaries[next].meta.title
    emitLocaleChange()
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
