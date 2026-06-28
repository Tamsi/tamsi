import {
  DOFUS_CELL_HALF_H,
  DOFUS_CELL_W,
  GRASS_GROUND_IDS,
  loadDofusGrassTiles,
  loadGroundCatalog,
  type GroundCatalog,
  type GfxSpriteMeta,
} from '@/lib/adventure/dofus-assets'
import { CHARACTER_SPRITE_ROW_COUNT } from '@/lib/adventure/isometric'
import { NPC_IDLE_FRAME_COUNT, NPC_IDLE_ROW } from '@/lib/adventure/npc'
import { loadProceduralGrassTiles } from '@/lib/adventure/grass-tile'
import {
  enemySpritePath,
  type EnemySpriteSet,
} from '@/lib/adventure/enemies'

export type EnemyAnimationSet = {
  idle: HTMLImageElement[]
  attack: HTMLImageElement[]
}

export type EnemySpriteFrames = Record<EnemySpriteSet, EnemyAnimationSet>

export type LocalCharacterFrames = Record<number, HTMLImageElement[]>

export type AdventureSprites = {
  source: 'dofus' | 'procedural'
  cellW: number
  cellHalfH: number
  grassTiles: Map<number, HTMLImageElement>
  grassMeta: Record<string, GfxSpriteMeta>
  characterRun: LocalCharacterFrames
  /** Standing idle loop per diagonal (2DPIXX warrior). */
  characterIdle: LocalCharacterFrames
  /** Archivist NPC idle frames (2DPIXX wizard). */
  npcIdle: HTMLImageElement[]
  /** Dungeon enemy idle frames (tinted at draw time). */
  enemySprites: EnemySpriteFrames
}

const RUN_FRAME_COUNT = 4
const IDLE_FRAME_COUNT = 4

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${url}`))
    img.src = url
  })
}

async function loadLocalCharacterRun(): Promise<LocalCharacterFrames> {
  const frames: LocalCharacterFrames = {}
  await Promise.all(
    Array.from({ length: CHARACTER_SPRITE_ROW_COUNT }, async (_, dir) => {
      const dirFrames: HTMLImageElement[] = []
      await Promise.all(
        Array.from({ length: RUN_FRAME_COUNT }, async (_, frame) => {
          const path = `/adventure/sprites/character/run_${dir}_${frame}.png`
          try {
            dirFrames.push(await loadImage(path))
          } catch {
            // Missing frame — skip.
          }
        }),
      )
      frames[dir] = dirFrames
    }),
  )
  return frames
}

async function loadLocalCharacterIdle(): Promise<LocalCharacterFrames> {
  const frames: LocalCharacterFrames = {}
  await Promise.all(
    Array.from({ length: CHARACTER_SPRITE_ROW_COUNT }, async (_, dir) => {
      const dirFrames: HTMLImageElement[] = []
      await Promise.all(
        Array.from({ length: IDLE_FRAME_COUNT }, async (_, frame) => {
          const path = `/adventure/sprites/character/idle_${dir}_${frame}.png`
          try {
            dirFrames.push(await loadImage(path))
          } catch {
            // Missing frame — skip.
          }
        }),
      )
      frames[dir] = dirFrames
    }),
  )
  return frames
}

async function loadLocalNpcIdle(): Promise<HTMLImageElement[]> {
  const frames: HTMLImageElement[] = []
  await Promise.all(
    Array.from({ length: NPC_IDLE_FRAME_COUNT }, async (_, frame) => {
      const path = `/adventure/sprites/npc/wizard_idle_${NPC_IDLE_ROW}_${frame}.png`
      try {
        frames[frame] = await loadImage(path)
      } catch {
        // Missing frame — skip.
      }
    }),
  )
  return frames.filter(Boolean)
}

const ENEMY_SPRITE_SETS: EnemySpriteSet[] = [
  'goblin',
  'skeleton',
  'wraith',
  'brute',
  'archmage',
]

async function loadEnemySprites(): Promise<EnemySpriteFrames> {
  const result = {} as EnemySpriteFrames
  await Promise.all(
    ENEMY_SPRITE_SETS.map(async (set) => {
      const idle: HTMLImageElement[] = []
      const attack: HTMLImageElement[] = []
      await Promise.all([
        ...Array.from({ length: 4 }, async (_, frame) => {
          try {
            idle[frame] = await loadImage(enemySpritePath(set, frame, 'idle'))
          } catch {
            // Missing frame — skip.
          }
        }),
        ...Array.from({ length: 4 }, async (_, frame) => {
          try {
            attack[frame] = await loadImage(enemySpritePath(set, frame, 'attack'))
          } catch {
            // Missing frame — skip.
          }
        }),
      ])
      result[set] = {
        idle: idle.filter(Boolean),
        attack: attack.filter(Boolean),
      }
    }),
  )
  return result
}

async function loadLocalDofusGrass(): Promise<Map<number, HTMLImageElement>> {
  const tiles = new Map<number, HTMLImageElement>()
  await Promise.all(
    GRASS_GROUND_IDS.map(async (id) => {
      try {
        tiles.set(id, await loadImage(`/adventure/dofus/ground/${id}.png`))
      } catch {
        // Missing optional extract.
      }
    }),
  )
  return tiles
}

async function tryLoadDofusGrass(): Promise<{
  grassTiles: Map<number, HTMLImageElement>
  grassMeta: Record<string, GfxSpriteMeta>
} | null> {
  const mode = process.env.NEXT_PUBLIC_ADVENTURE_DOFUS_TILES

  if (mode === 'local') {
    const grassTiles = await loadLocalDofusGrass()
    return grassTiles.size > 0 ? { grassTiles, grassMeta: {} } : null
  }

  if (mode === 'remote' || mode === 'true') {
    try {
      const catalog: GroundCatalog = await loadGroundCatalog()
      const grassTiles = await loadDofusGrassTiles(catalog)
      if (grassTiles.size === 0) return null
      return { grassTiles, grassMeta: catalog.sprites }
    } catch {
      return null
    }
  }

  return null
}

export async function loadAdventureSprites(): Promise<AdventureSprites> {
  const [characterRun, characterIdle, npcIdle, enemySprites] = await Promise.all([
    loadLocalCharacterRun(),
    loadLocalCharacterIdle(),
    loadLocalNpcIdle(),
    loadEnemySprites(),
  ])

  const dofusGrass = await tryLoadDofusGrass()
  if (dofusGrass) {
    return {
      source: 'dofus',
      cellW: DOFUS_CELL_W,
      cellHalfH: DOFUS_CELL_HALF_H,
      grassTiles: dofusGrass.grassTiles,
      grassMeta: dofusGrass.grassMeta,
      characterRun,
      characterIdle,
      npcIdle,
      enemySprites,
    }
  }

  const grassTiles = await loadProceduralGrassTiles()
  return {
    source: 'procedural',
    cellW: DOFUS_CELL_W,
    cellHalfH: DOFUS_CELL_HALF_H,
    grassTiles,
    grassMeta: {},
    characterRun,
    characterIdle,
    npcIdle,
    enemySprites,
  }
}
