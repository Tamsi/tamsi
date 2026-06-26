'use client'

import { Github, Linkedin, GitlabIcon, ArrowUpRight } from 'lucide-react'
import { CursorIcon } from '@/components/ui/cursor-icon'
import { CURSOR_PROFILE_URL, EMAIL } from '@/data/site-links'
import { motion } from 'motion/react'
import {
  ScrollGroup,
  ScrollItem,
  ScrollReveal,
  ScrollScrub,
} from '@/components/ui/homepage-scroll'
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
        <ScrollScrub>
          <SectionLabel>{t.contact.sectionBadge}</SectionLabel>
          <h2 className="portfolio-heading-lg mb-4">{t.contact.title}</h2>
          <p className="portfolio-body mb-10">{t.contact.subtitle}</p>
        </ScrollScrub>

        <ScrollReveal>
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

          <ScrollGroup className="flex flex-wrap justify-center gap-2">
            {links.map(({ label, href, icon: Icon }) => (
              <ScrollItem key={label}>
                <MotionLink
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-btn-outline gap-2 px-4 py-2 text-sm"
                >
                  <Icon className="size-4" />
                  {label}
                </MotionLink>
              </ScrollItem>
            ))}
          </ScrollGroup>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-16 text-xs text-[var(--landing-text-muted)]/60">
            {t.contact.copyright.replace('{year}', String(new Date().getFullYear()))}
          </p>
        </ScrollReveal>
      </div>
    </footer>
  )
}
