'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/i18n/locale-context'

const navKeys = ['about', 'experience', 'skills', 'projects', 'contact'] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { locale, setLocale, t } = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      setOpen(false)
      const el = document.querySelector(href)
      if (!el) return
      setTimeout(() => {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth',
        })
      }, 10)
    },
    [],
  )

  const Wrapper = prefersReducedMotion ? 'nav' : motion.nav

  const LocaleToggle = (
    <div className="flex items-center rounded-md border border-border/50 text-xs">
      <button
        onClick={() => setLocale('fr')}
        className={cn(
          'rounded-l-md px-2 py-1 transition-colors',
          locale === 'fr'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
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
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        EN
      </button>
    </div>
  )

  return (
    <>
      <Wrapper
        {...(!prefersReducedMotion && {
          initial: { y: -60, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        })}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || open
            ? 'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm'
            : 'bg-transparent',
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

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
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
            <div className="ml-2">{LocaleToggle}</div>
          </div>

          {/* Mobile: locale toggle + burger */}
          <div className="flex items-center gap-3 md:hidden">
            {LocaleToggle}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </Wrapper>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-6">
              {navKeys.map((key, i) => (
                <motion.a
                  key={key}
                  href={`#${key}`}
                  onClick={(e) => handleClick(e, `#${key}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className="text-2xl font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {t.nav[key]}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
