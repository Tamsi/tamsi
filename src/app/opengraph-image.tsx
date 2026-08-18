import { ImageResponse } from 'next/og'
import { OG_IMAGE_SIZE, PERSON_NAME } from '@/data/site-links'
import { OgFrame } from '@/lib/og-frame'

export const alt = `${PERSON_NAME} — AI engineer · MCP & AI devtools`
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title={PERSON_NAME}
        subtitle="AI Engineer · MCP servers · AI devtools · Paris"
        footer="Portfolio · Open source · Machine view at /machine"
      />
    ),
    { ...size },
  )
}
