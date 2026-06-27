import { NextRequest, NextResponse } from 'next/server'

const UPSTREAM = 'https://api.dofusretro.fr'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const upstreamPath = path.join('/')
  const url = `${UPSTREAM}/${upstreamPath}`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Upstream asset not found' },
        { status: res.status },
      )
    }

    const contentType =
      res.headers.get('content-type') ?? 'application/octet-stream'
    const body = await res.arrayBuffer()

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 })
  }
}
