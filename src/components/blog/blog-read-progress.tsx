'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type BlogReadProgressProps = {
  articleId: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function BlogReadProgress({ articleId }: BlogReadProgressProps) {
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const article = document.getElementById(articleId)
    if (!article) return

    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--landing-nav-h',
      ) || '72',
      10,
    )

    const update = () => {
      const rect = article.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleHeight = article.offsetHeight
      const viewport = window.innerHeight
      const scrollable = articleHeight - (viewport - navHeight)

      if (scrollable <= 0) {
        setProgress(rect.top <= navHeight ? 1 : 0)
        return
      }

      const scrolled = window.scrollY + navHeight - articleTop
      setProgress(clamp(scrolled / scrollable, 0, 1))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [articleId])

  return (
    <div
      className="portfolio-blog-read-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <motion.div
        className="portfolio-blog-read-progress-bar"
        initial={false}
        animate={{ scaleX: progress }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.12, ease: 'easeOut' }
        }
      />
    </div>
  )
}
