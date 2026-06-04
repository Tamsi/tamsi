'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/i18n/locale-context'

const navKeys = ['about', 'experience', 'interests', 'projects', 'contact'] as const

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
    return () => {
      document.body.style.overflow = ''
    }
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
    <div className="flex items-center rounded-full border border-[var(--landing-border-subtle)] text-xs">
      <button
        type="button"
        onClick={() => setLocale('fr')}
        className={cn(
          'rounded-l-full px-2.5 py-1 transition-colors',
          locale === 'fr'
            ? 'bg-[var(--landing-accent)] text-white'
            : 'text-[var(--landing-text-muted)] hover:text-[var(--landing-text)]',
        )}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={cn(
          'rounded-r-full px-2.5 py-1 transition-colors',
          locale === 'en'
            ? 'bg-[var(--landing-accent)] text-white'
            : 'text-[var(--landing-text-muted)] hover:text-[var(--landing-text)]',
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
          transition: { duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        })}
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
          scrolled || open
            ? 'border-b border-[var(--landing-border-subtle)] bg-[var(--landing-header-scrolled-bg)] backdrop-blur-lg'
            : 'bg-transparent',
        )}
      >
        <div className="portfolio-container flex h-[var(--landing-nav-h)] items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleClick(e, '#hero')}
            className="font-[family-name:var(--landing-font-display)] text-sm font-semibold tracking-tight text-[var(--landing-text)] transition-colors hover:text-[var(--landing-accent)]"
          >
            Tamsi
          </a>

          <div className="hidden items-center gap-1 md:flex">
            <ul className="flex items-center gap-1">
              {navKeys.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    onClick={(e) => handleClick(e, `#${key}`)}
                    className="group relative rounded-md px-3 py-1.5 text-sm text-[var(--landing-text-muted)] transition-colors hover:bg-[var(--landing-card-bg-hover)] hover:text-[var(--landing-text)]"
                  >
                    {t.nav[key]}
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[var(--landing-accent)] transition-all duration-300 group-hover:w-[calc(100%-12px)]" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="ml-3">{LocaleToggle}</div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {LocaleToggle}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="rounded-md p-1.5 text-[var(--landing-text-muted)] transition-colors hover:bg-[var(--landing-card-bg-hover)] hover:text-[var(--landing-text)]"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </Wrapper>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md md:hidden"
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
                  className="font-[family-name:var(--landing-font-display)] text-2xl font-semibold text-[var(--landing-text)] transition-colors hover:text-[var(--landing-accent)]"
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
