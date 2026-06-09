'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/i18n/locale-context'

const anchorNavKeys = [
  'about',
  'experience',
  'interests',
  'projects',
  'contact',
] as const

type NavKey = (typeof anchorNavKeys)[number] | 'blog'

const navItems: { key: NavKey; href: string; isPage?: boolean }[] = [
  { key: 'about', href: '/#about' },
  { key: 'experience', href: '/#experience' },
  { key: 'interests', href: '/#interests' },
  { key: 'projects', href: '/#projects' },
  { key: 'blog', href: '/blog', isPage: true },
  { key: 'contact', href: '/#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const pathname = usePathname()
  const { locale, setLocale, t } = useLocale()
  const isHome = pathname === '/'

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

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('/#')) return

      const hash = href.slice(1)
      if (!isHome) return

      e.preventDefault()
      setOpen(false)
      const el = document.querySelector(hash)
      if (!el) return
      setTimeout(() => {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth',
        })
      }, 10)
    },
    [isHome],
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

  const navLinkClass =
    'group relative rounded-md px-3 py-1.5 text-sm text-[var(--landing-text-muted)] transition-colors hover:bg-[var(--landing-card-bg-hover)] hover:text-[var(--landing-text)]'

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
          <Link
            href="/"
            className="font-[family-name:var(--landing-font-display)] text-sm font-semibold tracking-tight text-[var(--landing-text)] transition-colors hover:text-[var(--landing-accent)]"
          >
            Tamsi
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <ul className="flex items-center gap-1">
              {navItems.map(({ key, href, isPage }) => (
                <li key={key}>
                  {isPage ? (
                    <Link
                      href={href}
                      className={cn(
                        navLinkClass,
                        pathname.startsWith(href) &&
                          'text-[var(--landing-text)]',
                      )}
                    >
                      {t.nav[key]}
                      <span
                        className={cn(
                          'absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[var(--landing-accent)] transition-all duration-300',
                          pathname.startsWith(href)
                            ? 'w-[calc(100%-12px)]'
                            : 'w-0 group-hover:w-[calc(100%-12px)]',
                        )}
                      />
                    </Link>
                  ) : (
                    <Link
                      href={href}
                      onClick={(e) => handleAnchorClick(e, href)}
                      className={navLinkClass}
                    >
                      {t.nav[key]}
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[var(--landing-accent)] transition-all duration-300 group-hover:w-[calc(100%-12px)]" />
                    </Link>
                  )}
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
              {navItems.map(({ key, href, isPage }, i) =>
                isPage ? (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="font-[family-name:var(--landing-font-display)] text-2xl font-semibold text-[var(--landing-text)] transition-colors hover:text-[var(--landing-accent)]"
                    >
                      {t.nav[key]}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={href}
                      onClick={(e) => {
                        handleAnchorClick(e, href)
                        setOpen(false)
                      }}
                      className="font-[family-name:var(--landing-font-display)] text-2xl font-semibold text-[var(--landing-text)] transition-colors hover:text-[var(--landing-accent)]"
                    >
                      {t.nav[key]}
                    </Link>
                  </motion.div>
                ),
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
