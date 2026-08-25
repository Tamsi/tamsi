import type { GridPos } from '@/lib/adventure/types'
import { DUNGEON_MAP_IDS, dungeonDepth, type MapId } from '@/lib/adventure/maps'
import { enemyForMap } from '@/lib/adventure/enemies'

export const TUTORIAL_SCROLL_ID = 'scroll-tuto-welcome'

export type ScrollDefinition = {
  id: string
  mapId: MapId
  position: GridPos
  kind: 'tutorial' | 'blog'
  contentKey?: 'tutoWelcome'
  blogSlug?: string
  /** Requires defeating this enemy before pickup. */
  guardedByEnemyId?: string
}

export const BLOG_SCROLL_SLUGS = [
  'unsloth-studio-hf-live-daniel-hanchen',
  'hermes-automation-cheaper-models',
  'qwen-3-6-27b-remote-server',
  'redbee-mcp',
  'ai-code-reviewer-mcp',
  'huggimon-ai-trainer-card',
  'unsloth-studio',
  'qwen-3-8-27b',
  'dflash2',
  'hermes-hud-wow',
] as const

const BLOG_SCROLL_IDS = [
  'scroll-blog-unsloth',
  'scroll-blog-hermes',
  'scroll-blog-qwen',
  'scroll-blog-redbee',
  'scroll-blog-ai-reviewer',
  'scroll-blog-huggimon',
  'scroll-blog-unsloth-studio',
  'scroll-blog-qwen-38',
  'scroll-blog-dflash2',
  'scroll-blog-hermes-hud',
] as const

const SCROLL_POSITIONS: GridPos[] = [
  { x: 16, y: 5 },
  { x: 11, y: 4 },
  { x: 16, y: 5 },
  { x: 14, y: 10 },
  { x: 16, y: 6 },
  { x: 16, y: 3 },
  { x: 16, y: 2 },
  { x: 13, y: 5 },
  { x: 16, y: 4 },
  { x: 16, y: 4 },
]

function buildBlogScrolls(): ScrollDefinition[] {
  return DUNGEON_MAP_IDS.map((mapId, i) => {
    const enemy = enemyForMap(mapId, dungeonDepth(mapId))
    return {
      id: BLOG_SCROLL_IDS[i],
      mapId,
      position: SCROLL_POSITIONS[i],
      kind: 'blog' as const,
      blogSlug: BLOG_SCROLL_SLUGS[i],
      guardedByEnemyId: enemy?.id,
    }
  })
}

export const MAP_SCROLLS: ScrollDefinition[] = [
  {
    id: TUTORIAL_SCROLL_ID,
    mapId: 'entrance',
    position: { x: 14, y: 3 },
    kind: 'tutorial',
    contentKey: 'tutoWelcome',
  },
  ...buildBlogScrolls(),
]

export function scrollsForMap(mapId: MapId): ScrollDefinition[] {
  return MAP_SCROLLS.filter((s) => s.mapId === mapId)
}

export function scrollAtCell(
  x: number,
  y: number,
  mapId: MapId,
): ScrollDefinition | undefined {
  return scrollsForMap(mapId).find(
    (s) => s.position.x === x && s.position.y === y,
  )
}

export function scrollById(scrollId: string): ScrollDefinition | undefined {
  return MAP_SCROLLS.find((s) => s.id === scrollId)
}

export function nextDungeonQuestScroll(
  completedQuestIds: string[],
): ScrollDefinition | undefined {
  if (!completedQuestIds.includes(TUTORIAL_SCROLL_ID)) {
    return MAP_SCROLLS.find((s) => s.id === TUTORIAL_SCROLL_ID)
  }
  return BLOG_SCROLL_IDS.map((id) => scrollById(id)).find(
    (s) => s && !completedQuestIds.includes(s.id),
  )
}
