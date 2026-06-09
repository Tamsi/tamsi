'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/reveal'
import { SectionLabel } from '@/components/ui/section-label'
import { BlogPostCard } from '@/components/blog/blog-post-card'
import { getAllBlogPosts } from '@/lib/blog'
import { useLocale } from '@/i18n/locale-context'

const PREVIEW_COUNT = 2

export function BlogPreview() {
  const { t } = useLocale()
  const posts = getAllBlogPosts().slice(0, PREVIEW_COUNT)

  return (
    <section
      id="blog"
      className="portfolio-section border-t border-[var(--landing-border-subtle)]"
    >
      <StaggerContainer stagger={0.06} className="portfolio-container max-w-3xl">
        <StaggerItem variant="fade-up-blur">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-center sm:text-left">
              <SectionLabel>{t.blog.sectionBadge}</SectionLabel>
              <h2 className="portfolio-heading-lg">{t.blog.title}</h2>
              <p className="portfolio-body mt-3">{t.blog.homeSubtitle}</p>
            </div>
            <Link
              href="/blog"
              className="portfolio-btn-outline mx-auto shrink-0 gap-2 sm:mx-0"
            >
              {t.blog.allPosts}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </StaggerItem>

        <div>
          {posts.map((post, index) => (
            <StaggerItem key={post.slug} variant="fade-up">
              <BlogPostCard post={post} index={index} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  )
}
