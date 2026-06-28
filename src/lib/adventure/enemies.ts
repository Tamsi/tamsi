import type { GridPos } from '@/lib/adventure/types'
import type { MapId } from '@/lib/adventure/maps'

// Enemy sprites: Clint Bellanger (CC0) — opengameart.org/content/isometric-hero-and-creatures
export type EnemySpriteSet = 'goblin' | 'skeleton' | 'wraith' | 'brute' | 'archmage'

export type EnemyDefinition = {
  id: string
  mapId: MapId
  nameKey: string
  position: GridPos
  spriteSet: EnemySpriteSet
  /** Optional canvas filter when drawing (0 = none). */
  tintHue: number
  /** Per-enemy opacity (wraith). */
  alpha?: number
  baseHp: number
  baseAttack: number
  baseDefense: number
  scrollId: string
}

const ENEMY_LAYOUT: Record<
  MapId,
  Omit<EnemyDefinition, 'mapId' | 'baseHp' | 'baseAttack' | 'baseDefense'> | null
> = {
  entrance: null,
  'dungeon-1': {
    id: 'enemy-dungeon-1',
    nameKey: 'goblin',
    position: { x: 16, y: 4 },
    spriteSet: 'goblin',
    tintHue: 0,
    scrollId: 'scroll-blog-unsloth',
  },
  'dungeon-2': {
    id: 'enemy-dungeon-2',
    nameKey: 'skeleton',
    position: { x: 11, y: 3 },
    spriteSet: 'skeleton',
    tintHue: 0,
    scrollId: 'scroll-blog-hermes',
  },
  'dungeon-3': {
    id: 'enemy-dungeon-3',
    nameKey: 'wraith',
    position: { x: 16, y: 4 },
    spriteSet: 'wraith',
    tintHue: 0,
    alpha: 0.82,
    scrollId: 'scroll-blog-qwen',
  },
  'dungeon-4': {
    id: 'enemy-dungeon-4',
    nameKey: 'brute',
    position: { x: 14, y: 2 },
    spriteSet: 'brute',
    tintHue: 0,
    scrollId: 'scroll-blog-redbee',
  },
  'dungeon-5': {
    id: 'enemy-dungeon-5',
    nameKey: 'archmage',
    position: { x: 12, y: 5 },
    spriteSet: 'archmage',
    tintHue: 0,
    scrollId: 'scroll-blog-ai-reviewer',
  },
}

export function enemyForMap(mapId: MapId, depth: number): EnemyDefinition | null {
  const layout = ENEMY_LAYOUT[mapId]
  if (!layout) return null
  const scale = 1 + depth * 0.22
  return {
    ...layout,
    mapId,
    baseHp: Math.round(28 * scale),
    baseAttack: Math.round(6 * scale),
    baseDefense: Math.round(2 * scale),
  }
}

export function enemyById(enemyId: string): EnemyDefinition | null {
  for (const mapId of [
    'dungeon-1',
    'dungeon-2',
    'dungeon-3',
    'dungeon-4',
    'dungeon-5',
  ] as const) {
    const depth = Number(mapId.split('-')[1])
    const enemy = enemyForMap(mapId, depth)
    if (enemy?.id === enemyId) return enemy
  }
  return null
}

export function enemySpritePath(
  spriteSet: EnemySpriteSet,
  frame: number,
  kind: 'idle' | 'attack' = 'idle',
): string {
  const prefix = kind === 'attack' ? 'attack' : 'idle'
  return `/adventure/sprites/enemies/${spriteSet}/${prefix}_${frame}.png`
}
