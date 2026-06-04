'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLocale } from '@/i18n/locale-context'

type AudienceToggleProps = {
  className?: string
  /** Pin to bottom center (Sinas-style), visible while scrolling */
  sticky?: boolean
}

export function AudienceToggle({ className, sticky = false }: AudienceToggleProps) {
  const pathname = usePathname()
  const { locale, t } = useLocale()
  const isMachine = pathname.startsWith('/machine')
  const localeQuery = `?locale=${locale}`

  return (
    <nav
      aria-label={t.audience.label}
      className={cn(
        'portfolio-audience-toggle',
        sticky && 'portfolio-audience-toggle--sticky',
        className,
      )}
    >
      <Link
        href={`/${localeQuery}`}
        className={cn(!isMachine && 'is-active')}
        aria-current={!isMachine ? 'page' : undefined}
      >
        {t.audience.human}
      </Link>
      <Link
        href={`/machine${localeQuery}`}
        className={cn(isMachine && 'is-active')}
        aria-current={isMachine ? 'page' : undefined}
      >
        {t.audience.machine}
      </Link>
    </nav>
  )
}
