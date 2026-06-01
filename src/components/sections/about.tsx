'use client'

import { Quote, MapPin, GraduationCap, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { useLocale } from '@/i18n/locale-context'
import type { BioSegment } from '@/i18n/dictionaries'

function renderBio(segments: readonly BioSegment[]) {
  return segments.map((segment, i) =>
    segment.highlight ? (
      <strong key={i} className="text-foreground">
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
    <section id="about" className="mx-auto max-w-3xl border-t border-border/40 px-6 py-24 sm:py-32">
      <Reveal>
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t.about.title}
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <blockquote className="relative mb-12 rounded-xl border border-border/50 bg-card/60 p-6 sm:p-8">
          <Quote className="absolute -top-3 left-4 size-6 text-primary" />
          <p className="text-lg italic text-muted-foreground sm:text-xl">
            {t.about.quote}
          </p>
          <footer className="mt-3 text-sm text-muted-foreground/70">
            — {t.about.quoteAuthor}
          </footer>
        </blockquote>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-base leading-relaxed sm:text-lg">
            {renderBio(t.about.bio1)}
          </p>
          <p className="text-base leading-relaxed sm:text-lg">
            {renderBio(t.about.bio2)}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="size-4 text-primary" />
              {t.about.location}
            </div>
            <a
              href={t.about.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary"
            >
              <Briefcase className="size-4 text-primary" />
              {t.about.company}
            </a>
            <a
              href={t.about.schoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary"
            >
              <GraduationCap className="size-4 text-primary" />
              {t.about.school}
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
            {t.about.languagesTitle}
          </h3>
          <div className="flex flex-wrap gap-2">
            {t.about.languages.map(({ name, level }) => (
              <Badge key={name} variant="secondary" className="gap-1.5">
                {name}
                <span className="text-muted-foreground">· {level}</span>
              </Badge>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
