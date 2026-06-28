/** Fireball VFX frames — CC0, opengameart.org/content/fireball-sprite */

const FIREBALL_FRAME_COUNT = 8

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${url}`))
    img.src = url
  })
}

let fireballFrames: HTMLImageElement[] | null = null
let loadPromise: Promise<HTMLImageElement[]> | null = null

export async function loadFireballVfxFrames(): Promise<HTMLImageElement[]> {
  if (fireballFrames) return fireballFrames
  if (loadPromise) return loadPromise
  loadPromise = Promise.all(
    Array.from({ length: FIREBALL_FRAME_COUNT }, (_, i) =>
      loadImage(`/adventure/spells/vfx/fireball_${i}.png`),
    ),
  ).then((frames) => {
    fireballFrames = frames
    return frames
  })
  return loadPromise
}

export function getFireballVfxFrames(): HTMLImageElement[] | null {
  return fireballFrames
}

export function fireballVfxFrameIndex(elapsedMs: number, frameMs = 55): number {
  return Math.floor(elapsedMs / frameMs) % FIREBALL_FRAME_COUNT
}
