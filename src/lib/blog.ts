import type { Locale } from '@/i18n/dictionaries'
import { locales } from '@/i18n/dictionaries'
import { defaultLocale } from '@/i18n/dictionaries'
import { SITE_URL } from '@/data/site-links'
import {
  blogPosts,
  blogPostsBySlug,
  type BlogPost,
  type BlogPostContent,
} from '@/content/blog'

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPostsBySlug[slug]
}

export function getBlogPostContent(
  post: BlogPost,
  locale: Locale,
): BlogPostContent {
  const content = post.content[locale]
  if (!content) {
    throw new Error(
      `Blog post "${post.slug}" is missing content for locale "${locale}". Every article must define fr and en.`,
    )
  }
  return content
}

export function assertBlogPostsHaveAllLocales(posts: BlogPost[] = blogPosts): void {
  for (const post of posts) {
    for (const locale of locales) {
      const content = post.content[locale]
      if (!content?.title?.trim() || !content.description?.trim()) {
        throw new Error(
          `Blog post "${post.slug}" is missing complete "${locale}" content.`,
        )
      }
      if (!content.blocks.length) {
        throw new Error(
          `Blog post "${post.slug}" has no blocks for locale "${locale}".`,
        )
      }
    }
  }
}

export function getBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug)
}

export function formatBlogDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoDate))
}

export function blogPostPath(slug: string): `/blog/${string}` {
  return `/blog/${slug}`
}

export function blogPostLocaleUrl(slug: string, locale: Locale): string {
  const url = new URL(blogPostPath(slug), SITE_URL)
  if (locale !== defaultLocale) {
    url.searchParams.set('locale', locale)
  }
  return url.pathname + url.search
}
