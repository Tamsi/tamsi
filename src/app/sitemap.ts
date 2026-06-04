import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site-links'
import { defaultLocale, locales } from '@/i18n/dictionaries'
import { localePageUrl, type SitePath } from '@/lib/seo'

const paths: SitePath[] = ['/', '/machine']

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

  return entries
}
