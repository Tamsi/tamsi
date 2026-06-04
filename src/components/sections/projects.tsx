'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { StaggerContainer, StaggerItem } from '@/components/ui/reveal'
import { SectionLabel } from '@/components/ui/section-label'
import { HuggingFaceIcon } from '@/components/ui/hugging-face-icon'
import { useLocale } from '@/i18n/locale-context'
import type { ProjectItem } from '@/i18n/dictionaries'
import { Github, GitlabIcon } from 'lucide-react'
import { springSnappy } from '@/lib/motion'

function SourceIcon({ source }: { source: ProjectItem['source'] }) {
  if (source === 'huggingface') return <HuggingFaceIcon className="size-4 shrink-0" />
  if (source === 'gitlab') return <GitlabIcon className="size-4 shrink-0" />
  return <Github className="size-4 shrink-0" />
}

const DEMO_URLS: Record<string, string> = {
  'ai-code-reviewer-mcp': 'https://huggingface.co/spaces/ImTamsi/ai-code-reviewer',
  'dream-defender': 'https://dream-defender.vercel.app',
}

export function Projects() {
  const { t } = useLocale()

  return (
    <section
      id="projects"
      className="portfolio-section border-t border-[var(--landing-border-subtle)]"
    >
      <StaggerContainer stagger={0.06} className="portfolio-container max-w-3xl">
        <StaggerItem variant="fade-up-blur">
          <div className="mb-10 text-center sm:text-left">
            <SectionLabel>{t.projects.sectionBadge}</SectionLabel>
            <h2 className="portfolio-heading-lg">{t.projects.title}</h2>
            <p className="portfolio-body mt-3">{t.projects.sectionSubtitle}</p>
          </div>
        </StaggerItem>

        <StaggerItem variant="fade-up">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--landing-accent)]">
            {t.projects.featuredLabel}
          </p>
        </StaggerItem>

        <div>
          {t.projects.items.map((project, index) => (
            <StaggerItem key={project.title} variant="fade-up">
              <ProjectEntry project={project} index={index} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  )
}

function ProjectEntry({
  project,
  index,
}: {
  project: ProjectItem
  index: number
}) {
  const demoUrl = DEMO_URLS[project.title]

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.04, ...springSnappy }}
      className="border-b border-[var(--landing-border-subtle)] py-7 first:border-t"
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-2 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-2">
          <SourceIcon source={project.source} />
          <span className="portfolio-entry-title truncate">{project.title}</span>
          <ArrowUpRight className="size-4 shrink-0 text-[var(--landing-text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <span className="portfolio-entry-meta">{project.language}</span>
      </a>
      <p className="portfolio-body-sm max-w-2xl leading-relaxed">
        {project.description}
      </p>
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-medium text-[var(--landing-accent)] hover:underline"
        >
          Live demo →
        </a>
      )}
    </motion.article>
  )
}
