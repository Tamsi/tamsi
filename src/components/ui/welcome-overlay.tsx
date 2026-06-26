'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'
import { animate, stagger, createTimeline, remove } from 'animejs'
import { useLocale } from '@/i18n/locale-context'

type Word = { key: string; text: string; accent?: boolean }

const welcomeStoreSubscribe = () => () => {}
const readWelcomePlayed = () => {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem('tamsi-welcome-played') === '1'
  } catch {
    return false
  }
}

/**
 * Full-screen welcome animation shown on first arrival.
 * Builds "Bienvenue chez Tamsi" word by word, then fades out.
 *
 * Renders nothing on the server and until the client has mounted, so the
 * sessionStorage check never runs during SSR and there is no hydration
 * mismatch. The animation plays once per browser session.
 */
export function WelcomeOverlay() {
  const { t } = useLocale()
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const alreadyPlayed = useSyncExternalStore(
    welcomeStoreSubscribe,
    readWelcomePlayed,
    () => false,
  )
  const [done, setDone] = useState(false)

  const words: Word[] = [
    { key: 'line1', text: t.welcome.line1 },
    { key: 'line2', text: t.welcome.line2 },
    { key: 'line3', text: t.welcome.line3, accent: true },
  ]

  useEffect(() => {
    const root = rootRef.current
    if (!root || done || alreadyPlayed) return

    const markPlayed = () => {
      try {
        sessionStorage.setItem('tamsi-welcome-played', '1')
      } catch {
        // ignore
      }
    }

    if (reduced) {
      const fade = animate(root, {
        opacity: [1, 0],
        duration: 500,
        delay: 400,
        ease: 'outQuad',
        onComplete: () => {
          markPlayed()
          setDone(true)
        },
      })
      return () => {
        fade.pause()
      }
    }

    const chars = root.querySelectorAll<HTMLElement>('[data-char]')
    const accent = root.querySelector<HTMLElement>('[data-word-accent]')
    const line = root.querySelector<HTMLElement>('[data-line]')
    const lineAccent = root.querySelector<HTMLElement>('[data-line-accent]')

    const tl = createTimeline({
      defaults: { ease: 'inOut(2)' },
      onComplete: () => {
        markPlayed()
        setDone(true)
      },
    })

    // Build the sentence: characters rise + rotate into place, staggered from the first.
    tl.add(
      chars,
      {
        opacity: [0, 1],
        translateY: ['1.2em', '0em'],
        rotateX: ['-90deg', '0deg'],
        filter: ['blur(8px)', 'blur(0px)'],
        duration: 720,
        delay: stagger(38, { from: 'first' }),
        ease: 'out(4)',
      },
      0,
    )

    // Glow pulse on the accent word ("Tamsi").
    if (accent) {
      tl.add(
        accent,
        {
          textShadow: [
            '0 0 0px rgba(129,74,200,0)',
            '0 0 28px rgba(129,74,200,0.55)',
            '0 0 12px rgba(129,74,200,0.35)',
          ],
          duration: 1200,
        },
        '-=300',
      )
    }

    // Underline builds out under the sentence.
    if (line) {
      tl.add(
        line,
        {
          scaleX: [0, 1],
          opacity: [0, 1],
          duration: 700,
        },
        '-=200',
      )
    }
    if (lineAccent) {
      tl.add(
        lineAccent,
        {
          scaleX: [0, 1],
          opacity: [0, 1],
          duration: 600,
        },
        '-=500',
      )
    }

    // Fade the whole overlay out, then unmount via onComplete above.
    tl.add(
      root,
      {
        opacity: [1, 0],
        filter: ['blur(0px)', 'blur(6px)'],
        duration: 600,
        delay: 350,
      },
      '+=200',
    )

    return () => {
      tl.pause()
      remove(chars)
    }
  }, [done, alreadyPlayed, reduced])

  if (done || alreadyPlayed) return null

  return (
    <div
      ref={rootRef}
      className="portfolio-welcome-overlay"
      aria-hidden="true"
      role="presentation"
    >
      <div className="portfolio-welcome-inner">
        <p className="portfolio-welcome-text">
          {words.map((word, wi) => (
            <span
              key={word.key}
              data-word={word.key}
              data-word-accent={word.accent ? '' : undefined}
              className="portfolio-welcome-word"
              style={{ perspective: '600px' }}
            >
              {Array.from(word.text).map((ch, ci) => (
                <span
                  key={`${wi}-${ci}`}
                  data-char
                  className="portfolio-welcome-char"
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {ch}
                </span>
              ))}
              {wi < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </p>
        <span data-line className="portfolio-welcome-line" />
        <span data-line-accent className="portfolio-welcome-line-accent" />
      </div>
    </div>
  )
}
