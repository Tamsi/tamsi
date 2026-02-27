'use client'

import { Github, Linkedin, GitlabIcon, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { HuggingFaceIcon } from '@/components/ui/hugging-face-icon'
import { useLocale } from '@/i18n/locale-context'

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
    label: 'Email',
    href: 'mailto:tamsi.besson@gmail.com',
    icon: Mail,
  },
]

export function Contact() {
  const { t } = useLocale()

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-border/40 px-6 py-24 sm:py-32">
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]"
      />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <Reveal>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.contact.title}
          </h2>
          <p className="mb-10 text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-wrap justify-center gap-3">
            {links.map(({ label, href, icon: Icon }) => (
              <Button
                key={label}
                variant="outline"
                size="lg"
                className="btn-shimmer gap-2"
                asChild
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className="size-5" />
                  {label}
                </a>
              </Button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-16 text-xs text-muted-foreground/50">
            {t.contact.copyright.replace('{year}', String(new Date().getFullYear()))}
          </p>
        </Reveal>
      </div>
    </footer>
  )
}
