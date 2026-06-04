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

export type SitePath = '/' | '/machine'

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
