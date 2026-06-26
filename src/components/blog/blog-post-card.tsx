'use client'

import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { BlogPost } from '@/content/blog'
import {
  blogPostPath,
  formatBlogDate,
  getBlogPostContent,
} from '@/lib/blog'
import { useLocale } from '@/i18n/locale-context'

type BlogPostCardProps = {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { locale, t } = useLocale()
  const content = getBlogPostContent(post, locale)

  return (
    <article className="border-b border-[var(--landing-border-subtle)] py-7 first:border-t">
      <Link
        href={blogPostPath(post.slug)}
        className="group mb-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="portfolio-entry-title">{content.title}</span>
          <ArrowUpRight className="size-4 shrink-0 text-[var(--landing-text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <time
          dateTime={post.publishedAt}
          className="portfolio-entry-meta shrink-0"
        >
          {formatBlogDate(post.publishedAt, locale)}
        </time>
      </Link>

      <p className="portfolio-body-sm mb-3 max-w-2xl leading-relaxed">
        {content.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--landing-text-muted)]">
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden />
          {t.blog.readingTime.replace(
            '{minutes}',
            String(post.readingTimeMinutes),
          )}
        </span>
        <span className="text-[var(--landing-border-subtle)]">·</span>
        <ul className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[var(--landing-border-subtle)] px-2 py-0.5"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
