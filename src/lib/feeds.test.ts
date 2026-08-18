import { describe, it, expect } from 'vitest'
import { buildJsonFeed, buildRssFeed } from './feeds'
import { getAllBlogPosts } from './blog'

describe('feeds', () => {
  it('builds a valid RSS channel with every post', () => {
    const rss = buildRssFeed('fr')
    expect(rss).toContain('<rss version="2.0"')
    expect(rss).toContain('<language>fr</language>')
    expect(rss).toContain('https://tamsi.dev/feed.xml')
    for (const post of getAllBlogPosts()) {
      expect(rss).toContain(`/blog/${post.slug}`)
    }
  })

  it('builds a JSON Feed 1.1 document', () => {
    const json = JSON.parse(buildJsonFeed('en')) as {
      version: string
      items: { id: string }[]
    }
    expect(json.version).toContain('jsonfeed.org')
    expect(json.items.length).toBe(getAllBlogPosts().length)
  })
})
