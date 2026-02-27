'use client'

import { motion } from 'motion/react'
import { ExternalLink, Github, GitlabIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StaggerContainer, StaggerItem } from '@/components/ui/reveal'
import { useLocale } from '@/i18n/locale-context'

const projectsMeta = [
  {
    title: 'VisualQ',
    language: 'Next.js / TypeScript',
    url: 'https://github.com/abecms/visualq',
    source: 'github' as const,
  },
  {
    title: 'ScoreJamAi',
    language: 'Next.js / TypeScript',
    url: 'https://github.com/abecms/ScoreJamAi',
    source: 'github' as const,
  },
  {
    title: 'redbee-mcp',
    language: 'Python',
    url: 'https://github.com/tamsi/redbee-mcp',
    source: 'github' as const,
  },
  {
    title: '42school',
    language: 'C / C++ / Python',
    url: 'https://github.com/tamsi/42school',
    source: 'github' as const,
  },
  {
    title: 'pin_article',
    language: 'PHP',
    url: 'https://gitlab.com/tamsi/pin_article',
    source: 'gitlab' as const,
  },
  {
    title: 'piscine-42',
    language: 'C',
    url: 'https://github.com/Tamsi/piscine-42/tree/master/to_git',
    source: 'github' as const,
  },
]

function SourceIcon({ source }: { source: 'github' | 'gitlab' }) {
  return source === 'github' ? (
    <Github className="size-4" />
  ) : (
    <GitlabIcon className="size-4" />
  )
}

export function Projects() {
  const { t } = useLocale()

  return (
    <section id="projects" className="mx-auto max-w-4xl border-t border-border/40 px-6 py-24 sm:py-32">
      <StaggerContainer>
        <StaggerItem>
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {t.projects.title}
          </h2>
        </StaggerItem>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projectsMeta.map((project, i) => (
            <StaggerItem key={project.title}>
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group flex h-full flex-col rounded-xl border border-border/50 bg-card/60 p-5 transition-colors hover:border-primary/30 hover:bg-card/80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">{project.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <SourceIcon source={project.source} />
                    <ExternalLink className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>

                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.projects.items[i]?.description}
                </p>

                <Badge variant="outline" className="self-start">
                  {project.language}
                </Badge>
              </motion.a>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  )
}
