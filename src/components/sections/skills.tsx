'use client'

import {
  Code2,
  MonitorSmartphone,
  Server,
  Wrench,
  Smartphone,
  LayoutTemplate,
} from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/reveal'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/locale-context'

const categories = [
  {
    title: 'Languages',
    icon: Code2,
    skills: ['TypeScript', 'JavaScript', 'Python', 'C / C++', 'PHP'],
  },
  {
    title: 'Frontend',
    icon: MonitorSmartphone,
    skills: ['React', 'Next.js', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    icon: Server,
    skills: ['Node.js', 'Symfony', 'Next.js'],
  },
  {
    title: 'CMS / E-commerce',
    icon: LayoutTemplate,
    skills: ['Drupal', 'WordPress', 'Shopify'],
  },
  {
    title: 'Mobile',
    icon: Smartphone,
    skills: ['React Native', 'Flutter'],
  },
  {
    title: 'Tools',
    icon: Wrench,
    skills: ['Git', 'MCP', 'AI / LLM'],
  },
]

export function Skills() {
  const { t } = useLocale()

  return (
    <section id="skills" className="mx-auto max-w-4xl border-t border-border/40 px-6 py-24 sm:py-32">
      <StaggerContainer className="text-center">
        <StaggerItem>
          <h2 className="mb-16 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.skills.title}
          </h2>
        </StaggerItem>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ title, icon: Icon, skills }) => (
            <StaggerItem key={title}>
              <div className="group rounded-xl border border-border/50 bg-card/60 p-6 text-left transition-colors hover:border-primary/30 hover:bg-card/80">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  )
}
