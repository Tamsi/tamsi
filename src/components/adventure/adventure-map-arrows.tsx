'use client'

import { getMapDefinition, type MapId } from '@/lib/adventure/maps'

type AdventureMapArrowsProps = {
  mapId: MapId
  tutorialComplete: boolean
  lockedHint: string
  onNavigate: (direction: 'left' | 'right') => void
}

export function AdventureMapArrows({
  mapId,
  tutorialComplete,
  lockedHint,
  onNavigate,
}: AdventureMapArrowsProps) {
  const mapDef = getMapDefinition(mapId)
  const canUse = (target: MapId) =>
    target === 'entrance' || tutorialComplete

  const leftTr = mapDef.transitions.find((t) => t.direction === 'left')
  const rightTr = mapDef.transitions.find((t) => t.direction === 'right')

  if (!leftTr && !rightTr) return null

  return (
    <nav className="adventure-map-arrows" aria-label="Room navigation">
      {leftTr ? (
        <button
          type="button"
          className="adventure-map-arrow adventure-map-arrow--left"
          aria-label="Previous room"
          title={canUse(leftTr.targetMapId) ? undefined : lockedHint}
          disabled={!canUse(leftTr.targetMapId)}
          onClick={() => onNavigate('left')}
        >
          ◀
        </button>
      ) : null}
      {rightTr ? (
        <button
          type="button"
          className="adventure-map-arrow adventure-map-arrow--right"
          aria-label="Next room"
          title={canUse(rightTr.targetMapId) ? undefined : lockedHint}
          disabled={!canUse(rightTr.targetMapId)}
          onClick={() => onNavigate('right')}
        >
          ▶
        </button>
      ) : null}
    </nav>
  )
}
