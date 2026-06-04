import type { Metadata } from 'next'
import { MachineChrome } from '@/components/machine/machine-chrome'
import { MachineDocument } from '@/components/machine/machine-document'
import { JsonLd } from '@/components/seo/json-ld'
import { defaultLocale, locales, type Locale } from '@/i18n/dictionaries'
import { buildPortfolioMachineBlocks } from '@/lib/portfolio-machine'
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
  return buildPageMetadata(locale, '/machine')
}

export default async function MachinePage({ searchParams }: PageProps) {
  const { locale: localeParam } = await searchParams
  const locale = await resolveLocale(localeParam)
  const blocks = buildPortfolioMachineBlocks(locale)

  return (
    <>
      <JsonLd data={buildStructuredDataGraph(locale, '/machine')} />
      <MachineChrome>
        <MachineDocument blocks={blocks} />
      </MachineChrome>
    </>
  )
}
