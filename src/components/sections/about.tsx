'use client'

import { MapPin, GraduationCap, Briefcase } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/reveal'
import { SectionLabel } from '@/components/ui/section-label'
import { useLocale } from '@/i18n/locale-context'
import type { BioSegment } from '@/i18n/dictionaries'
import { springSnappy } from '@/lib/motion'

function renderBio(segments: readonly BioSegment[]) {
  return segments.map((segment, i) =>
    segment.highlight ? (
      <strong key={i} className="text-[var(--landing-text)]">
        {segment.text}
      </strong>
    ) : (
      <span key={i}>{segment.text}</span>
    ),
  )
}

export function About() {
  const { t } = useLocale()

  return (
    <section
      id="about"
      className="portfolio-section border-t border-[var(--landing-border-subtle)]"
    >
      <div className="portfolio-container max-w-3xl">
        <Reveal variant="fade-up-blur">
          <div className="mb-12 text-center">
            <SectionLabel>{t.about.sectionBadge}</SectionLabel>
            <h2 className="portfolio-heading-lg">{t.about.title}</h2>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <blockquote className="portfolio-quote mb-14">
            <p className="text-lg italic text-[var(--landing-text-muted)] sm:text-xl">
              {t.about.quote}
            </p>
            <footer className="mt-3 text-sm text-[var(--landing-text-muted)]/70">
              — {t.about.quoteAuthor}
            </footer>
          </blockquote>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mb-14">
            <SectionLabel>{t.about.focusTitle}</SectionLabel>
            <p className="portfolio-body-sm mb-8 max-w-xl">{t.about.focusSubtitle}</p>
            <StaggerContainer stagger={0.1} className="portfolio-focus-grid">
              {t.about.focusItems.map((item) => (
                <StaggerItem key={item.title} variant="fade-up">
                  <article className="portfolio-focus-item text-left">
                    <h3 className="portfolio-heading-md mb-2 text-base text-[var(--landing-text)]">
                      {item.title}
                    </h3>
                    <p className="portfolio-body-sm leading-relaxed">{item.description}</p>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Reveal>

        <Reveal variant="fade-up-blur" delay={0.2}>
          <div className="space-y-5 text-[var(--landing-text-muted)]">
            <p className="text-base leading-relaxed sm:text-lg">
              {renderBio(t.about.bio1)}
            </p>
            <p className="text-base leading-relaxed sm:text-lg">
              {renderBio(t.about.bio2)}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-[var(--landing-accent)]" />
                {t.about.location}
              </span>
              <motion.a
                href={t.about.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                transition={springSnappy}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--landing-accent)]"
              >
                <Briefcase className="size-4 text-[var(--landing-accent)]" />
                {t.about.company}
              </motion.a>
              <motion.a
                href={t.about.schoolUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                transition={springSnappy}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--landing-accent)]"
              >
                <GraduationCap className="size-4 text-[var(--landing-accent)]" />
                {t.about.school}
              </motion.a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-10 text-sm text-[var(--landing-text-muted)]">
            <span className="font-medium uppercase tracking-wider text-[var(--landing-text-muted)]/70">
              {t.about.languagesTitle}
            </span>
            <span className="mx-2 text-[var(--landing-border-subtle)]">—</span>
            {t.about.languages
              .map(({ name, level }) => `${name} (${level})`)
              .join(' · ')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
