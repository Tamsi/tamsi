import { describe, it, expect } from 'vitest'
import {
  formatBlogDate,
  getAllBlogPosts,
  getBlogPost,
  getBlogSlugs,
} from './blog'

describe('blog', () => {
  it('lists posts sorted by date descending', () => {
    const posts = getAllBlogPosts()
    expect(posts.length).toBeGreaterThan(0)
    for (let i = 1; i < posts.length; i++) {
      expect(
        new Date(posts[i - 1].publishedAt).getTime(),
      ).toBeGreaterThanOrEqual(new Date(posts[i].publishedAt).getTime())
    }
  })

  it('resolves posts by slug', () => {
    const slug = getBlogSlugs()[0]
    expect(getBlogPost(slug)?.slug).toBe(slug)
    expect(getBlogPost('missing-slug')).toBeUndefined()
  })

  it('formats dates per locale', () => {
    expect(formatBlogDate('2026-06-01', 'fr')).toContain('2026')
    expect(formatBlogDate('2026-06-01', 'en')).toContain('2026')
  })
})
