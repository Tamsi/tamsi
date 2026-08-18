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

export function latestBlogPublishedAt(): Date {
  const posts = getAllBlogPosts()
  return posts[0] ? new Date(posts[0].publishedAt) : new Date('2026-01-01')
}

export function blogPostPlainText(post: BlogPost, locale: Locale): string {
  const content = getBlogPostContent(post, locale)
  const parts = [content.title, content.description]
  for (const block of content.blocks) {
    switch (block.type) {
      case 'paragraph':
      case 'heading':
        parts.push(block.text)
        break
      case 'list':
        parts.push(...block.items)
        break
      case 'code':
        parts.push(block.code)
        break
      case 'image':
        parts.push(block.alt)
        if (block.caption) parts.push(block.caption)
        break
    }
  }
  return parts.filter(Boolean).join('\n')
}

export function countWords(text: string): number {
  return text
    .replace(/[`*_\[\]()#>-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function blogPostWordCount(post: BlogPost, locale: Locale): number {
  return countWords(blogPostPlainText(post, locale))
}

export function blogPostToMarkdown(post: BlogPost, locale: Locale): string {
  const content = getBlogPostContent(post, locale)
  const lines = [
    `# ${content.title}`,
    '',
    content.description,
    '',
    `Date: ${post.publishedAt}`,
    `Tags: ${post.tags.join(', ')}`,
    `URL: ${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`,
    '',
  ]

  for (const block of content.blocks) {
    switch (block.type) {
      case 'paragraph':
        lines.push(block.text, '')
        break
      case 'heading':
        lines.push(`${'#'.repeat(block.level)} ${block.text}`, '')
        break
      case 'list':
        lines.push(...block.items.map((item) => `- ${item}`), '')
        break
      case 'code':
        lines.push(`\`\`\`${block.language}`, block.code, '```', '')
        break
      case 'image': {
        const src = block.src.startsWith('http')
          ? block.src
          : `${SITE_URL}${block.src}`
        lines.push(`![${block.alt}](${src})`, '')
        if (block.caption) lines.push(`_${block.caption}_`, '')
        break
      }
    }
  }

  return lines.join('\n').trim() + '\n'
}
