import type { GridPos, TileKind } from '@/lib/adventure/types'
import {
  getMapDefinition,
  mapDimensions,
  tileAtMap,
  transitionAtMap,
  type MapId,
} from '@/lib/adventure/maps'
import { enemyForMap } from '@/lib/adventure/enemies'
import { dungeonDepth } from '@/lib/adventure/maps'

export type { MapId } from '@/lib/adventure/maps'

export function tileAt(mapId: MapId, x: number, y: number): TileKind {
  return tileAtMap(mapId, x, y)
}

export function mapSize(mapId: MapId): { cols: number; rows: number } {
  return mapDimensions(mapId)
}

export function isNpcCell(mapId: MapId, x: number, y: number): boolean {
  const def = getMapDefinition(mapId)
  if (!def.npcPosition) return false
  return def.npcPosition.x === x && def.npcPosition.y === y
}

export function isEnemyCell(mapId: MapId, x: number, y: number): boolean {
  const depth = dungeonDepth(mapId)
  const enemy = enemyForMap(mapId, depth)
  if (!enemy) return false
  return enemy.position.x === x && enemy.position.y === y
}

export function isWalkable(mapId: MapId, x: number, y: number): boolean {
  const kind = tileAt(mapId, x, y)
  if (kind === 'void') return false
  if (isNpcCell(mapId, x, y)) return false
  if (isEnemyCell(mapId, x, y)) return false
  return true
}

export function findSpawn(mapId: MapId): GridPos {
  return { ...getMapDefinition(mapId).spawn }
}

export function getTransition(mapId: MapId, x: number, y: number) {
  return transitionAtMap(mapId, x, y)
}

export { getMapDefinition, transitionAtMap }
