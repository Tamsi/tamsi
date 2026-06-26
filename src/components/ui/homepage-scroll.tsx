'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { animate, stagger } from 'animejs'
import { HomepageScrollBackground } from '@/components/ui/homepage-scroll-background'

const REVEAL_Y = 28 // px
const REVEAL_BLUR = 5 // px

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** 0 → 1 as the element rises through the lower half of the viewport */
function scrollRevealProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  const start = vh * 0.92
  const end = vh * 0.38
  return clamp((start - rect.top) / (start - end), 0, 1)
}

/** 0 → 1 while the parent section crosses the viewport */
function sectionScrollProgress(section: HTMLElement) {
  const rect = section.getBoundingClientRect()
  const vh = window.innerHeight
  const total = rect.height + vh
  const travelled = vh - rect.top
  return clamp(travelled / total, 0, 1)
}

/**
 * Homepage scroll animations powered by anime.js.
 * Scroll-scrubbed reveals use animate + seek (animejs.com pattern, toned down).
 * Lists use IntersectionObserver + staggered animate on enter.
 */
export function HomepageScroll({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root) return

    let cancelled = false
    const cleanups: (() => void)[] = []

    const bindScrub = (el: HTMLElement, progressFor: () => number) => {
      const anim = animate(el, {
        opacity: [0, 1],
        translateY: [`${REVEAL_Y}px`, '0px'],
        duration: 1,
        ease: 'linear',
        autoplay: false,
      })

      const tick = () => {
        if (cancelled) return
        anim.seek(progressFor() * anim.duration)
      }

      window.addEventListener('scroll', tick, { passive: true })
      window.addEventListener('resize', tick, { passive: true })
      tick()
      cleanups.push(() => {
        window.removeEventListener('scroll', tick)
        window.removeEventListener('resize', tick)
        anim.revert()
      })
    }

    const bindParallax = (el: HTMLElement, section: HTMLElement) => {
      const anim = animate(el, {
        translateY: ['20px', '-20px'],
        duration: 1,
        ease: 'linear',
        autoplay: false,
      })

      const tick = () => {
        if (cancelled) return
        anim.seek(sectionScrollProgress(section) * anim.duration)
      }

      window.addEventListener('scroll', tick, { passive: true })
      window.addEventListener('resize', tick, { passive: true })
      tick()
      cleanups.push(() => {
        window.removeEventListener('scroll', tick)
        window.removeEventListener('resize', tick)
        anim.revert()
      })
    }

    // Scroll-scrubbed section headers
    root.querySelectorAll<HTMLElement>('[data-scroll-scrub]').forEach((el) => {
      bindScrub(el, () => scrollRevealProgress(el))
    })

    // One-shot reveal when entering the viewport
    root.querySelectorAll<HTMLElement>('[data-scroll-reveal]').forEach((el) => {
      const delay = Number(el.dataset.scrollDelay ?? 0)
      const withBlur = el.dataset.scrollBlur !== undefined
      let played = false

      el.style.opacity = '0'
      el.style.transform = `translateY(${REVEAL_Y}px)`
      if (withBlur) el.style.filter = `blur(${REVEAL_BLUR}px)`

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting || played || cancelled) return
          played = true
          animate(el, {
            opacity: [0, 1],
            translateY: [`${REVEAL_Y}px`, '0px'],
            ...(withBlur
              ? { filter: [`blur(${REVEAL_BLUR}px)`, 'blur(0px)'] }
              : {}),
            duration: 700,
            delay,
            ease: 'out(4)',
          })
          io.disconnect()
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      )
      io.observe(el)
      cleanups.push(() => io.disconnect())
    })

    // Staggered groups
    root.querySelectorAll<HTMLElement>('[data-scroll-group]').forEach((group) => {
      const items = [...group.querySelectorAll<HTMLElement>('[data-scroll-item]')]
      let played = false

      items.forEach((item) => {
        item.style.opacity = '0'
        item.style.transform = 'translateY(16px)'
      })

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting || played || cancelled) return
          played = true
          animate(items, {
            opacity: [0, 1],
            translateY: ['16px', '0px'],
            duration: 550,
            delay: stagger(50, { from: 'first' }),
            ease: 'out(3)',
          })
          io.disconnect()
        },
        { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
      )
      io.observe(group)
      cleanups.push(() => io.disconnect())
    })

    // Parallax on interest media
    root.querySelectorAll<HTMLElement>('[data-scroll-parallax]').forEach((el) => {
      const section = el.closest('section')
      if (section) bindParallax(el, section)
    })

    return () => {
      cancelled = true
      cleanups.forEach((fn) => fn())
    }
  }, [reduced])

  return (
    <div ref={rootRef} className="relative z-[1]">
      <HomepageScrollBackground />
      {children}
    </div>
  )
}

/** Scroll-scrubbed reveal — follows scroll progress (section headers). */
export function ScrollScrub({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div data-scroll-scrub className={className}>
      {children}
    </div>
  )
}

/** Animates in once when scrolled into view. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  blur = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  blur?: boolean
}) {
  return (
    <div
      data-scroll-reveal
      data-scroll-delay={delay || undefined}
      data-scroll-blur={blur ? '' : undefined}
      className={className}
    >
      {children}
    </div>
  )
}

export function ScrollGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div data-scroll-group className={className}>
      {children}
    </div>
  )
}

export function ScrollItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div data-scroll-item className={className}>
      {children}
    </div>
  )
}
