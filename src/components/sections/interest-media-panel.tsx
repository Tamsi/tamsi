'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import type { InterestMedia } from '@/data/interests-media'
import { springSnappy } from '@/lib/motion'

type InterestMediaPanelProps = {
  media: InterestMedia
  reversed?: boolean
}

export function InterestMediaPanel({ media, reversed = false }: InterestMediaPanelProps) {
  const reduced = useReducedMotion()
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: '80px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    if (inView) {
      void video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [inView, reduced])

  const showVideo = !reduced && inView

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
      className={reversed ? 'lg:order-1' : 'lg:order-2'}
    >
      <div className="portfolio-interest-media">
        {showVideo ? (
          <video
            ref={videoRef}
            className="portfolio-interest-video"
            src={media.video}
            poster={media.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback"
            aria-label={media.imageAlt}
          />
        ) : (
          <Image
            src={media.image}
            alt={media.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="portfolio-interest-img"
          />
        )}
      </div>

      <motion.a
        href={media.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ x: 3 }}
        transition={springSnappy}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--landing-accent)] hover:underline"
      >
        {media.linkLabel}
        <ExternalLink className="size-3" />
      </motion.a>
    </motion.div>
  )
}
