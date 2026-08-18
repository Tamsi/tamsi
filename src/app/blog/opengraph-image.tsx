import { ImageResponse } from 'next/og'
import { OG_IMAGE_SIZE, PERSON_NAME } from '@/data/site-links'
import { OgFrame } from '@/lib/og-frame'

export const alt = `Blog — ${PERSON_NAME}`
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function BlogOpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="Blog"
        subtitle="MCP, local LLMs, Unsloth, and AI tooling notes"
      />
    ),
    { ...size },
  )
}
