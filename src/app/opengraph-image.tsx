import { ImageResponse } from 'next/og'
import { PERSON_NAME, SITE_NAME } from '@/data/site-links'

export const alt = `${PERSON_NAME} — Full-stack · MCP & AI devtools`
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
            'linear-gradient(145deg, #0a0a0f 0%, #12121a 45%, #1a1028 100%)',
          color: '#f4f4f5',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#a78bfa',
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            {PERSON_NAME}
          </div>
          <div style={{ fontSize: 32, color: '#d4d4d8', maxWidth: 900 }}>
            Full-stack · MCP servers · AI devtools · Paris
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#71717a' }}>
          Portfolio · Open source · Machine view at /machine
        </div>
      </div>
    ),
    { ...size },
  )
}
