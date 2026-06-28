import type { EnemyDefinition } from '@/lib/adventure/enemies'
import { createSpellVfx, spellVfxDuration } from '@/lib/adventure/spell-vfx'
import { getSpell, STARTER_SPELL_ID } from '@/lib/adventure/spells'
import type { GridPos } from '@/lib/adventure/types'

export const COMBAT_COLS = 14
export const COMBAT_ROWS = 9

export type CombatPhase = 'player' | 'enemy' | 'ended'

export type SpellVfx = {
  spellId: string
  from: GridPos
  to: GridPos
  startedAt: number
}

export type AttackAnim = {
  actor: 'player' | 'enemy'
  startedAt: number
}

export const ATTACK_ANIM_MS = 400

export type CombatState = {
  sourceMapId: string
  enemyId: string
  enemyNameKey: string
  enemyTintHue: number
  enemyDesaturate: boolean
  enemyAlpha: number
  playerPos: GridPos
  enemyPos: GridPos
  turnStartPos: GridPos
  playerHp: number
  playerMaxHp: number
  playerShield: number
  enemyHp: number
  enemyMaxHp: number
  enemyAttack: number
  enemyDefense: number
  movesLeft: number
  phase: CombatPhase
  selectedSpellId: string | null
  log: string[]
  result: 'win' | 'lose' | null
  vfx: SpellVfx | null
  attackAnim: AttackAnim | null
}

function posKey(p: GridPos): string {
  return `${p.x},${p.y}`
}

export function manhattan(a: GridPos, b: GridPos): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export function isCombatWalkable(x: number, y: number): boolean {
  if (x < 1 || y < 1 || x >= COMBAT_COLS - 1 || y >= COMBAT_ROWS - 1) return false
  return true
}

export function createCombatState(
  enemy: EnemyDefinition,
  unlockedSpells: string[],
): CombatState {
  void unlockedSpells
  return {
    sourceMapId: enemy.mapId,
    enemyId: enemy.id,
    enemyNameKey: enemy.nameKey,
    enemyTintHue: enemy.tintHue,
    enemyDesaturate: false,
    enemyAlpha: enemy.alpha ?? 1,
    playerPos: { x: 3, y: 7 },
    enemyPos: { x: 10, y: 2 },
    turnStartPos: { x: 3, y: 7 },
    playerHp: 40,
    playerMaxHp: 40,
    playerShield: 0,
    enemyHp: enemy.baseHp,
    enemyMaxHp: enemy.baseHp,
    enemyAttack: enemy.baseAttack,
    enemyDefense: enemy.baseDefense,
    movesLeft: 3,
    phase: 'player',
    selectedSpellId: null,
    log: ['Combat started!'],
    result: null,
    vfx: null,
    attackAnim: null,
  }
}

export function reachableCombatCells(
  from: GridPos,
  maxSteps: number,
  blocked: GridPos[],
): GridPos[] {
  const blockedKeys = new Set(blocked.map(posKey))
  const out: GridPos[] = []
  const queue: { pos: GridPos; dist: number }[] = [{ pos: from, dist: 0 }]
  const seen = new Set<string>([posKey(from)])

  while (queue.length) {
    const { pos, dist } = queue.shift()!
    if (dist > 0) out.push(pos)
    if (dist >= maxSteps) continue

    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const next = { x: pos.x + dx, y: pos.y + dy }
      const key = posKey(next)
      if (seen.has(key)) continue
      if (!isCombatWalkable(next.x, next.y)) continue
      if (blockedKeys.has(key)) continue
      seen.add(key)
      queue.push({ pos: next, dist: dist + 1 })
    }
  }

  return out
}

function appendLog(state: CombatState, line: string): CombatState {
  return { ...state, log: [...state.log.slice(-7), line] }
}

function applyDamage(
  hp: number,
  shield: number,
  raw: number,
  defense: number,
): { hp: number; shield: number; dealt: number } {
  const mitigated = Math.max(1, raw - defense)
  if (shield >= mitigated) {
    return { hp, shield: shield - mitigated, dealt: mitigated }
  }
  const overflow = mitigated - shield
  return {
    hp: Math.max(0, hp - overflow),
    shield: 0,
    dealt: mitigated,
  }
}

export function spellTargetCells(from: GridPos, range: number): GridPos[] {
  const out: GridPos[] = []
  for (let y = 1; y < COMBAT_ROWS - 1; y++) {
    for (let x = 1; x < COMBAT_COLS - 1; x++) {
      const cell = { x, y }
      const dist = manhattan(from, cell)
      if (dist > 0 && dist <= range) out.push(cell)
    }
  }
  return out
}

export function canTargetEnemyWithSpell(
  playerPos: GridPos,
  enemyPos: GridPos,
  range: number,
): boolean {
  return (
    enemyPos.x === playerPos.x &&
    enemyPos.y === playerPos.y
      ? false
      : manhattan(playerPos, enemyPos) <= range
  )
}

export function isMeleeAttackSpell(spellId: string): boolean {
  const spell = getSpell(spellId)
  return spell?.kind === 'attack' && (spell.range ?? 1) <= 1
}

