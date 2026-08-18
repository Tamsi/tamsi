import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site-links'
import {
  getAllBlogPosts,
  latestBlogPublishedAt,
} from '@/lib/blog'
import { defaultLocale, locales } from '@/i18n/dictionaries'
import {
  buildBlogPostLanguageAlternates,
  buildLanguageAlternates,
  localePageUrl,
  type SitePath,
} from '@/lib/seo'

const paths: SitePath[] = ['/', '/machine', '/blog', '/adventure']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = latestBlogPublishedAt()
  const entries: MetadataRoute.Sitemap = []

  for (const path of paths) {
    const priority =
      path === '/' ? 1 : path === '/blog' ? 0.85 : path === '/machine' ? 0.8 : 0.5
    const languages = buildLanguageAlternates(path)

    for (const locale of locales) {
      entries.push({
        url: localePageUrl(path, locale),
        lastModified,
        changeFrequency: path === '/' || path === '/blog' ? 'weekly' : 'monthly',
        priority: locale === defaultLocale ? priority : Number((priority - 0.1).toFixed(2)),
        alternates: { languages },
      })
    }
  }

  for (const extra of ['/llms.txt', '/llms-full.txt', '/feed.xml', '/humans.txt'] as const) {
    entries.push({
      url: `${SITE_URL}${extra}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: extra === '/llms.txt' ? 0.7 : 0.55,
    })
  }

  for (const post of getAllBlogPosts()) {
    const published = new Date(post.publishedAt)
    const languages = buildBlogPostLanguageAlternates(post.slug)
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}${
          locale === defaultLocale
            ? `/blog/${post.slug}`
            : `/blog/${post.slug}?locale=${locale}`
        }`,
        lastModified: published,
        changeFrequency: 'monthly',
        priority: locale === defaultLocale ? 0.75 : 0.65,
        alternates: { languages },
      })
    }
  }

  return entries
}
