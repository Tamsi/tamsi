'use client'

import { Github, Linkedin, GitlabIcon, ArrowUpRight } from 'lucide-react'
import { CursorIcon } from '@/components/ui/cursor-icon'
import { CURSOR_PROFILE_URL, EMAIL } from '@/data/site-links'
import { motion } from 'motion/react'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/reveal'
import { SectionLabel } from '@/components/ui/section-label'
import { HuggingFaceIcon } from '@/components/ui/hugging-face-icon'
import {
  FloatingGlow,
  MotionButton,
  MotionLink,
} from '@/components/ui/motion-primitives'
import { useLocale } from '@/i18n/locale-context'
import { springSnappy } from '@/lib/motion'

const links = [
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

export function Contact() {
  const { t } = useLocale()

  return (
    <footer
      id="contact"
      className="portfolio-section relative overflow-hidden border-t border-[var(--landing-border-subtle)]"
    >
      <FloatingGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="portfolio-container relative z-10 max-w-xl text-center">
        <Reveal variant="fade-up-blur">
          <SectionLabel>{t.contact.sectionBadge}</SectionLabel>
          <motion.h2
            className="portfolio-heading-lg mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t.contact.title}
          </motion.h2>
          <p className="portfolio-body mb-10">{t.contact.subtitle}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <MotionButton
            variant="primary"
            className="mb-8 inline-flex"
            onClick={() => {
              window.location.href = `mailto:${EMAIL}`
            }}
          >
            {EMAIL}
            <motion.span
              whileHover={{ rotate: 45 }}
              transition={springSnappy}
            >
              <ArrowUpRight className="size-4" />
            </motion.span>
          </MotionButton>

          <StaggerContainer stagger={0.07} className="flex flex-wrap justify-center gap-2">
            {links.map(({ label, href, icon: Icon }) => (
              <StaggerItem key={label} variant="scale-in" spring>
                <MotionLink
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-btn-outline gap-2 px-4 py-2 text-sm"
                >
                  <Icon className="size-4" />
                  {label}
                </MotionLink>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Reveal>

        <Reveal delay={0.3}>
          <motion.p
            className="mt-16 text-xs text-[var(--landing-text-muted)]/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {t.contact.copyright.replace('{year}', String(new Date().getFullYear()))}
          </motion.p>
        </Reveal>
      </div>
    </footer>
  )
}
