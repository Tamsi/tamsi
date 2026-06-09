import type { Metadata } from 'next'
import {
  dictionaries,
  defaultLocale,
  locales,
  type Locale,
} from '@/i18n/dictionaries'
import {
  EMAIL,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
  socialLinks,
} from '@/data/site-links'
import type { BlogPost } from '@/content/blog'
import { blogPostPath, getBlogPostContent } from '@/lib/blog'

export type SitePath = '/' | '/machine' | '/blog'

export function localePageUrl(path: SitePath, locale: Locale): string {
  const url = new URL(path, SITE_URL)
  if (locale !== defaultLocale) {
    url.searchParams.set('locale', locale)
  }
  return url.toString()
}

export function buildLanguageAlternates(path: SitePath) {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = localePageUrl(path, locale)
  }
  languages['x-default'] = localePageUrl(path, defaultLocale)
  return languages
}

export function buildPageMetadata(
  locale: Locale,
  path: SitePath,
): Metadata {
  const t = dictionaries[locale]
  const isMachine = path === '/machine'
  const title = isMachine ? t.meta.machineTitle : t.meta.title
  const description = isMachine
    ? t.meta.machineDescription
    : t.meta.description
  const canonical = localePageUrl(path, locale)

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
      types: {
        'text/plain': [{ url: `${SITE_URL}/llms.txt` }],
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR'],
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    authors: [{ name: PERSON_NAME, url: SITE_URL }],
    creator: PERSON_NAME,
    category: 'technology',
  }
}

export function buildPersonJsonLd(locale: Locale) {
  const t = dictionaries[locale]
  const externalProfiles = socialLinks
    .filter((l) => l.href.startsWith('http'))
    .map((l) => l.href)

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: PERSON_NAME,
    url: SITE_URL,
    email: EMAIL,
    jobTitle: t.hero.title,
    description: t.meta.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    knowsAbout: [
      ...t.about.focusItems.map((f) => f.title),
      ...t.interests.groups.map((g) => g.title),
    ],
    sameAs: externalProfiles,
    worksFor: {
      '@type': 'Organization',
      name: t.about.company,
      url: t.about.companyUrl,
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: t.about.school,
      url: t.about.schoolUrl,
    },
  }
}

export function buildWebSiteJsonLd(locale: Locale) {
  const t = dictionaries[locale]
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: t.meta.description,
    inLanguage: [...locales],
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
    potentialAction: {
      '@type': 'ReadAction',
      target: [
        localePageUrl('/', locale),
        localePageUrl('/machine', locale),
        `${SITE_URL}/llms.txt`,
      ],
    },
  }
}

export function buildProfilePageJsonLd(locale: Locale, path: SitePath) {
  const t = dictionaries[locale]
  const isMachine = path === '/machine'
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${localePageUrl(path, locale)}#profile`,
    url: localePageUrl(path, locale),
    name: isMachine ? t.meta.machineTitle : t.meta.title,
    description: isMachine ? t.meta.machineDescription : t.meta.description,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${SITE_URL}/#person` },
    about: { '@id': `${SITE_URL}/#person` },
  }
}

export function buildStructuredDataGraph(locale: Locale, path: SitePath) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildPersonJsonLd(locale),
      buildWebSiteJsonLd(locale),
      buildProfilePageJsonLd(locale, path),
    ],
  }
}

export function buildBlogListingMetadata(locale: Locale): Metadata {
  const t = dictionaries[locale]
  const canonical = localePageUrl('/blog', locale)

  return {
    title: t.meta.blogTitle,
    description: t.meta.blogDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: buildLanguageAlternates('/blog'),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      url: canonical,
      siteName: SITE_NAME,
      title: t.meta.blogTitle,
      description: t.meta.blogDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.blogTitle,
      description: t.meta.blogDescription,
    },
  }
}

export function buildBlogPostMetadata(
  locale: Locale,
  post: BlogPost,
): Metadata {
  const content = getBlogPostContent(post, locale)
  const path = blogPostPath(post.slug)
  const canonical = `${SITE_URL}${path}`

  return {
    title: `${content.title} — ${SITE_NAME}`,
    description: content.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: buildLanguageAlternates('/blog'),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      url: canonical,
      siteName: SITE_NAME,
      title: content.title,
      description: content.description,
      publishedTime: post.publishedAt,
      authors: [PERSON_NAME],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
    },
  }
}

export function buildBlogListingJsonLd(locale: Locale) {
  const t = dictionaries[locale]
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${localePageUrl('/blog', locale)}#blog`,
    url: localePageUrl('/blog', locale),
    name: t.blog.title,
    description: t.meta.blogDescription,
    inLanguage: locale,
    author: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }
}

export function buildBlogPostJsonLd(locale: Locale, post: BlogPost) {
  const content = getBlogPostContent(post, locale)
  const url = `${SITE_URL}${blogPostPath(post.slug)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: content.title,
    description: content.description,
    datePublished: post.publishedAt,
    inLanguage: locale,
    url,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
    },
    keywords: post.tags.join(', '),
    isPartOf: { '@id': `${localePageUrl('/blog', locale)}#blog` },
    mainEntityOfPage: url,
  }
}
