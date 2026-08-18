import type { Metadata } from 'next'
import {
  dictionaries,
  defaultLocale,
  locales,
  type Locale,
} from '@/i18n/dictionaries'
import {
  EMAIL,
  OG_IMAGE_PATH,
  OG_IMAGE_SIZE,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  socialLinks,
} from '@/data/site-links'
import type { BlogPost } from '@/content/blog'
import {
  blogPostLocaleUrl,
  blogPostWordCount,
  getAllBlogPosts,
  getBlogPostContent,
} from '@/lib/blog'

export type SitePath = '/' | '/machine' | '/blog' | '/adventure'

export const indexFollowRobots: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

function ogLocale(locale: Locale) {
  return locale === 'fr' ? 'fr_FR' : 'en_US'
}

function discoveryTypes(): NonNullable<Metadata['alternates']>['types'] {
  return {
    'application/rss+xml': [{ url: `${SITE_URL}/feed.xml`, title: 'Blog RSS' }],
    'application/feed+json': [
      { url: `${SITE_URL}/feed.json`, title: 'Blog JSON Feed' },
    ],
    'text/plain': [
      { url: `${SITE_URL}/llms.txt`, title: 'llms.txt' },
      { url: `${SITE_URL}/llms-full.txt`, title: 'llms-full.txt' },
    ],
  }
}

export function ogImageDescriptor(path = OG_IMAGE_PATH, alt?: string) {
  return {
    url: path,
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
    alt: alt ?? `${PERSON_NAME} — AI Engineer`,
    type: 'image/png' as const,
  }
}

function pageMeta(
  t: (typeof dictionaries)[Locale],
  path: SitePath,
): { title: string; description: string } {
  switch (path) {
    case '/machine':
      return {
        title: t.meta.machineTitle,
        description: t.meta.machineDescription,
      }
    case '/adventure':
      return {
        title: t.meta.adventureTitle,
        description: t.meta.adventureDescription,
      }
    case '/blog':
      return {
        title: t.meta.blogTitle,
        description: t.meta.blogDescription,
      }
    default:
      return { title: t.meta.title, description: t.meta.description }
  }
}

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

export function buildSharedMetadata(locale: Locale): Metadata {
  const t = dictionaries[locale]

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: t.meta.title,
      template: `%s · ${PERSON_NAME}`,
    },
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    authors: [{ name: PERSON_NAME, url: SITE_URL }],
    creator: PERSON_NAME,
    publisher: PERSON_NAME,
    category: 'technology',
    formatDetection: { email: false, telephone: false, address: false },
    robots: indexFollowRobots,
    manifest: '/manifest.webmanifest',
    alternates: {
      types: discoveryTypes(),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      images: [ogImageDescriptor()],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
    other: {
      'geo.region': 'FR-IDF',
      'geo.placename': 'Paris',
    },
  }
}

export function buildPageMetadata(
  locale: Locale,
  path: SitePath,
): Metadata {
  const t = dictionaries[locale]
  const { title, description } = pageMeta(t, path)
  const canonical = localePageUrl(path, locale)
  const image = ogImageDescriptor(
    path === '/' ? OG_IMAGE_PATH : `${path}/opengraph-image`,
    title,
  )

  return {
    title: path === '/' ? { absolute: title } : title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
      types: discoveryTypes(),
    },
    robots: indexFollowRobots,
    openGraph: {
      type: 'website',
      locale: ogLocale(locale),
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR'],
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [image.url],
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
    givenName: 'Tamsi',
    familyName: 'Besson',
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
    email: EMAIL,
    jobTitle: t.hero.title,
    description: t.meta.description,
    nationality: 'FR',
    knowsLanguage: t.about.languages.map((l) => l.name),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressRegion: 'Île-de-France',
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
        localePageUrl('/blog', locale),
        `${SITE_URL}/llms.txt`,
        `${SITE_URL}/llms-full.txt`,
        `${SITE_URL}/feed.xml`,
      ],
    },
  }
}

export function buildProfilePageJsonLd(locale: Locale, path: SitePath) {
  return buildDocumentJsonLd(locale, path)
}

