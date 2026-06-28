/** Dofus Retro map cell layout (from community map renderers). */
export const DOFUS_CELL_W = 53
export const DOFUS_CELL_HALF_H = 13.5

export type GfxSpriteMeta = { x: number; y: number }

export type GroundCatalog = {
  sprites: Record<string, GfxSpriteMeta>
}

/** Common field grass ground gfx ids in Dofus Retro. */
export const GRASS_GROUND_IDS = [53, 54, 55, 56, 57, 58, 59, 60] as const

const PROXY = '/api/adventure/dofus'

/** Grass tile source via NEXT_PUBLIC_ADVENTURE_DOFUS_TILES: unset (procedural), local, or remote. */

const imageCache = new Map<string, Promise<HTMLImageElement>>()

function loadImage(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url)
  if (cached) return cached

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
  imageCache.set(url, promise)
  return promise
}

export async function loadGroundCatalog(): Promise<GroundCatalog> {
  const res = await fetch(`${PROXY}/img/maps-gfx/ground/ground.json`)
  if (!res.ok) throw new Error('Dofus ground catalog unavailable')
  return res.json()
}

export async function loadGroundImage(id: number): Promise<HTMLImageElement> {
  return loadImage(`${PROXY}/img/maps-gfx/ground/${id}.png`)
}

export function pickGrassId(x: number, y: number): number {
  const ids = GRASS_GROUND_IDS
  return ids[(x * 7 + y * 13) % ids.length]
}

export async function loadDofusGrassTiles(
  catalog: GroundCatalog,
): Promise<Map<number, HTMLImageElement>> {
  const tiles = new Map<number, HTMLImageElement>()
  const available = GRASS_GROUND_IDS.filter((id) =>
    String(id) in catalog.sprites,
  )

  const ids = available.length > 0 ? available : GRASS_GROUND_IDS
  await Promise.all(
    ids.map(async (id) => {
      try {
        tiles.set(id, await loadGroundImage(id))
      } catch {
        // Skip missing gfx ids silently.
      }
    }),
  )
  return tiles
}

/** Dofus entity gfx id for a simple male citizen-like sprite. */
export const PLAYER_GFX_ID = 800

export async function loadPlayerSprite(
  direction: number,
  frame: number,
): Promise<HTMLImageElement | null> {
  const paths = [
    `${PROXY}/img/gfx/sprites/${PLAYER_GFX_ID}_${direction}_${frame}.png`,
    `${PROXY}/img/sprites/${PLAYER_GFX_ID}/${direction}/${frame}.png`,
    `${PROXY}/img/entities/${PLAYER_GFX_ID}/${direction}/${frame}.png`,
  ]

  for (const url of paths) {
    try {
      const res = await fetch(url, { method: 'HEAD' })
      if (res.ok) return loadImage(url)
    } catch {
      // try next pattern
    }
  }
  return null
}
