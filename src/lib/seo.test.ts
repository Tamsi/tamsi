import { describe, it, expect } from 'vitest'
import {
  buildBlogListingStructuredData,
  buildBlogPostJsonLd,
  buildBlogPostMetadata,
  buildDocumentJsonLd,
  buildLanguageAlternates,
  buildPageMetadata,
  buildPersonJsonLd,
  buildSharedMetadata,
  buildStructuredDataGraph,
  localePageUrl,
} from './seo'
import { getBlogPost, getBlogSlugs } from './blog'

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

  it('includes discovery feeds and robots-friendly metadata', () => {
    const meta = buildPageMetadata('en', '/')
    expect(meta.robots).toMatchObject({ index: true, follow: true })
    const types = meta.alternates?.types
    expect(types?.['text/plain']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: 'https://tamsi.dev/llms.txt' }),
      ]),
    )
    expect(types?.['application/rss+xml']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: 'https://tamsi.dev/feed.xml' }),
      ]),
    )
    expect(meta.openGraph?.locale).toBe('en_US')
    expect(meta.title).toEqual(
      expect.objectContaining({ absolute: expect.stringContaining('Tamsi') }),
    )
  })

  it('uses a title template on inner pages', () => {
    const meta = buildPageMetadata('fr', '/blog')
    expect(meta.title).toBe('Blog')
    const shared = buildSharedMetadata('fr')
    expect(shared.title).toEqual(
      expect.objectContaining({ template: '%s · Tamsi Besson' }),
    )
  })

  it('builds structured data graph with person, work, and profile page', () => {
    const graph = buildStructuredDataGraph('fr', '/') as unknown as {
      '@graph': { '@type': string }[]
    }
    const types = graph['@graph'].map((n) => n['@type'])
    expect(types).toContain('Person')
    expect(types).toContain('WebSite')
    expect(types).toContain('ProfilePage')
    expect(types).toContain('ItemList')
  })

  it('types machine and adventure documents correctly', () => {
    expect(buildDocumentJsonLd('en', '/machine')['@type']).toBe('WebPage')
    expect(buildDocumentJsonLd('en', '/adventure')['@type']).toBe(
      'WebApplication',
    )
  })

  it('lists external profiles on person schema', () => {
    const person = buildPersonJsonLd('en') as { sameAs: string[] }
    expect(person.sameAs.some((u) => u.includes('github.com'))).toBe(true)
    expect(person.sameAs.some((u) => u.includes('x.com'))).toBe(true)
  })

  it('builds article metadata and json-ld for a blog post', () => {
    const slug = getBlogSlugs()[0]
    const post = getBlogPost(slug)
    expect(post).toBeDefined()
    if (!post) return

    const meta = buildBlogPostMetadata('en', post)
    expect(meta.openGraph && 'type' in meta.openGraph && meta.openGraph.type).toBe(
      'article',
    )
    expect(meta.alternates?.canonical).toContain(`/blog/${slug}`)

    const jsonLd = buildBlogPostJsonLd('en', post)
    expect(jsonLd['@type']).toBe('BlogPosting')
    expect(jsonLd.wordCount).toBeGreaterThan(10)
    expect(jsonLd.image).toContain('/opengraph-image')
  })

  it('includes breadcrumbs and item list on the blog index', () => {
    const data = buildBlogListingStructuredData('fr') as {
      '@graph': { '@type': string }[]
    }
    const types = data['@graph'].map((n) => n['@type'])
    expect(types).toContain('Blog')
    expect(types).toContain('ItemList')
    expect(types).toContain('BreadcrumbList')
  })
})
