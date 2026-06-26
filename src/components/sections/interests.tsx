'use client'

import {
  ScrollGroup,
  ScrollItem,
  ScrollReveal,
  ScrollScrub,
} from '@/components/ui/homepage-scroll'
import { SectionLabel } from '@/components/ui/section-label'
import { InterestMediaPanel } from '@/components/sections/interest-media-panel'
import { interestMediaById } from '@/data/interests-media'
import { useLocale } from '@/i18n/locale-context'

export function Interests() {
  const { t } = useLocale()

  return (
    <section
      id="interests"
      className="portfolio-section border-t border-[var(--landing-border-subtle)]"
    >
      <div className="portfolio-container max-w-5xl">
        <ScrollScrub>
          <div className="mb-16 text-center">
            <SectionLabel>{t.interests.sectionBadge}</SectionLabel>
            <h2 className="portfolio-heading-lg">{t.interests.title}</h2>
            <p className="portfolio-body mx-auto mt-3 max-w-2xl">
              {t.interests.subtitle}
            </p>
          </div>
        </ScrollScrub>

        <div className="flex flex-col gap-24 lg:gap-28">
          {t.interests.groups.map((group, index) => {
            const media = interestMediaById[group.id]
            if (!media) return null
            const reversed = index % 2 === 1

            return (
              <ScrollReveal key={group.id}>
                <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                  <div className={reversed ? 'lg:order-2' : 'lg:order-1'}>
                    <h3 className="portfolio-heading-md mb-3 text-[var(--landing-text)]">
                      {group.title}
                    </h3>
                    <p className="portfolio-body-sm mb-5 max-w-lg leading-relaxed">
                      {group.description}
                    </p>
                    <ScrollGroup className="portfolio-stack-skills">
                      {group.items.map((item, itemIndex) => (
                        <ScrollItem key={item} className="inline-flex items-center">
                          {itemIndex > 0 && (
                            <span className="portfolio-stack-sep" aria-hidden>
                              /
                            </span>
                          )}
                          <span className="portfolio-stack-skill">{item}</span>
                        </ScrollItem>
                      ))}
                    </ScrollGroup>
                  </div>

                  <div data-scroll-parallax className={reversed ? 'lg:order-1' : 'lg:order-2'}>
                    <InterestMediaPanel media={media} reversed={reversed} />
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
