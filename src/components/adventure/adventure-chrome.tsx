'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AdventureCanvas } from '@/components/adventure/adventure-canvas'
import { defaultLocale, dictionaries, locales, type Locale } from '@/i18n/dictionaries'

function resolveLocale(param: string | null): Locale {
  return locales.includes(param as Locale) ? (param as Locale) : defaultLocale
}

export function AdventureChrome() {
  const searchParams = useSearchParams()
  const locale = resolveLocale(searchParams.get('locale'))
  const t = dictionaries[locale].adventure
  const homeHref = locale === defaultLocale ? '/' : `/?locale=${locale}`

  return (
    <div className="adventure-page">
      <AdventureCanvas />
      <header className="adventure-hud">
        <Link href={homeHref} className="adventure-hud-back">
          ← {t.back}
        </Link>
        <div className="adventure-hud-title">
          <span className="adventure-hud-kicker">{t.kicker}</span>
          <h1>{t.title}</h1>
        </div>
        <p className="adventure-hud-hint">{t.controls}</p>
        <p className="adventure-hud-credit">{t.credit}</p>
      </header>
    </div>
  )
}
