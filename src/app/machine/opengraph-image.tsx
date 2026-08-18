import { ImageResponse } from 'next/og'
import { OG_IMAGE_SIZE, PERSON_NAME } from '@/data/site-links'
import { OgFrame } from '@/lib/og-frame'

export const alt = `${PERSON_NAME} — machine-readable portfolio`
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function MachineOpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="Machine-readable portfolio"
        subtitle="Structured view for agents, crawlers, and llms.txt"
      />
    ),
    { ...size },
  )
}
