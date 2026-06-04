import { describe, it, expect } from 'vitest'
import {
  buildLanguageAlternates,
  buildPageMetadata,
  buildPersonJsonLd,
  buildStructuredDataGraph,
  localePageUrl,
} from './seo'

describe('seo', () => {
  it('builds canonical URLs without locale param for default', () => {
    expect(localePageUrl('/', 'fr')).toBe('https://tamsi.dev/')
    expect(localePageUrl('/machine', 'fr')).toBe('https://tamsi.dev/machine')
  })

  it('adds locale query for non-default language', () => {
    expect(localePageUrl('/', 'en')).toBe('https://tamsi.dev/?locale=en')
    expect(localePageUrl('/machine', 'en')).toBe(
      'https://tamsi.dev/machine?locale=en',
    )
  })

  it('exposes hreflang alternates for both locales', () => {
    const languages = buildLanguageAlternates('/')
    expect(languages?.fr).toBe('https://tamsi.dev/')
    expect(languages?.en).toBe('https://tamsi.dev/?locale=en')
    expect(languages?.['x-default']).toBe('https://tamsi.dev/')
  })

  it('includes llms.txt and robots-friendly metadata', () => {
    const meta = buildPageMetadata('en', '/')
    expect(meta.robots).toEqual({ index: true, follow: true })
    const llmsAlt = meta.alternates?.types?.['text/plain']
    const llmsUrl = Array.isArray(llmsAlt) ? llmsAlt[0]?.url : undefined
    expect(llmsUrl).toBe('https://tamsi.dev/llms.txt')
    expect(meta.openGraph?.locale).toBe('en_US')
  })

  it('builds structured data graph with person and profile page', () => {
    const graph = buildStructuredDataGraph('fr', '/') as {
      '@graph': { '@type': string }[]
    }
    const types = graph['@graph'].map((n) => n['@type'])
    expect(types).toContain('Person')
    expect(types).toContain('WebSite')
    expect(types).toContain('ProfilePage')
  })

  it('lists external profiles on person schema', () => {
    const person = buildPersonJsonLd('en') as { sameAs: string[] }
    expect(person.sameAs.some((u) => u.includes('github.com'))).toBe(true)
    expect(person.sameAs.some((u) => u.includes('linkedin.com'))).toBe(true)
  })
})
