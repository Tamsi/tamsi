import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="portfolio-section pt-[calc(var(--landing-nav-h)+2rem)]"
    >
      <div className="portfolio-container max-w-xl text-center">
        <p className="portfolio-section-label">404</p>
        <h1 className="portfolio-heading-lg">Page introuvable</h1>
        <p className="portfolio-body mt-3">Page not found.</p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-[var(--landing-accent)] hover:underline"
        >
          tamsi.dev
        </Link>
      </div>
    </main>
  )
}
