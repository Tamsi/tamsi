import type { Metadata } from 'next'
import { TokyoChrome } from '@/components/tokyo/tokyo-chrome'
import { JsonLd } from '@/components/seo/json-ld'
import { defaultLocale, locales, type Locale } from '@/i18n/dictionaries'
import { buildPageMetadata, buildStructuredDataGraph } from '@/lib/seo'

type PageProps = {
  searchParams: Promise<{ locale?: string }>
}

async function resolveLocale(localeParam: string | undefined): Promise<Locale> {
  return locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await searchParams
  const locale = await resolveLocale(localeParam)
  return buildPageMetadata(locale, '/tokyo')
}

export default async function TokyoPage({ searchParams }: PageProps) {
  const { locale: localeParam } = await searchParams
  const locale = await resolveLocale(localeParam)

  return (
    <>
      <JsonLd data={buildStructuredDataGraph(locale, '/tokyo')} />
      <TokyoChrome />
    </>
  )
}
