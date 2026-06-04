'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { locales, type Locale } from '@/i18n/dictionaries'
import { useLocale } from '@/i18n/locale-context'

/** Applies ?locale= from Human ↔ Machine links to the shared locale context. */
export function SyncLocaleFromUrl() {
  const searchParams = useSearchParams()
  const { setLocale } = useLocale()

  useEffect(() => {
    const param = searchParams.get('locale') as Locale | null
    if (param && locales.includes(param)) setLocale(param)
  }, [searchParams, setLocale])

  return null
}
