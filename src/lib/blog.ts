import type { Locale } from '@/i18n/dictionaries'
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
  return post.content[locale]
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
