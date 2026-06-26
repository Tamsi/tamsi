'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { animate } from 'animejs'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** Fast progress (visible in the first ~2 viewports) + slow drift for the rest of the page */
function scrollProgress(speed = 1) {
  const y = window.scrollY
  const vh = window.innerHeight
  const max = document.documentElement.scrollHeight - vh
  const fast = clamp(y / (vh * 2), 0, 1)
  const slow = max > 0 ? clamp(y / max, 0, 1) : 0
  return clamp((fast * 0.7 + slow * 0.3) * speed, 0, 1)
}

/**
 * Full-page background layer scrubbed to scroll via anime.js seek.
 * Fixed behind content — orbs + grid drift as you scroll the homepage.
 */
export function HomepageScrollBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root) return

    let cancelled = false
    const layers = [
      {
        el: root.querySelector<HTMLElement>('[data-bg-layer="orb-1"]'),
        speed: 1,
        anim: null as ReturnType<typeof animate> | null,
      },
      {
        el: root.querySelector<HTMLElement>('[data-bg-layer="orb-2"]'),
        speed: 0.72,
        anim: null as ReturnType<typeof animate> | null,
      },
      {
        el: root.querySelector<HTMLElement>('[data-bg-layer="orb-3"]'),
        speed: 1.35,
        anim: null as ReturnType<typeof animate> | null,
      },
      {
        el: root.querySelector<HTMLElement>('[data-bg-layer="grid"]'),
        speed: 0.55,
        anim: null as ReturnType<typeof animate> | null,
      },
      {
        el: root.querySelector<HTMLElement>('[data-bg-layer="lines"]'),
        speed: 1.1,
        anim: null as ReturnType<typeof animate> | null,
      },
    ]

    const orb1 = layers[0].el
    const orb2 = layers[1].el
    const orb3 = layers[2].el
    const grid = layers[3].el
    const lines = layers[4].el

    if (orb1) {
      layers[0].anim = animate(orb1, {
        translateX: ['-12vw', '28vw'],
        translateY: ['-12vh', '55vh'],
        scale: [0.75, 1.35],
        duration: 1,
        ease: 'linear',
        autoplay: false,
      })
    }

    if (orb2) {
      layers[1].anim = animate(orb2, {
        translateX: ['18vw', '-32vw'],
        translateY: ['15vh', '-50vh'],
        scale: [0.9, 1.55],
        rotate: ['0deg', '-90deg'],
        duration: 1,
        ease: 'linear',
        autoplay: false,
      })
    }

    if (orb3) {
      layers[2].anim = animate(orb3, {
        translateX: ['-22vw', '15vw'],
        translateY: ['30vh', '-35vh'],
        scale: [0.65, 1.25],
        rotate: ['0deg', '120deg'],
        duration: 1,
        ease: 'linear',
        autoplay: false,
      })
    }

    if (grid) {
      layers[3].anim = animate(grid, {
        translateY: ['0px', '-280px'],
        rotate: ['0deg', '12deg'],
        scale: [1, 1.15],
        opacity: [0.45, 0.9],
        duration: 1,
        ease: 'linear',
        autoplay: false,
      })
    }

    if (lines) {
      layers[4].anim = animate(lines, {
        translateX: ['-12%', '18%'],
        translateY: ['0%', '-40%'],
        rotate: ['-6deg', '14deg'],
        duration: 1,
        ease: 'linear',
        autoplay: false,
      })
    }

    const tick = () => {
      if (cancelled) return
      for (const { anim, speed } of layers) {
        if (!anim) continue
        anim.seek(scrollProgress(speed) * anim.duration)
      }
    }

    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick, { passive: true })
    requestAnimationFrame(tick)

    return () => {
      cancelled = true
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
      for (const { anim } of layers) anim?.revert()
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="homepage-scroll-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div data-bg-layer="grid" className="homepage-scroll-bg__grid" />
      <div data-bg-layer="lines" className="homepage-scroll-bg__lines">
        <span />
        <span />
        <span />
      </div>
      <div data-bg-layer="orb-1" className="homepage-scroll-bg__orb homepage-scroll-bg__orb--1" />
      <div data-bg-layer="orb-2" className="homepage-scroll-bg__orb homepage-scroll-bg__orb--2" />
      <div data-bg-layer="orb-3" className="homepage-scroll-bg__orb homepage-scroll-bg__orb--3" />
    </div>
  )
}
