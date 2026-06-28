'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { defaultLocale, type Locale } from '@/i18n/dictionaries'
import { getBlogPost, getBlogPostContent } from '@/lib/blog'
import { scrollById, type ScrollDefinition } from '@/lib/adventure/scrolls'

type TutorialScrollCopy = {
  title: string
  excerpt: string
  paragraphs: readonly string[]
}

type AdventureScrollReaderProps = {
  locale: Locale
  scrollId: string | null
  onClose: () => void
  tutorialScrolls: Record<string, TutorialScrollCopy>
  copy: {
    close: string
    readFull: string
  }
}

function blogPostHref(slug: string, locale: Locale): string {
  if (locale === defaultLocale) return `/blog/${slug}`
  return `/blog/${slug}?locale=${locale}`
}

function findScrollDef(scrollId: string): ScrollDefinition | undefined {
  return scrollById(scrollId)
}

export function AdventureScrollReader({
  locale,
  scrollId,
  onClose,
  tutorialScrolls,
  copy,
}: AdventureScrollReaderProps) {
  useEffect(() => {
    if (!scrollId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scrollId, onClose])

  if (!scrollId) return null

  const def = findScrollDef(scrollId)
  if (!def) return null

  let title = ''
  let paragraphs: string[] = []
  let blogSlug: string | undefined

  if (def.kind === 'tutorial' && def.contentKey) {
    const tuto = tutorialScrolls[def.contentKey]
    if (!tuto) return null
    title = tuto.title
    paragraphs = [...tuto.paragraphs]
  } else if (def.kind === 'blog' && def.blogSlug) {
    const post = getBlogPost(def.blogSlug)
    if (!post) return null
    const content = getBlogPostContent(post, locale)
    title = content.title
    blogSlug = def.blogSlug
    paragraphs = content.blocks
      .filter((b) => b.type === 'paragraph')
      .map((b) => (b.type === 'paragraph' ? b.text : ''))
    if (paragraphs.length === 0) paragraphs = [content.description]
  }

  return (
    <div className="adventure-quest-overlay" role="presentation" onClick={onClose}>
      <div
        className="adventure-scroll-reader"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adventure-scroll-reader__paper">
          <h2>{title}</h2>
          {paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
          {blogSlug ? (
            <Link href={blogPostHref(blogSlug, locale)} className="adventure-scroll-reader__link">
              {copy.readFull}
            </Link>
          ) : null}
        </div>
        <button type="button" className="adventure-quest-panel__btn" onClick={onClose}>
          {copy.close}
        </button>
      </div>
    </div>
  )
}
