import { describe, it, expect } from 'vitest'
import { parseLocale, resolveServerLocale } from './locale-config'

describe('parseLocale', () => {
  it('returns fr or en when valid', () => {
    expect(parseLocale('fr')).toBe('fr')
    expect(parseLocale('en')).toBe('en')
  })

  it('falls back to default for missing or invalid values', () => {
    expect(parseLocale(undefined)).toBe('fr')
    expect(parseLocale('de')).toBe('fr')
  })
})

describe('resolveServerLocale', () => {
  it('prefers a valid URL/header locale over the cookie', () => {
    expect(
      resolveServerLocale({ headerLocale: 'en', cookieLocale: 'fr' }),
    ).toBe('en')
  })

  it('ignores an invalid header and uses the cookie', () => {
    expect(
      resolveServerLocale({ headerLocale: 'de', cookieLocale: 'en' }),
    ).toBe('en')
  })

  it('falls back to the default locale', () => {
    expect(resolveServerLocale({})).toBe('fr')
  })
})
