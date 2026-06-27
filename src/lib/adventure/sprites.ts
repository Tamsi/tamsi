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
import { loadProceduralGrassTiles } from '@/lib/adventure/grass-tile'

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

async function loadLocalDofusGrass(): Promise<Map<number, HTMLImageElement>> {
  const tiles = new Map<number, HTMLImageElement>()
  await Promise.all(
    GRASS_GROUND_IDS.map(async (id) => {
      try {
        tiles.set(id, await loadImage(`/adventure/dofus/ground/${id}.png`))
      } catch {
        // Optional user-provided extract.
      }
    }),
  )
  return tiles
}

export async function loadAdventureSprites(): Promise<AdventureSprites> {
  const [characterRun, characterIdle] = await Promise.all([
    loadLocalCharacterRun(),
    loadLocalCharacterIdle(),
  ])

  const localGrass = await loadLocalDofusGrass()
  if (localGrass.size > 0) {
    return {
      source: 'dofus',
      cellW: DOFUS_CELL_W,
      cellHalfH: DOFUS_CELL_HALF_H,
      grassTiles: localGrass,
      grassMeta: {},
      characterRun,
      characterIdle,
    }
  }

  try {
    const catalog: GroundCatalog = await loadGroundCatalog()
    const grassTiles = await loadDofusGrassTiles(catalog)
    if (grassTiles.size === 0) throw new Error('No grass tiles loaded')

    return {
      source: 'dofus',
      cellW: DOFUS_CELL_W,
      cellHalfH: DOFUS_CELL_HALF_H,
      grassTiles,
      grassMeta: catalog.sprites,
      characterRun,
      characterIdle,
    }
  } catch {
    const grassTiles = await loadProceduralGrassTiles()
    return {
      source: 'procedural',
      cellW: DOFUS_CELL_W,
      cellHalfH: DOFUS_CELL_HALF_H,
      grassTiles,
      grassMeta: {},
      characterRun,
      characterIdle,
    }
  }
}
