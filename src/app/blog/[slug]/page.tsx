import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/sections/navbar'
import { BlogPostView } from '@/components/blog/blog-post-view'
import { BlogReadProgress } from '@/components/blog/blog-read-progress'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/seo/json-ld'
import { getServerLocale } from '@/i18n/locale.server'
import { getBlogPost, getBlogSlugs } from '@/lib/blog'
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
            <BlogPostView post={post} />
          </div>
        </article>
        <Contact />
      </main>
    </>
  )
}
