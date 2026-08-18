import type { MetadataRoute } from 'next'
import { PERSON_NAME, SITE_NAME } from '@/data/site-links'
import { dictionaries } from '@/i18n/dictionaries'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON_NAME} — ${SITE_NAME}`,
    short_name: SITE_NAME,
    description: dictionaries.fr.meta.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#2563eb',
    lang: 'fr',
    categories: ['portfolio', 'developer', 'technology'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
