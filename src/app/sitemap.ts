import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site-links'
import { getBlogSlugs } from '@/lib/blog'
import { defaultLocale, locales } from '@/i18n/dictionaries'
import { localePageUrl, type SitePath } from '@/lib/seo'

const paths: SitePath[] = ['/', '/machine', '/blog', '/adventure']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const path of paths) {
    for (const locale of locales) {
      entries.push({
        url: localePageUrl(path, locale),
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? (locale === defaultLocale ? 1 : 0.9) : 0.8,
      })
    }
  }

  entries.push({
    url: `${SITE_URL}/llms.txt`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })

  for (const slug of getBlogSlugs()) {
    entries.push({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    })
  }

  return entries
}
