import { defaultLocale, locales, type Locale } from './dictionaries'

export const LOCALE_COOKIE = 'locale'

/** Set by `proxy.ts` from `?locale=` so RSC metadata matches the crawled URL. */
export const LOCALE_HEADER = 'x-locale'

export function parseLocale(value: string | undefined | null): Locale {
  if (value && locales.includes(value as Locale)) return value as Locale
  return defaultLocale
}

export function resolveServerLocale(input: {
  headerLocale?: string | null
  cookieLocale?: string | null
}): Locale {
  if (input.headerLocale && locales.includes(input.headerLocale as Locale)) {
    return input.headerLocale as Locale
  }
  return parseLocale(input.cookieLocale)
}

export function localeCookieValue(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`
}
