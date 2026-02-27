'use client'

import { motion } from 'motion/react'
import { Github, Linkedin, GitlabIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleConstellation } from '@/components/ui/particle-constellation'
import { HuggingFaceIcon } from '@/components/ui/hugging-face-icon'
import { useLocale } from '@/i18n/locale-context'

const socials = [
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
] as const

export function Hero() {
  const { t } = useLocale()

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6"
    >
      <ParticleConstellation />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 text-center"
      >
        <h1 className="animate-gradient-shift bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
          Tamsi Besson
        </h1>

        <p className="text-lg text-muted-foreground sm:text-xl">
          {t.hero.subtitle}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-wrap justify-center gap-3"
        >
          {socials.map(({ label, href, icon: Icon }) => (
            <Button
              key={label}
              variant="outline"
              size="lg"
              className="btn-shimmer gap-2"
              asChild
            >
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon className="size-5" />
                <span className="hidden sm:inline">{label}</span>
              </a>
            </Button>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" aria-label="Scroll to about section">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-10 w-6 rounded-full border-2 border-muted-foreground/40 p-1"
          >
            <div className="mx-auto h-2 w-1 rounded-full bg-muted-foreground/60" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}
