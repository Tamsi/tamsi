import { LOCALE_COOKIE, localeCookieValue } from './locale-config'
import { locales, type Locale } from './dictionaries'

/** Persist locale for SSR + subsequent visits (client only). */
export function persistLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return
  document.cookie = localeCookieValue(locale)
}

export function readLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`))
  if (!match) return null
  const value = match.slice(LOCALE_COOKIE.length + 1)
  return locales.includes(value as Locale) ? (value as Locale) : null
}
