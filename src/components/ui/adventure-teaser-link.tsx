'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { useLocale } from '@/i18n/locale-context'
import { defaultLocale } from '@/i18n/dictionaries'
import { easeOut } from '@/lib/motion'

export function AdventureTeaserLink() {
  const { locale, t } = useLocale()
  const reduced = useReducedMotion()
  const href =
    locale === defaultLocale ? '/adventure' : `/adventure?locale=${locale}`

  return (
    <motion.a
      href={href}
      className="portfolio-adventure-teaser group"
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: 0.95, duration: 0.55, ease: easeOut }}
      whileHover={reduced ? undefined : { y: -3, scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
    >
      <span className="portfolio-adventure-teaser__glow" aria-hidden />
      <span className="portfolio-adventure-teaser__tiles" aria-hidden />

      <span className="portfolio-adventure-teaser__sprite-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/adventure/sprites/character/idle_1_0.png"
          alt=""
          width={48}
          height={60}
          className="portfolio-adventure-teaser__sprite"
          draggable={false}
        />
      </span>

      <span className="portfolio-adventure-teaser__copy">
        <span className="portfolio-adventure-teaser__kicker">
          <Sparkles className="size-3" aria-hidden />
          {t.hero.adventureTeaser.kicker}
        </span>
        <span className="portfolio-adventure-teaser__title">
          {t.hero.adventureTeaser.title}
        </span>
        <span className="portfolio-adventure-teaser__hint">
          {t.hero.adventureTeaser.hint}
        </span>
      </span>

      <span className="portfolio-adventure-teaser__arrow" aria-hidden>
        →
      </span>
    </motion.a>
  )
}
