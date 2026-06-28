'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  ScrollGroup,
  ScrollItem,
  ScrollReveal,
  ScrollScrub,
} from '@/components/ui/homepage-scroll'
import { SectionLabel } from '@/components/ui/section-label'
import { BlogPostCard } from '@/components/blog/blog-post-card'
import { getAllBlogPosts } from '@/lib/blog'
import { useLocale } from '@/i18n/locale-context'

const PREVIEW_COUNT = 3

export function BlogPreview() {
  const { t } = useLocale()
  const posts = getAllBlogPosts().slice(0, PREVIEW_COUNT)

  return (
    <section
      id="blog"
      className="portfolio-section border-t border-[var(--landing-border-subtle)] bg-[var(--landing-card-bg)]/30"
    >
      <ScrollGroup className="portfolio-container max-w-3xl">
        <ScrollScrub>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-center sm:text-left">
              <SectionLabel>{t.blog.sectionBadge}</SectionLabel>
              <h2 className="portfolio-heading-lg">{t.blog.title}</h2>
              <p className="portfolio-body mt-3">{t.blog.homeSubtitle}</p>
            </div>
            <Link
              href="/blog"
              className="portfolio-btn-primary mx-auto shrink-0 gap-2 sm:mx-0"
            >
              {t.blog.allPosts}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </ScrollScrub>

        <div>
          {posts.map((post) => (
            <ScrollItem key={post.slug}>
              <BlogPostCard post={post} />
            </ScrollItem>
          ))}
        </div>
      </ScrollGroup>
    </section>
  )
}
