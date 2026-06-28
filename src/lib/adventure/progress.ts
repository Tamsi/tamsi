import type { MapId } from '@/lib/adventure/maps'

export type AdventureProgress = {
  introSeen: boolean
  mainQuestAccepted: boolean
  completedQuestIds: string[]
  defeatedEnemyIds: string[]
  currentMapId: MapId
}

const STORAGE_KEY = 'tamsi-adventure-progress'

const DEFAULT_PROGRESS: AdventureProgress = {
  introSeen: false,
  mainQuestAccepted: false,
  completedQuestIds: [],
  defeatedEnemyIds: [],
  currentMapId: 'entrance',
}

function normalizeProgress(parsed: Partial<AdventureProgress>): AdventureProgress {
  return {
    introSeen: Boolean(parsed.introSeen),
    mainQuestAccepted: Boolean(parsed.mainQuestAccepted),
    completedQuestIds: Array.isArray(parsed.completedQuestIds)
      ? parsed.completedQuestIds.filter((id): id is string => typeof id === 'string')
      : [],
    defeatedEnemyIds: Array.isArray(parsed.defeatedEnemyIds)
      ? parsed.defeatedEnemyIds.filter((id): id is string => typeof id === 'string')
      : [],
    currentMapId:
      parsed.currentMapId === 'entrance' ||
      (typeof parsed.currentMapId === 'string' &&
        parsed.currentMapId.startsWith('dungeon-'))
        ? (parsed.currentMapId as MapId)
        : 'entrance',
  }
}

export function readAdventureProgress(): AdventureProgress {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_PROGRESS }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS }
    const parsed = JSON.parse(raw) as Partial<AdventureProgress>
    return normalizeProgress(parsed)
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function writeAdventureProgress(progress: AdventureProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // ignore
  }
}

export function markIntroSeen(): AdventureProgress {
  const next = { ...readAdventureProgress(), introSeen: true }
  writeAdventureProgress(next)
  return next
}

export function acceptMainQuest(): AdventureProgress {
  const next = {
    ...readAdventureProgress(),
    introSeen: true,
    mainQuestAccepted: true,
  }
  writeAdventureProgress(next)
  return next
}

export function completeQuest(questId: string): AdventureProgress {
  const current = readAdventureProgress()
  if (current.completedQuestIds.includes(questId)) return current
  const next = {
    ...current,
    completedQuestIds: [...current.completedQuestIds, questId],
  }
  writeAdventureProgress(next)
  return next
}

export function markEnemyDefeated(enemyId: string): AdventureProgress {
  const current = readAdventureProgress()
  if (current.defeatedEnemyIds.includes(enemyId)) return current
  const next = {
    ...current,
    defeatedEnemyIds: [...current.defeatedEnemyIds, enemyId],
  }
  writeAdventureProgress(next)
  return next
}

export function setCurrentMapId(mapId: MapId): AdventureProgress {
  const next = { ...readAdventureProgress(), currentMapId: mapId }
  writeAdventureProgress(next)
  return next
}

export function isQuestComplete(questId: string): boolean {
  return readAdventureProgress().completedQuestIds.includes(questId)
}

export function isEnemyDefeated(enemyId: string): boolean {
  return readAdventureProgress().defeatedEnemyIds.includes(enemyId)
}
