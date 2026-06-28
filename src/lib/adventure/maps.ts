import type { GridPos, TileKind } from '@/lib/adventure/types'

export type MapId =
  | 'entrance'
  | 'dungeon-1'
  | 'dungeon-2'
  | 'dungeon-3'
  | 'dungeon-4'
  | 'dungeon-5'

export const MAP_ORDER: MapId[] = [
  'entrance',
  'dungeon-1',
  'dungeon-2',
  'dungeon-3',
  'dungeon-4',
  'dungeon-5',
]

export type TransitionArrow = {
  targetMapId: MapId
  position: GridPos
  direction: 'left' | 'right'
}

export type MapDefinition = {
  id: MapId
  ascii: readonly string[]
  spawn: GridPos
  npcPosition?: GridPos
  transitions: TransitionArrow[]
}

const ENTRANCE_ASCII = [
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

/** Side alcoves — first dungeon chamber. */
const DUNGEON_1_ASCII = [
  '....................',
  '..ddd..........ddd..',
  '..ddd..........ddd..',
  '..ddd..........ddd..',
  '..ddd..........ddd..',
  '..ddd..........ddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..ddd..........ddd..',
  '..ddd..........ddd..',
  '..ddd..........ddd..',
  '..dddddddddddddddd..',
  '....................',
] as const

/** Pillared hall — obstacles in the center. */
const DUNGEON_2_ASCII = [
  '....................',
  '..dddddddddddddddd..',
  '..dd....dddd....dd..',
  '..dd....dddd....dd..',
  '..dd....dddd....dd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dd....dddd....dd..',
  '..dd....dddd....dd..',
  '..dd....dddd....dd..',
  '..dddddddddddddddd..',
  '....................',
] as const

/** North/south wings — T-shaped layout. */
const DUNGEON_3_ASCII = [
  '....................',
  '..dddddddddddddddd..',
  '..dddd........dddd..',
  '..dddd........dddd..',
  '..dddd........dddd..',
  '..dddd........dddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddd........dddd..',
  '..dddd........dddd..',
  '..dddd........dddd..',
  '..dddddddddddddddd..',
  '....................',
] as const

/** Checkerboard pillars — tighter pathing. */
const DUNGEON_4_ASCII = [
  '....................',
  '..dddddddddddddddd..',
  '..dtdtdtdtdtdtdtdt..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dtdtdtdtdtdtdtdt..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dtdtdtdtdtdtdtdt..',
  '..dddddddddddddddd..',
  '..dtdtdtdtdtdtdtdt..',
  '..dddddddddddddddd..',
  '....................',
] as const

/** Open boss chamber — final floor. */
const DUNGEON_5_ASCII = [
  '....................',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '..dddddddddddddddd..',
  '....................',
] as const

export const MAP_DEFINITIONS: Record<MapId, MapDefinition> = {
  entrance: {
    id: 'entrance',
    ascii: ENTRANCE_ASCII,
    spawn: { x: 10, y: 8 },
    npcPosition: { x: 10, y: 6 },
    transitions: [
      {
        targetMapId: 'dungeon-1',
        position: { x: 17, y: 7 },
        direction: 'right',
      },
    ],
  },
  'dungeon-1': {
    id: 'dungeon-1',
    ascii: DUNGEON_1_ASCII,
    spawn: { x: 3, y: 7 },
    transitions: [
      {
        targetMapId: 'entrance',
        position: { x: 2, y: 7 },
        direction: 'left',
      },
      {
        targetMapId: 'dungeon-2',
        position: { x: 17, y: 7 },
        direction: 'right',
      },
    ],
  },
  'dungeon-2': {
    id: 'dungeon-2',
    ascii: DUNGEON_2_ASCII,
    spawn: { x: 3, y: 7 },
    transitions: [
      {
        targetMapId: 'dungeon-1',
        position: { x: 2, y: 7 },
        direction: 'left',
      },
      {
        targetMapId: 'dungeon-3',
        position: { x: 17, y: 7 },
        direction: 'right',
      },
    ],
  },
  'dungeon-3': {
    id: 'dungeon-3',
    ascii: DUNGEON_3_ASCII,
    spawn: { x: 3, y: 7 },
    transitions: [
      {
        targetMapId: 'dungeon-2',
        position: { x: 2, y: 7 },
        direction: 'left',
      },
      {
        targetMapId: 'dungeon-4',
        position: { x: 17, y: 7 },
        direction: 'right',
      },
    ],
  },
  'dungeon-4': {
    id: 'dungeon-4',
    ascii: DUNGEON_4_ASCII,
    spawn: { x: 3, y: 7 },
    transitions: [
      {
        targetMapId: 'dungeon-3',
        position: { x: 2, y: 7 },
        direction: 'left',
      },
      {
        targetMapId: 'dungeon-5',
        position: { x: 17, y: 7 },
        direction: 'right',
      },
    ],
  },
  'dungeon-5': {
    id: 'dungeon-5',
    ascii: DUNGEON_5_ASCII,
    spawn: { x: 3, y: 7 },
    transitions: [
      {
        targetMapId: 'dungeon-4',
        position: { x: 2, y: 7 },
        direction: 'left',
      },
    ],
  },
}

export function getMapDefinition(mapId: MapId): MapDefinition {
  return MAP_DEFINITIONS[mapId]
}

export function parseTileChar(ch: string): TileKind {
  if (ch === 'g') return 'grass'
  if (ch === 'd') return 'stone'
  return 'void'
}

export function mapDimensions(mapId: MapId): { cols: number; rows: number } {
  const ascii = MAP_DEFINITIONS[mapId].ascii
  return { cols: ascii[0].length, rows: ascii.length }
}

export function tileAtMap(mapId: MapId, x: number, y: number): TileKind {
  const { ascii } = MAP_DEFINITIONS[mapId]
  if (y < 0 || x < 0 || y >= ascii.length || x >= ascii[y].length) return 'void'
  return parseTileChar(ascii[y][x])
}

export function transitionAtMap(
  mapId: MapId,
  x: number,
  y: number,
): TransitionArrow | undefined {
  return MAP_DEFINITIONS[mapId].transitions.find(
    (t) => t.position.x === x && t.position.y === y,
  )
}

export function dungeonDepth(mapId: MapId): number {
  const idx = MAP_ORDER.indexOf(mapId)
  return idx <= 0 ? 0 : idx
}
