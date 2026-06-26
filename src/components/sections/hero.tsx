'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Github, Linkedin, GitlabIcon } from 'lucide-react'
import { HuggingFaceIcon } from '@/components/ui/hugging-face-icon'
import { CursorIcon } from '@/components/ui/cursor-icon'
import { CURSOR_PROFILE_URL } from '@/data/site-links'
import {
  MotionButton,
  MotionLink,
} from '@/components/ui/motion-primitives'
import { useLocale } from '@/i18n/locale-context'
import { easeOut, staggerContainer } from '@/lib/motion'

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/tamsi-besson-71228a14b/',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Tamsi',
    icon: Github,
  },
  {
    label: 'GitLab',
    href: 'https://gitlab.com/Tamsi',
    icon: GitlabIcon,
  },
  {
    label: 'Hugging Face',
    href: 'https://huggingface.co/ImTamsi',
    icon: HuggingFaceIcon,
  },
  {
    label: 'Cursor',
    href: CURSOR_PROFILE_URL,
    icon: CursorIcon,
  },
] as const

const heroItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: easeOut },
  },
}

export function Hero() {
  const { t } = useLocale()
  const reduced = useReducedMotion()

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 72,
      behavior: 'smooth',
    })
  }

  const content = (
    <>
      <motion.div variants={heroItem} className="portfolio-badge">
        <motion.span
          className="portfolio-badge-new"
          animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t.hero.badgeNew}
        </motion.span>
        {t.hero.badge}
      </motion.div>

      <motion.h1
        variants={heroItem}
        className="portfolio-heading-xl mx-auto max-w-[900px]"
      >
        {t.hero.title}
        <br />
        <span className="portfolio-text-accent">{t.hero.titleAccent}</span>
      </motion.h1>

      <motion.p variants={heroItem} className="portfolio-body mx-auto max-w-[640px]">
        {t.hero.subtitle}
      </motion.p>

      <motion.div
        variants={heroItem}
        className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
      >
        <MotionButton variant="primary" onClick={() => scrollTo('#projects')}>
          {t.hero.ctaPrimary}
          <motion.span
            animate={reduced ? undefined : { x: [0, 3, 0], y: [0, -3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowUpRight className="size-4" />
          </motion.span>
        </MotionButton>
        <MotionButton variant="outline" onClick={() => scrollTo('#contact')}>
          {t.hero.ctaSecondary}
        </MotionButton>
      </motion.div>

      <motion.div
        variants={heroItem}
        className="mt-4 flex flex-wrap justify-center gap-2"
      >
        {socials.map(({ label, href, icon: Icon }, i) => (
          <MotionLink
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-btn-outline gap-2 px-4 py-2 text-sm"
            aria-label={label}
            initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.06, duration: 0.4, ease: easeOut }}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </MotionLink>
        ))}
      </motion.div>
    </>
  )

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:px-10 md:pt-40"
    >
      {reduced ? (
        <div className="portfolio-container relative z-10 flex flex-col items-center gap-6">
          {content}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.15)}
          className="portfolio-container relative z-10 flex flex-col items-center gap-6"
        >
          {content}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <a href="#about" aria-label="Scroll to about section">
          <motion.div
            animate={reduced ? undefined : { y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-10 w-6 rounded-full border-2 border-[var(--landing-border-subtle)] p-1"
          >
            <motion.div
              animate={reduced ? undefined : { opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="mx-auto h-2 w-1 rounded-full bg-[var(--landing-text-muted)]"
            />
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}
