import type { Metadata } from 'next'
import { AdventureChrome } from '@/components/adventure/adventure-chrome'
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
  return buildPageMetadata(locale, '/adventure')
}

export default async function AdventurePage({ searchParams }: PageProps) {
  const { locale: localeParam } = await searchParams
  const locale = await resolveLocale(localeParam)

  return (
    <>
      <JsonLd data={buildStructuredDataGraph(locale, '/adventure')} />
      <AdventureChrome />
    </>
  )
}
