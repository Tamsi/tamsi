import { describe, it, expect } from 'vitest'
import { parseLocale } from './locale-config'

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
