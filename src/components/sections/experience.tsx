'use client'

import { Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/reveal'
import { SectionLabel } from '@/components/ui/section-label'
import { useLocale } from '@/i18n/locale-context'
import { springBouncy, springSnappy } from '@/lib/motion'
import { type ComponentType, type SVGProps } from 'react'

const itemsMeta: {
  orgUrl: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  certificateUrl?: string
}[] = [
  {
    orgUrl: 'https://www.linkedin.com/company/livingcolor',
    icon: Briefcase,
  },
  {
    orgUrl: 'https://huggingface.co/ImTamsi',
    icon: Award,
  },
  {
    orgUrl: 'https://www.coursera.org/account/accomplishments/specialization/IVNLIOO6YYHM',
    icon: Award,
    certificateUrl: '/coursera.pdf',
  },
  {
    orgUrl: 'https://42.fr/',
    icon: GraduationCap,
  },
]

export function Experience() {
  const { t } = useLocale()

  return (
    <section
      id="experience"
      className="portfolio-section border-t border-[var(--landing-border-subtle)]"
    >
      <div className="portfolio-container max-w-3xl">
        <Reveal variant="fade-up-blur">
          <div className="mb-14 text-center sm:text-left">
            <SectionLabel>{t.experience.sectionBadge}</SectionLabel>
            <h2 className="portfolio-heading-lg">{t.experience.title}</h2>
          </div>
        </Reveal>

        <div className="relative">
          <motion.div
            aria-hidden
            className="absolute top-0 left-[7px] h-full w-px origin-top bg-gradient-to-b from-[var(--landing-accent)]/60 via-[var(--landing-border-subtle)] to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          />

          <div className="space-y-14">
            {t.experience.items.map((item, i) => {
              const meta = itemsMeta[i]
              const Icon = meta.icon

              return (
                <Reveal key={item.title} variant="fade-up" delay={i * 0.06}>
                  <div className="relative pl-10 sm:pl-12">
                    <motion.div
                      className="absolute top-1 left-0 flex size-4 items-center justify-center rounded-full border border-[var(--landing-accent)] bg-black"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={springBouncy}
                    >
                      <Icon className="size-2.5 text-[var(--landing-accent)]" />
                    </motion.div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="font-medium text-[var(--landing-text)]">
                        {item.title}
                      </h3>
                      <span className="text-xs tabular-nums text-[var(--landing-text-muted)]">
                        {item.period}
                      </span>
                    </div>

                    <p className="mt-1 text-sm">
                      <a
                        href={meta.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--landing-accent)] hover:underline"
                      >
                        {item.org}
                      </a>
                      <span className="text-[var(--landing-text-muted)]">
                        {' '}
                        · {item.location}
                      </span>
                    </p>

                    <p className="portfolio-body-sm mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    {meta.certificateUrl && (
                      <motion.a
                        href={meta.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 3 }}
                        transition={springSnappy}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--landing-accent)] hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        {t.experience.viewCertificate}
                      </motion.a>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
