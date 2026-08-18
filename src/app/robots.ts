import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site-links'

const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'GoogleOther',
  'PerplexityBot',
  'Applebot-Extended',
  'CCBot',
  'meta-externalagent',
  'Bytespider',
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
