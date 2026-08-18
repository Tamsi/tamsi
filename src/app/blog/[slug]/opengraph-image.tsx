import { ImageResponse } from 'next/og'
import { OG_IMAGE_SIZE } from '@/data/site-links'
import { defaultLocale } from '@/i18n/dictionaries'
import { OgFrame } from '@/lib/og-frame'
import { getBlogPost, getBlogPostContent, getBlogSlugs } from '@/lib/blog'

export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const alt = 'Blog post'

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export default async function BlogPostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  const title = post
    ? getBlogPostContent(post, defaultLocale).title
    : slug
  const subtitle = post
    ? getBlogPostContent(post, defaultLocale).description
    : 'tamsi.dev'

  return new ImageResponse(
    <OgFrame kicker="BLOG" title={title} subtitle={subtitle} />,
    { ...size },
  )
}
