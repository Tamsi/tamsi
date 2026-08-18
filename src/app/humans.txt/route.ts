import { buildHumansTxt } from '@/lib/portfolio-machine'
import { SITE_URL } from '@/data/site-links'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildHumansTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      Link: `<${SITE_URL}/>; rel="canonical"`,
    },
  })
}
