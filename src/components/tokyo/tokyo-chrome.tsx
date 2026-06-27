'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { TokyoGameCanvas } from '@/components/tokyo/tokyo-game-canvas'
import { defaultLocale, dictionaries, locales, type Locale } from '@/i18n/dictionaries'

function resolveLocale(param: string | null): Locale {
  return locales.includes(param as Locale) ? (param as Locale) : defaultLocale
}

export function TokyoChrome() {
  const searchParams = useSearchParams()
  const locale = resolveLocale(searchParams.get('locale'))
  const t = dictionaries[locale].tokyo
  const homeHref = locale === defaultLocale ? '/' : `/?locale=${locale}`
  const [playing, setPlaying] = useState(false)
  const onModeChange = useCallback((mode: 'overview' | 'playing') => {
    setPlaying(mode === 'playing')
  }, [])

  return (
    <div className="tokyo-page">
      <TokyoGameCanvas onModeChange={onModeChange} />
      <header className="tokyo-hud">
        <Link href={homeHref} className="tokyo-hud-back">
          ← {t.back}
        </Link>
        <div className="tokyo-hud-title">
          <span className="tokyo-hud-kicker">{t.kicker}</span>
          <h1>{t.title}</h1>
        </div>
        <p className="tokyo-hud-hint">
          {playing ? t.controls : t.enterPrompt}
        </p>
        {!playing && (
          <p className="tokyo-hud-enter" aria-hidden="true">
            ↵ Enter
          </p>
        )}
        <p className="tokyo-hud-credit">
          <a
            href="https://github.com/mrdoob/three.js/blob/master/examples/models/gltf/LittlestTokyo.glb"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.credit}
          </a>
        </p>
      </header>
    </div>
  )
}
