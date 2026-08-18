import { ImageResponse } from 'next/og'
import { OG_IMAGE_SIZE, PERSON_NAME } from '@/data/site-links'
import { OgFrame } from '@/lib/og-frame'

export const alt = `${PERSON_NAME} — isometric adventure`
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function AdventureOpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="Isometric adventure"
        subtitle="A Dofus-style side quest on tamsi.dev"
      />
    ),
    { ...size },
  )
}
