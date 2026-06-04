import { buildLlmsTxt } from '@/lib/portfolio-machine'
import { parseLocale } from '@/i18n/locale-config'
import { SITE_URL } from '@/data/site-links'

export const dynamic = 'force-static'

export function GET(request: Request) {
  const locale = parseLocale(new URL(request.url).searchParams.get('locale'))
  const body = buildLlmsTxt(locale)
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      Link: `<${SITE_URL}/>; rel="canonical", <${SITE_URL}/machine>; rel="alternate"`,
    },
  })
}
