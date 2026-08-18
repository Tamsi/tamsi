import { PERSON_NAME, SITE_NAME } from '@/data/site-links'

type OgFrameProps = {
  kicker?: string
  title: string
  subtitle: string
  footer?: string
}

export function OgFrame({
  kicker = SITE_NAME,
  title,
  subtitle,
  footer = `${PERSON_NAME} · Paris`,
}: OgFrameProps) {
  return (
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
          {kicker}
        </div>
        <div
          style={{
            fontSize: title.length > 48 ? 48 : 64,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: '#52525b', maxWidth: 960 }}>
          {subtitle}
        </div>
      </div>
      <div style={{ fontSize: 22, color: '#a1a1aa' }}>{footer}</div>
    </div>
  )
}
