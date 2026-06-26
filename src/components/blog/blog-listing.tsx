'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/reveal'
import { SectionLabel } from '@/components/ui/section-label'
import { BlogPostCard } from '@/components/blog/blog-post-card'
import { getAllBlogPosts } from '@/lib/blog'
import { useLocale } from '@/i18n/locale-context'

export function BlogListing() {
  const { t } = useLocale()
  const posts = getAllBlogPosts()

  return (
    <section className="portfolio-section pt-[calc(var(--landing-nav-h)+2rem)]">
      <StaggerContainer stagger={0.06} className="portfolio-container max-w-3xl">
        <StaggerItem variant="fade-up-blur">
          <div className="mb-10 text-center sm:text-left">
            <SectionLabel>{t.blog.sectionBadge}</SectionLabel>
            <h1 className="portfolio-heading-lg">{t.blog.title}</h1>
            <p className="portfolio-body mt-3">{t.blog.subtitle}</p>
          </div>
        </StaggerItem>

        <div>
          {posts.map((post, index) => (
            <StaggerItem key={post.slug} variant="fade-up">
              <BlogPostCard post={post} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  )
}

export function BlogBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--landing-text-muted)] transition-colors hover:text-[var(--landing-accent)]"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </Link>
  )
}
