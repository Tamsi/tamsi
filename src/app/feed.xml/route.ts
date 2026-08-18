import { parseLocale } from '@/i18n/locale-config'
import { buildRssFeed } from '@/lib/feeds'

export const dynamic = 'force-static'

export function GET(request: Request) {
  const locale = parseLocale(new URL(request.url).searchParams.get('locale'))
  return new Response(buildRssFeed(locale), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
