import type { Locale } from '@/i18n/dictionaries'

export type BlogCoverId = 'qwen-aws' | 'redbee-mcp' | 'ai-code-reviewer'

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; items: string[] }
  | { type: 'illustration'; id: BlogCoverId; alt: string }

export type BlogPostContent = {
  title: string
  description: string
  blocks: BlogBlock[]
}

export type BlogPost = {
  slug: string
  publishedAt: string
  tags: string[]
  readingTimeMinutes: number
  content: Record<Locale, BlogPostContent>
}
