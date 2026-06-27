import type { GridPos } from '@/lib/adventure/types'

/** Default cell size (overridden when Dofus sprites load). */
export const TILE_W = 53
export const TILE_H = 27

export function gridToScreen(
  x: number,
  y: number,
  originX: number,
  originY: number,
  cellW = TILE_W,
  cellHalfH = TILE_H / 2,
): { x: number; y: number } {
  return {
    x: originX + (x - y) * (cellW / 2),
    y: originY + (x + y) * cellHalfH,
  }
}

export type MapBounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
  centerX: number
  centerY: number
}

export function computeMapBounds(
  cols: number,
  rows: number,
  isVisible: (x: number, y: number) => boolean,
  tileHalfWidth: number,
  tileHalfHeight: number,
): MapBounds {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!isVisible(x, y)) continue
      const { x: sx, y: sy } = gridToScreen(
        x,
        y,
        0,
        0,
        tileHalfWidth * 2,
        tileHalfHeight,
      )
      minX = Math.min(minX, sx - tileHalfWidth)
      maxX = Math.max(maxX, sx + tileHalfWidth)
      minY = Math.min(minY, sy)
      maxY = Math.max(maxY, sy + tileHalfHeight * 2 + 4)
    }
  }

  if (!Number.isFinite(minX)) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
    }
  }

  const width = maxX - minX
  const height = maxY - minY
  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  }
}

export function sortDrawOrder(cells: GridPos[]): GridPos[] {
  return [...cells].sort((a, b) => a.x + a.y - (b.x + b.y))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function cellCenter(
  x: number,
  y: number,
  cellW = TILE_W,
  cellHalfH = TILE_H / 2,
): { x: number; y: number } {
  const { x: sx, y: sy } = gridToScreen(x, y, 0, 0, cellW, cellHalfH)
  return { x: sx, y: sy + cellHalfH }
}

export function pickCellAtMapPoint(
  mapX: number,
  mapY: number,
  cols: number,
  rows: number,
  isWalkable: (x: number, y: number) => boolean,
  cellW = TILE_W,
  cellHalfH = TILE_H / 2,
): GridPos | null {
  let best: GridPos | null = null
  let bestDist = Infinity

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!isWalkable(x, y)) continue
      const c = cellCenter(x, y, cellW, cellHalfH)
      const d = (mapX - c.x) ** 2 + (mapY - c.y) ** 2
      if (d < bestDist) {
        bestDist = d
        best = { x, y }
      }
    }
  }

  return best
}

/** Grid movement facing (8 dirs on isometric grid). */
export const DEFAULT_CHARACTER_DIRECTION = 4

/**
 * 2DPIXX warrior sprite rows (4 diagonals only):
 * 0 = SE, 1 = SW, 2 = NW, 3 = NE
 */
export const CHARACTER_SPRITE_ROW_COUNT = 4

export function characterSpriteRow(dir8: number): number {
  // E/SE (right) ↔ S/SW (down) run sprites swapped.
  const map = [2, 3, 1, 1, 0, 0, 1, 2] // N, NE, E, SE, S, SW, W, NW
  return map[dir8] ?? 1
}

export function movementDirection(dx: number, dy: number): number {
  const map: Record<string, number> = {
    '-1,-1': 0,
    '0,-1': 1,
    '1,-1': 2,
    '1,0': 3,
    '1,1': 4,
    '0,1': 5,
    '-1,1': 6,
    '-1,0': 7,
  }
  return map[`${dx},${dy}`] ?? 0
}