export function moveCombatPlayer(state: CombatState, to: GridPos): CombatState {
  if (state.phase !== 'player' || state.result) return state
  const dist = manhattan(state.playerPos, to)
  if (dist > state.movesLeft || dist === 0) return state

  const blocked = [state.enemyPos]
  const reachable = reachableCombatCells(state.playerPos, state.movesLeft, blocked)
  if (!reachable.some((c) => c.x === to.x && c.y === to.y)) return state

  return appendLog(
    {
      ...state,
      playerPos: to,
      movesLeft: state.movesLeft - dist,
    },
    `Moved (${state.movesLeft - dist} steps left).`,
  )
}

export function selectCombatSpell(
  state: CombatState,
  spellId: string | null,
): CombatState {
  if (state.phase !== 'player' || state.result) return state
  return { ...state, selectedSpellId: spellId }
}

export function castCombatSpell(
  state: CombatState,
  spellId: string,
  target: GridPos,
): CombatState {
  if (state.phase !== 'player' || state.result) return state
  const spell = getSpell(spellId)
  if (!spell) return state

  if (spell.kind === 'attack') {
    if (manhattan(state.playerPos, target) > spell.range) return state
    if (target.x !== state.enemyPos.x || target.y !== state.enemyPos.y) return state
    const raw = spell.damage ?? 0
    const { hp, shield, dealt } = applyDamage(
      state.enemyHp,
      0,
      raw,
      state.enemyDefense,
    )
    let next: CombatState = {
      ...state,
      enemyHp: hp,
      selectedSpellId: null,
      attackAnim: isMeleeAttackSpell(spellId)
        ? { actor: 'player', startedAt: performance.now() }
        : null,
      vfx: createSpellVfx(spellId, state.playerPos, target),
    }
    next = appendLog(next, `${spell.nameKey} hits for ${dealt}!`)
    if (hp <= 0) {
      return appendLog({ ...next, phase: 'ended', result: 'win' }, 'Victory!')
    }
    return endPlayerTurn(next)
  }

  if (spell.kind === 'heal') {
    const healed = Math.min(spell.heal ?? 0, state.playerMaxHp - state.playerHp)
    let next: CombatState = {
      ...state,
      playerHp: state.playerHp + healed,
      selectedSpellId: null,
      vfx: createSpellVfx(spellId, state.playerPos, state.playerPos),
    }
    next = appendLog(next, `Healed ${healed} HP.`)
    return endPlayerTurn(next)
  }

  if (spell.kind === 'defense') {
    let next: CombatState = {
      ...state,
      playerShield: state.playerShield + (spell.shield ?? 0),
      selectedSpellId: null,
      vfx: createSpellVfx(spellId, state.playerPos, state.playerPos),
    }
    next = appendLog(next, `Shield +${spell.shield ?? 0}.`)
    return endPlayerTurn(next)
  }

  return state
}

export function endPlayerTurn(state: CombatState): CombatState {
  if (state.phase !== 'player' || state.result) return state
  return { ...state, phase: 'enemy', selectedSpellId: null }
}

export function runEnemyTurn(state: CombatState): CombatState {
  if (state.phase !== 'enemy' || state.result) return state

  let next = { ...state }
  let steps = 3
  while (steps > 0) {
    const dist = manhattan(next.playerPos, next.enemyPos)
    if (dist === 1) break
    const dx = Math.sign(next.playerPos.x - next.enemyPos.x)
    const dy = Math.sign(next.playerPos.y - next.enemyPos.y)
    const tryMoves: GridPos[] = []
    if (dx !== 0) tryMoves.push({ x: next.enemyPos.x + dx, y: next.enemyPos.y })
    if (dy !== 0) tryMoves.push({ x: next.enemyPos.x, y: next.enemyPos.y + dy })

    let moved = false
    for (const candidate of tryMoves) {
      if (!isCombatWalkable(candidate.x, candidate.y)) continue
      if (candidate.x === next.playerPos.x && candidate.y === next.playerPos.y) continue
      next = { ...next, enemyPos: candidate }
      moved = true
      steps -= 1
      break
    }
    if (!moved) break
  }

  if (manhattan(next.playerPos, next.enemyPos) === 1) {
    const { hp, shield, dealt } = applyDamage(
      next.playerHp,
      next.playerShield,
      next.enemyAttack,
      0,
    )
    next = {
      ...next,
      playerHp: hp,
      playerShield: shield,
      attackAnim: { actor: 'enemy', startedAt: performance.now() },
      vfx: createSpellVfx('strike', next.enemyPos, next.playerPos),
    }
    next = appendLog(next, `Enemy attacks for ${dealt}!`)
    if (hp <= 0) {
      return appendLog({ ...next, phase: 'ended', result: 'lose' }, 'Defeat…')
    }
  } else {
    next = appendLog(next, 'Enemy moves closer.')
  }

  return {
    ...next,
    phase: 'player',
    movesLeft: 3,
    turnStartPos: { ...next.playerPos },
  }
}

export function clearCombatVfx(state: CombatState): CombatState {
  if (!state.vfx && !state.attackAnim) return state
  return { ...state, vfx: null, attackAnim: null }
}

export function isCombatAttackPlaying(state: CombatState, now = performance.now()): boolean {
  if (!state.attackAnim) return false
  return now - state.attackAnim.startedAt < ATTACK_ANIM_MS
}

export function isCombatVfxPlaying(state: CombatState, now = performance.now()): boolean {
  if (!state.vfx) return false
  return now - state.vfx.startedAt < spellVfxDuration(state.vfx.spellId)
}

export { spellVfxDuration }
