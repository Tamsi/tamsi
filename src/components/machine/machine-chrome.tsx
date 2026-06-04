'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { locales, type Locale } from '@/i18n/dictionaries'
import { useLocale } from '@/i18n/locale-context'
export function MachineChrome({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useLocale()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (next: Locale) => {
    setLocale(next)
    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', next)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="portfolio-machine-page">
      <header className="portfolio-machine-header">
        <Link href={`/machine?locale=${locale}`} className="portfolio-machine-brand">
          TAMSI
        </Link>
        <div className="portfolio-machine-controls">
          <div className="portfolio-machine-locale" role="group" aria-label="Language">
            {locales.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                className={cn(locale === loc && 'is-active')}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="portfolio-machine-shell">{children}</div>

      <p className="sr-only">{t.audience.machineHint}</p>
    </div>
  )
}
