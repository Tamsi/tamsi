import type { Metadata } from 'next'
import { Navbar } from '@/components/sections/navbar'
import { BlogListing } from '@/components/blog/blog-listing'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/seo/json-ld'
import { getServerLocale } from '@/i18n/locale.server'
import { buildBlogListingMetadata, buildBlogListingJsonLd } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  return buildBlogListingMetadata(locale)
}

export default async function BlogPage() {
  const locale = await getServerLocale()

  return (
    <>
      <JsonLd data={buildBlogListingJsonLd(locale)} />
      <Navbar />
      <main className="relative">
        <BlogListing />
        <Contact />
      </main>
    </>
  )
}