export function buildDocumentJsonLd(locale: Locale, path: SitePath) {
  const t = dictionaries[locale]
  const { title, description } = pageMeta(t, path)
  const url = localePageUrl(path, locale)

  if (path === '/adventure') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      url,
      name: title,
      description,
      inLanguage: locale,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      author: { '@id': `${SITE_URL}/#person` },
    }
  }

  if (path === '/machine') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: title,
      description,
      inLanguage: locale,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#person` },
      mainEntity: { '@id': `${SITE_URL}/#person` },
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${SITE_URL}/#person` },
    about: { '@id': `${SITE_URL}/#person` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '#about'],
    },
  }
}

export function buildFeaturedWorkJsonLd(locale: Locale) {
  const t = dictionaries[locale]
  const featured = t.projects.items.filter((p) => p.featured)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#work`,
    name: t.projects.title,
    itemListElement: featured.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        name: project.title,
        description: project.description,
        url: project.url,
        codeRepository: project.url,
        programmingLanguage: project.language,
        author: { '@id': `${SITE_URL}/#person` },
      },
    })),
  }
}

export function buildStructuredDataGraph(locale: Locale, path: SitePath) {
  const graph: Record<string, unknown>[] = [
    buildPersonJsonLd(locale),
    buildWebSiteJsonLd(locale),
    buildDocumentJsonLd(locale, path),
  ]
  if (path === '/') {
    graph.push(buildFeaturedWorkJsonLd(locale))
  }
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function buildBreadcrumbJsonLd(
  locale: Locale,
  crumbs: { name: string; path?: SitePath; url?: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url ?? localePageUrl(crumb.path ?? '/', locale),
    })),
  }
}

export function buildBlogListingMetadata(locale: Locale): Metadata {
  return buildPageMetadata(locale, '/blog')
}

export function buildBlogPostLanguageAlternates(slug: string) {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}${blogPostLocaleUrl(slug, locale)}`
  }
  languages['x-default'] = `${SITE_URL}${blogPostLocaleUrl(slug, defaultLocale)}`
  return languages
}

export function buildBlogPostMetadata(
  locale: Locale,
  post: BlogPost,
): Metadata {
  const content = getBlogPostContent(post, locale)
  const canonical = `${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`
  const image = ogImageDescriptor(
    `/blog/${post.slug}/opengraph-image`,
    content.title,
  )

  return {
    title: content.title,
    description: content.description,
    metadataBase: new URL(SITE_URL),
    keywords: post.tags,
    alternates: {
      canonical,
      languages: buildBlogPostLanguageAlternates(post.slug),
      types: discoveryTypes(),
    },
    robots: indexFollowRobots,
    openGraph: {
      type: 'article',
      locale: ogLocale(locale),
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR'],
      url: canonical,
      siteName: SITE_NAME,
      title: content.title,
      description: content.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [PERSON_NAME],
      section: 'Technology',
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: content.title,
      description: content.description,
      images: [image.url],
    },
    authors: [{ name: PERSON_NAME, url: SITE_URL }],
    creator: PERSON_NAME,
    category: 'technology',
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

export function buildBlogItemListJsonLd(locale: Locale) {
  const posts = getAllBlogPosts()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${localePageUrl('/blog', locale)}#list`,
    url: localePageUrl('/blog', locale),
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => {
      const content = getBlogPostContent(post, locale)
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`,
        name: content.title,
      }
    }),
  }
}

export function buildBlogListingStructuredData(locale: Locale) {
  const t = dictionaries[locale]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBlogListingJsonLd(locale),
      buildBlogItemListJsonLd(locale),
      buildBreadcrumbJsonLd(locale, [
        { name: SITE_NAME, path: '/' },
        { name: t.blog.title, path: '/blog' },
      ]),
    ],
  }
}

export function buildBlogPostJsonLd(locale: Locale, post: BlogPost) {
  const content = getBlogPostContent(post, locale)
  const url = `${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: content.title,
    description: content.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: locale,
    url,
    image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
    wordCount: blogPostWordCount(post, locale),
    timeRequired: `PT${post.readingTimeMinutes}M`,
    articleSection: 'Technology',
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
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'header p'],
    },
  }
}

export function buildBlogPostStructuredData(locale: Locale, post: BlogPost) {
  const t = dictionaries[locale]
  const content = getBlogPostContent(post, locale)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBlogPostJsonLd(locale, post),
      buildBreadcrumbJsonLd(locale, [
        { name: SITE_NAME, path: '/' },
        { name: t.blog.title, path: '/blog' },
        {
          name: content.title,
          url: `${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`,
        },
      ]),
    ],
  }
}
