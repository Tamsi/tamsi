import { describe, it, expect } from 'vitest'
import {
  assertBlogPostsHaveAllLocales,
  blogPostToMarkdown,
  blogPostWordCount,
  formatBlogDate,
  getAllBlogPosts,
  getBlogPost,
  getBlogPostContent,
  getBlogSlugs,
  latestBlogPublishedAt,
} from './blog'
import { locales } from '@/i18n/dictionaries'

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

  it('requires every post to have fr and en content', () => {
    expect(() => assertBlogPostsHaveAllLocales()).not.toThrow()
    for (const post of getAllBlogPosts()) {
      for (const locale of locales) {
        const content = getBlogPostContent(post, locale)
        expect(content.title.length).toBeGreaterThan(0)
        expect(content.description.length).toBeGreaterThan(0)
        expect(content.blocks.length).toBeGreaterThan(0)
      }
    }
  })

  it('exports markdown and a word count for GEO / RSS', () => {
    const post = getAllBlogPosts()[0]
    const markdown = blogPostToMarkdown(post, 'en')
    expect(markdown).toContain(`# ${getBlogPostContent(post, 'en').title}`)
    expect(markdown).toContain('https://tamsi.dev/blog/')
    expect(blogPostWordCount(post, 'en')).toBeGreaterThan(20)
    expect(latestBlogPublishedAt().getTime()).toBeGreaterThan(0)
  })
})
