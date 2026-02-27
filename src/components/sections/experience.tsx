'use client'

import { Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'
import { useLocale } from '@/i18n/locale-context'
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
    orgUrl: 'https://huggingface.co/',
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
    <section id="experience" className="mx-auto max-w-3xl border-t border-border/40 px-6 py-24 sm:py-32">
      <Reveal>
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t.experience.title}
        </h2>
      </Reveal>

      <div className="relative">
        <div
          aria-hidden
          className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-border to-transparent sm:left-6"
        />

        <div className="space-y-12">
          {t.experience.items.map((item, i) => {
            const meta = itemsMeta[i]
            const Icon = meta.icon
            return (
              <Reveal key={item.title} delay={i * 0.12}>
                <div className="group relative pl-14 sm:pl-16">
                  <div className="absolute left-2.5 top-0.5 flex size-5 items-center justify-center rounded-full border border-primary bg-background ring-4 ring-background sm:left-3.5 sm:size-5">
                    <Icon className="size-3 text-primary" />
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card/60 p-5 transition-colors hover:border-primary/30 hover:bg-card/80">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold">{item.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {item.period}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-primary">
                      <a
                        href={meta.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {item.org}
                      </a>
                      <span className="text-muted-foreground">
                        {' '}· {item.location}
                      </span>
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    {meta.certificateUrl && (
                      <a
                        href={meta.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        {t.experience.viewCertificate}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
