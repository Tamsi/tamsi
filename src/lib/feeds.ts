import { PERSON_NAME, SITE_NAME, SITE_URL } from '@/data/site-links'
import { dictionaries, type Locale } from '@/i18n/dictionaries'
import {
  blogPostLocaleUrl,
  blogPostToMarkdown,
  getAllBlogPosts,
  getBlogPostContent,
  latestBlogPublishedAt,
} from '@/lib/blog'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function rfc822(date: Date): string {
  return date.toUTCString()
}

export function buildRssFeed(locale: Locale): string {
  const t = dictionaries[locale]
  const posts = getAllBlogPosts()
  const self = `${SITE_URL}/feed.xml${locale === 'en' ? '?locale=en' : ''}`

  const items = posts
    .map((post) => {
      const content = getBlogPostContent(post, locale)
      const url = `${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`
      const markdown = blogPostToMarkdown(post, locale)
      return [
        '    <item>',
        `      <title>${escapeXml(content.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${rfc822(new Date(post.publishedAt))}</pubDate>`,
        `      <description>${escapeXml(content.description)}</description>`,
        `      <content:encoded><![CDATA[${markdown}]]></content:encoded>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escapeXml(`${SITE_NAME} — ${t.blog.title}`)}</title>`,
    `    <link>${SITE_URL}/blog</link>`,
    `    <description>${escapeXml(t.meta.blogDescription)}</description>`,
    `    <language>${locale}</language>`,
    `    <lastBuildDate>${rfc822(latestBlogPublishedAt())}</lastBuildDate>`,
    `    <managingEditor>${PERSON_NAME}</managingEditor>`,
    `    <atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}

export function buildJsonFeed(locale: Locale): string {
  const t = dictionaries[locale]
  const feedUrl = `${SITE_URL}/feed.json${locale === 'en' ? '?locale=en' : ''}`

  return JSON.stringify(
    {
      version: 'https://jsonfeed.org/version/1.1',
      title: `${SITE_NAME} — ${t.blog.title}`,
      home_page_url: `${SITE_URL}/blog`,
      feed_url: feedUrl,
      description: t.meta.blogDescription,
      language: locale,
      authors: [{ name: PERSON_NAME, url: SITE_URL }],
      items: getAllBlogPosts().map((post) => {
        const content = getBlogPostContent(post, locale)
        return {
          id: `${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`,
          url: `${SITE_URL}${blogPostLocaleUrl(post.slug, locale)}`,
          title: content.title,
          summary: content.description,
          content_text: blogPostToMarkdown(post, locale),
          date_published: `${post.publishedAt}T00:00:00.000Z`,
          tags: post.tags,
          authors: [{ name: PERSON_NAME, url: SITE_URL }],
          language: locale,
        }
      }),
    },
    null,
    2,
  )
}
