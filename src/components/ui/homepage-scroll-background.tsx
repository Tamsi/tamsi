'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { mountHelixScene } from '@/lib/three-scroll-bg/helix-scene'
import { mountOrbitScene } from '@/lib/three-scroll-bg/orbit-scene'
import { scrollProgress } from '@/lib/three-scroll-bg/shared'

/** Switch variant: `'orbit'` (constellation) | `'helix'` (double helix flow) */
const SCROLL_BG_VARIANT: 'orbit' | 'helix' = 'orbit'

const VARIANT_CLASS = {
  orbit: 'homepage-three-bg--orbit',
  helix: 'homepage-three-bg--helix',
} as const

export function HomepageScrollBackground() {
  const hostRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const host = hostRef.current
    if (!host) return

    const scene =
      SCROLL_BG_VARIANT === 'orbit'
        ? mountOrbitScene(host)
        : mountHelixScene(host)

    let targetP = scrollProgress()
    let currentP = targetP
    let raf = 0
    let running = true

    const resize = () => {
      scene.resize(host.clientWidth, host.clientHeight)
    }

    const frame = (time: number) => {
      if (!running) return
      raf = requestAnimationFrame(frame)
      currentP += (targetP - currentP) * 0.06
      scene.frame(currentP, time)
    }

    const onScroll = () => {
      targetP = scrollProgress()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
      scene.dispose()
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`homepage-three-bg ${VARIANT_CLASS[SCROLL_BG_VARIANT]} pointer-events-none fixed inset-0 z-0`}
    />
  )
}
