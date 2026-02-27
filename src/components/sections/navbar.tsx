'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/i18n/locale-context'

const navKeys = ['about', 'experience', 'skills', 'projects', 'contact'] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { locale, setLocale, t } = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 72,
      behavior: 'smooth',
    })
  }

  const Wrapper = prefersReducedMotion ? 'nav' : motion.nav

  return (
    <Wrapper
      {...(!prefersReducedMotion && {
        initial: { y: -60, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      })}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <a
          href="#hero"
          onClick={(e) => handleClick(e, '#hero')}
          className="text-sm font-bold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          TB
        </a>

        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {navKeys.map((key) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  onClick={(e) => handleClick(e, `#${key}`)}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
                >
                  {t.nav[key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-2 flex items-center rounded-md border border-border/50 text-xs">
            <button
              onClick={() => setLocale('fr')}
              className={cn(
                'rounded-l-md px-2 py-1 transition-colors',
                locale === 'fr'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              FR
            </button>
            <button
              onClick={() => setLocale('en')}
              className={cn(
                'rounded-r-md px-2 py-1 transition-colors',
                locale === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
