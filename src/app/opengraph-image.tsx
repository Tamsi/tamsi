import { ImageResponse } from 'next/og'
import { PERSON_NAME, SITE_NAME } from '@/data/site-links'

export const alt = `${PERSON_NAME} — AI Engineer · MCP & AI devtools`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background:
            'linear-gradient(145deg, #fafafa 0%, #f4f4f5 45%, #eff6ff 100%)',
          color: '#18181b',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#2563eb',
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            {PERSON_NAME}
          </div>
          <div style={{ fontSize: 32, color: '#52525b', maxWidth: 900 }}>
            AI Engineer · MCP servers · AI devtools · Paris
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#a1a1aa' }}>
          Portfolio · Open source · Machine view at /machine
        </div>
      </div>
    ),
    { ...size },
  )
}
