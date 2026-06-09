'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { BlogCoverId } from '@/content/blog/types'
import { cn } from '@/lib/utils'

type BlogIllustrationProps = {
  id: BlogCoverId
  alt: string
  className?: string
  variant?: 'inline'
}

function QwenAwsIllustration() {
  return (
    <svg viewBox="0 0 400 220" fill="none" aria-hidden className="h-full w-full">
      <defs>
        <linearGradient id="blog-qwen-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#814ac8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1a1030" stopOpacity="0.9" />
        </linearGradient>
        <filter id="blog-qwen-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="400" height="220" fill="url(#blog-qwen-bg)" rx="12" />
      {/* AWS cloud / server */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M248 72c-8 0-14-6-18-10-4 8-14 14-26 14-16 0-28-12-28-28 0-2 0-4 .5-6-10 4-16 14-16 26 0 16 12 28 28 28 10 0 18-4 24-12 4 2 8 4 14 4 18 0 32-14 32-32 0-14-10-26-24-30 2 12 12 22 26 22 14 0 26-10 28-24z"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(129,74,200,0.6)"
          strokeWidth="1.5"
        />
        <rect x="218" y="88" width="64" height="48" rx="6" fill="rgba(0,0,0,0.4)" stroke="#814ac8" strokeWidth="1.5" />
        <text x="250" y="118" textAnchor="middle" fill="#b794f4" fontSize="11" fontFamily="ui-monospace, monospace">vLLM</text>
        <rect x="228" y="124" width="44" height="6" rx="2" fill="#814ac8" opacity="0.8" />
      </motion.g>
      {/* GPU chip */}
      <motion.rect
        x="232" y="142" width="36" height="36" rx="4"
        fill="rgba(129,74,200,0.25)" stroke="#9360d4" strokeWidth="1"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      {/* Laptop / Cursor */}
      <g transform="translate(48, 100)">
        <rect x="0" y="0" width="88" height="56" rx="4" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="8" y="8" width="72" height="40" rx="2" fill="rgba(129,74,200,0.15)" />
        <text x="44" y="32" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="ui-sans-serif">Cursor</text>
        <path d="M-8 56 H96 L88 68 H0 Z" fill="rgba(255,255,255,0.08)" />
      </g>
      {/* Ollama local (small) */}
      <g transform="translate(48, 36)">
        <circle cx="20" cy="20" r="18" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <text x="20" y="24" textAnchor="middle" fill="#a3a3a3" fontSize="8" fontFamily="ui-monospace">local</text>
      </g>
      {/* Connection lines */}
      <motion.path
        d="M136 128 H210"
        stroke="#814ac8"
        strokeWidth="2"
        strokeDasharray="6 4"
        filter="url(#blog-qwen-glow)"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      <motion.path
        d="M68 54 L68 100"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ strokeDashoffset: [0, -16] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <text x="152" y="118" fill="#814ac8" fontSize="9" fontFamily="ui-monospace">Qwen 27B</text>
      <text x="48" y="28" fill="#666" fontSize="8" fontFamily="ui-sans-serif">git-mentor · Ollama</text>
    </svg>
  )
}

function RedbeeMcpIllustration() {
  return (
    <svg viewBox="0 0 400 220" fill="none" aria-hidden className="h-full w-full">
      <defs>
        <linearGradient id="blog-redbee-bg" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a1628" stopOpacity="1" />
          <stop offset="100%" stopColor="#814ac8" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#blog-redbee-bg)" rx="12" />
      {/* IDE node */}
      <rect x="32" y="80" width="72" height="60" rx="6" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <text x="68" y="115" textAnchor="middle" fill="#fff" fontSize="10">IDE</text>
      {/* MCP hub */}
      <motion.g
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: '200px 110px' }}
      >
        <circle cx="200" cy="110" r="36" fill="rgba(129,74,200,0.2)" stroke="#814ac8" strokeWidth="2" />
        <text x="200" y="106" textAnchor="middle" fill="#b794f4" fontSize="11" fontWeight="600">MCP</text>
        <text x="200" y="122" textAnchor="middle" fill="#888" fontSize="8">redbee</text>
      </motion.g>
      {/* API stack */}
      <g transform="translate(288, 68)">
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={i}
            x={0}
            y={i * 28}
            width="80"
            height="22"
            rx="4"
            fill="rgba(129,74,200,0.12)"
            stroke="rgba(129,74,200,0.5)"
            strokeWidth="1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        <text x="40" y="18" textAnchor="middle" fill="#aaa" fontSize="7">catalog</text>
        <text x="40" y="46" textAnchor="middle" fill="#aaa" fontSize="7">playback</text>
        <text x="40" y="74" textAnchor="middle" fill="#aaa" fontSize="7">assets</text>
      </g>
      {/* Animated connectors */}
      <motion.path
        d="M104 110 H164"
        stroke="#814ac8" strokeWidth="2" strokeDasharray="5 5"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.path
        d="M236 110 H288"
        stroke="#814ac8" strokeWidth="2" strokeDasharray="5 5"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      {/* JSON payload dots */}
      <motion.circle cx="180" cy="110" r="4" fill="#814ac8"
        animate={{ cx: [180, 220], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  )
}

function AiCodeReviewerIllustration() {
  return (
    <svg viewBox="0 0 400 220" fill="none" aria-hidden className="h-full w-full">
      <defs>
        <linearGradient id="blog-review-bg" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#814ac8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#050505" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#blog-review-bg)" rx="12" />
      {/* PR / diff panel */}
      <rect x="40" y="48" width="160" height="124" rx="8" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <text x="56" y="72" fill="#888" fontSize="9" fontFamily="ui-monospace">diff — src/review.ts</text>
      <rect x="56" y="82" width="100" height="6" rx="1" fill="rgba(255,80,80,0.4)" />
      <rect x="56" y="94" width="128" height="6" rx="1" fill="rgba(80,200,120,0.35)" />
      <rect x="56" y="106" width="88" height="6" rx="1" fill="rgba(80,200,120,0.35)" />
      <rect x="56" y="118" width="112" height="6" rx="1" fill="rgba(255,255,255,0.08)" />
      {/* GitHub-ish mark */}
      <circle cx="320" cy="72" r="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <path d="M320 58c-8 0-14 6-14 14 0 6 4 11 9 13 1 0 1-1 1-2v-4c-3 1-4-1-4-1-1-2-2-3-4-3 3-2 6-1 7 0 2 2 2 5 2 5v6c0 1 0 2 1 2 5-2 9-7 9-13 0-8-6-14-14-14z" fill="#a3a3a3" />
      {/* MCP + LLM */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="248" y="118" width="104" height="54" rx="6" fill="rgba(129,74,200,0.15)" stroke="#814ac8" strokeWidth="1.5" />
        <text x="300" y="142" textAnchor="middle" fill="#b794f4" fontSize="10">MCP review</text>
        <text x="300" y="158" textAnchor="middle" fill="#666" fontSize="8">bug · sec · tests</text>
      </motion.g>
      {/* Scan line */}
      <motion.rect
        x="56" y="82" width="128" height="40" rx="2"
        fill="url(#blog-review-bg)" opacity="0.3"
        animate={{ y: [82, 130, 82] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M200 110 H248"
        stroke="#814ac8" strokeWidth="2" strokeDasharray="4 4"
        animate={{ strokeDashoffset: [0, -16] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}

const illustrations: Record<BlogCoverId, () => ReactNode> = {
  'qwen-aws': QwenAwsIllustration,
  'redbee-mcp': RedbeeMcpIllustration,
  'ai-code-reviewer': AiCodeReviewerIllustration,
}

export function BlogIllustration({
  id,
  alt,
  className,
  variant = 'inline',
}: BlogIllustrationProps) {
  const reduced = useReducedMotion()
  const Illustration = illustrations[id]

  return (
    <motion.figure
      className={cn('portfolio-blog-cover', 'portfolio-blog-cover--inline', className)}
      initial={reduced ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="portfolio-blog-cover-glow" aria-hidden />
      <Illustration />
      <figcaption className="sr-only">{alt}</figcaption>
    </motion.figure>
  )
}
