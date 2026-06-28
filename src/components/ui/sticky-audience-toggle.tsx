'use client'

import { usePathname } from 'next/navigation'
import { AudienceToggle } from '@/components/ui/audience-toggle'

/** Bottom-centered Human / Machine switch, hidden on /adventure (spell bar replaces it). */
export function StickyAudienceToggle() {
  const pathname = usePathname()
  if (pathname.startsWith('/adventure')) return null
  return <AudienceToggle sticky />
}
