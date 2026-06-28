'use client'

import { useEffect } from 'react'
import type { ScrollDefinition } from '@/lib/adventure/scrolls'

type ScrollMeta = {
  title: string
  excerpt: string
}

type AdventureInventoryProps = {
  open: boolean
  onClose: () => void
  scrollIds: string[]
  scrollMeta: Record<string, ScrollMeta>
  scrollDefs: ScrollDefinition[]
  copy: {
    title: string
    empty: string
    read: string
    close: string
  }
  onReadScroll: (scrollId: string) => void
}

export function AdventureInventory({
  open,
  onClose,
  scrollIds,
  scrollMeta,
  scrollDefs,
  copy,
  onReadScroll,
}: AdventureInventoryProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'i' || e.key === 'I') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const defsById = Object.fromEntries(scrollDefs.map((s) => [s.id, s]))

  return (
    <div className="adventure-quest-overlay" role="presentation" onClick={onClose}>
      <div
        className="adventure-inventory-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adventure-inventory-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="adventure-inventory-panel__header">
          <h2 id="adventure-inventory-title">{copy.title}</h2>
          <button
            type="button"
            className="adventure-quest-panel__close"
            onClick={onClose}
            aria-label={copy.close}
          >
            ×
          </button>
        </header>

        {scrollIds.length === 0 ? (
          <p className="adventure-inventory-panel__empty">{copy.empty}</p>
        ) : (
          <ul className="adventure-inventory-list">
            {scrollIds.map((id) => {
              const meta = scrollMeta[id]
              const def = defsById[id]
              if (!meta) return null
              return (
                <li key={id}>
                  <button
                    type="button"
                    className="adventure-inventory-item"
                    onClick={() => onReadScroll(id)}
                  >
                    <span className="adventure-inventory-item__icon" aria-hidden>
                      📜
                    </span>
                    <span className="adventure-inventory-item__copy">
                      <span className="adventure-inventory-item__title">{meta.title}</span>
                      <span className="adventure-inventory-item__excerpt">
                        {meta.excerpt}
                      </span>
                    </span>
                    <span className="adventure-inventory-item__action">{copy.read}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
