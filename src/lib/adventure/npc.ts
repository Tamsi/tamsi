import type { GridPos } from '@/lib/adventure/types'

/** Quest giver — center of the entrance. */
export const NPC_POSITION: GridPos = { x: 10, y: 6 }

export const PLAYER_SPAWN: GridPos = { x: 10, y: 8 }

export function isNpcPosition(x: number, y: number): boolean {
  return x === NPC_POSITION.x && y === NPC_POSITION.y
}

/** 2DPIXX wizard idle row facing the player (SW). */
export const NPC_IDLE_ROW = 1
export const NPC_IDLE_FRAME_COUNT = 4

export const NPC_PORTRAIT_PATH =
  '/adventure/sprites/npc/wizard_idle_1_0.png'
