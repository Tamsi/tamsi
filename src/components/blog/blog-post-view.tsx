'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { ArticleContent } from '@/components/blog/article-content'
import { BlogBackLink } from '@/components/blog/blog-listing'
import type { BlogPost } from '@/content/blog'
import { formatBlogDate, getBlogPostContent } from '@/lib/blog'
import { useLocale } from '@/i18n/locale-context'

type BlogPostViewProps = {
  post: BlogPost
}

export function BlogPostView({ post }: BlogPostViewProps) {
  const { locale, t } = useLocale()
  const content = getBlogPostContent(post, locale)

  return (
    <>
      <BlogBackLink href="/blog" label={t.blog.backToBlog} />

      <header className="mb-10 border-b border-[var(--landing-border-subtle)] pb-8">
        <p className="portfolio-section-label mb-3">
          {formatBlogDate(post.publishedAt, locale)}
        </p>
        <h1 className="portfolio-heading-lg mb-4">{content.title}</h1>
        <p className="portfolio-body mb-4">{content.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--landing-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden />
            {t.blog.readingTime.replace(
              '{minutes}',
              String(post.readingTimeMinutes),
            )}
          </span>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[var(--landing-border-subtle)] px-2.5 py-0.5 text-xs"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <ArticleContent blocks={content.blocks} />

      <footer className="mt-12 border-t border-[var(--landing-border-subtle)] pt-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-[var(--landing-accent)] hover:underline"
        >
          ← {t.blog.backToBlog}
        </Link>
      </footer>
    </>
  )
}
