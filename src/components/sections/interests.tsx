'use client'

import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/reveal'
import { SectionLabel } from '@/components/ui/section-label'
import { InterestMediaPanel } from '@/components/sections/interest-media-panel'
import { interestMediaById } from '@/data/interests-media'
import { useLocale } from '@/i18n/locale-context'
import { springSnappy } from '@/lib/motion'

export function Interests() {
  const { t } = useLocale()

  return (
    <section
      id="interests"
      className="portfolio-section border-t border-[var(--landing-border-subtle)]"
    >
      <div className="portfolio-container max-w-5xl">
        <Reveal variant="fade-up-blur">
          <div className="mb-16 text-center">
            <SectionLabel>{t.interests.sectionBadge}</SectionLabel>
            <h2 className="portfolio-heading-lg">{t.interests.title}</h2>
            <p className="portfolio-body mx-auto mt-3 max-w-2xl">
              {t.interests.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-24 lg:gap-28">
          {t.interests.groups.map((group, index) => {
            const media = interestMediaById[group.id]
            if (!media) return null
            const reversed = index % 2 === 1

            return (
              <motion.article
                key={group.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ delay: 0.05, ...springSnappy }}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              >
                <div className={reversed ? 'lg:order-2' : 'lg:order-1'}>
                  <motion.h3
                    className="portfolio-heading-md mb-3 text-[var(--landing-text)]"
                    initial={{ opacity: 0, x: reversed ? 12 : -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {group.title}
                  </motion.h3>
                  <p className="portfolio-body-sm mb-5 max-w-lg leading-relaxed">
                    {group.description}
                  </p>
                  <div className="portfolio-stack-skills">
                    {group.items.map((item, itemIndex) => (
                      <span key={item} className="inline-flex items-center">
                        {itemIndex > 0 && (
                          <span className="portfolio-stack-sep" aria-hidden>
                            /
                          </span>
                        )}
                        <span className="portfolio-stack-skill">{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <InterestMediaPanel media={media} reversed={reversed} />
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
