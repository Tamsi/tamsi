import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Navbar } from '@/components/sections/navbar'
import { ArticleContent } from '@/components/blog/article-content'
import { BlogBackLink } from '@/components/blog/blog-listing'
import { BlogReadProgress } from '@/components/blog/blog-read-progress'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/seo/json-ld'
import { getServerLocale } from '@/i18n/locale.server'
import { dictionaries } from '@/i18n/dictionaries'
import {
  formatBlogDate,
  getBlogPost,
  getBlogPostContent,
  getBlogSlugs,
} from '@/lib/blog'
import { buildBlogPostJsonLd, buildBlogPostMetadata } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  const locale = await getServerLocale()
  return buildBlogPostMetadata(locale, post)
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const locale = await getServerLocale()
  const t = dictionaries[locale].blog
  const content = getBlogPostContent(post, locale)

  return (
    <>
      <JsonLd data={buildBlogPostJsonLd(locale, post)} />
      <Navbar />
      <BlogReadProgress articleId="blog-post" />
      <main className="relative">
        <article
          id="blog-post"
          className="portfolio-section pt-[calc(var(--landing-nav-h)+2rem)]"
        >
          <div className="portfolio-container max-w-3xl">
            <BlogBackLink href="/blog" label={t.backToBlog} />

            <header className="mb-10 border-b border-[var(--landing-border-subtle)] pb-8">
              <p className="portfolio-section-label mb-3">
                {formatBlogDate(post.publishedAt, locale)}
              </p>
              <h1 className="portfolio-heading-lg mb-4">{content.title}</h1>
              <p className="portfolio-body mb-4">{content.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--landing-text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden />
                  {t.readingTime.replace(
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
                ← {t.backToBlog}
              </Link>
            </footer>
          </div>
        </article>
        <Contact />
      </main>
    </>
  )
}
