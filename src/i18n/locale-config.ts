import { defaultLocale, locales, type Locale } from './dictionaries'

export const LOCALE_COOKIE = 'locale'

export function parseLocale(value: string | undefined | null): Locale {
  if (value && locales.includes(value as Locale)) return value as Locale
  return defaultLocale
}

export function localeCookieValue(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`
}
