import type { GridPos, TileKind } from '@/lib/adventure/types'

const ASCII = [
  '....................',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '..gggggggggggggggg..',
  '....................',
] as const

export const MAP_ROWS = ASCII.length
export const MAP_COLS = ASCII[0].length

export function tileAt(x: number, y: number): TileKind {
  if (y < 0 || x < 0 || y >= MAP_ROWS || x >= MAP_COLS) return 'void'
  const ch = ASCII[y][x]
  return ch === 'g' ? 'grass' : 'void'
}

export function isWalkable(x: number, y: number): boolean {
  return tileAt(x, y) === 'grass'
}

export function findSpawn(): GridPos {
  return { x: Math.floor(MAP_COLS / 2), y: Math.floor(MAP_ROWS / 2) }
}
