'use client'

import { useEffect, useRef } from 'react'
import { drawProceduralStone } from '@/lib/adventure/grass-tile'
import {
  ATTACK_ANIM_MS,
  canTargetEnemyWithSpell,
  castCombatSpell,
  COMBAT_COLS,
  COMBAT_ROWS,
  isCombatAttackPlaying,
  isCombatVfxPlaying,
  isCombatWalkable,
  manhattan,
  moveCombatPlayer,
  reachableCombatCells,
  runEnemyTurn,
  spellTargetCells,
  spellVfxDuration,
  type CombatState,
} from '@/lib/adventure/combat'
import { drawSpellVfx } from '@/lib/adventure/spell-vfx'
import { loadFireballVfxFrames } from '@/lib/adventure/spell-vfx-sprites'
import { enemyById, type EnemySpriteSet } from '@/lib/adventure/enemies'
import {
  computeMapBounds,
  characterSpriteRow,
  DEFAULT_CHARACTER_DIRECTION,
  gridToScreen,
  lerp,
  movementDirection,
  pickCellAtMapPoint,
  sortDrawOrder,
} from '@/lib/adventure/isometric'
import { findPath } from '@/lib/adventure/pathfinding'
import { getSpell } from '@/lib/adventure/spells'
import {
  loadAdventureSprites,
  type AdventureSprites,
} from '@/lib/adventure/sprites'
import type { GridPos } from '@/lib/adventure/types'

type Viewport = { originX: number; originY: number; scale: number }

const MOVE_MS = 140

type CombatMoveAnim = {
  grid: GridPos
  target: GridPos
  path: GridPos[]
  moving: boolean
  t0: number
  direction: number
  pendingGoal: GridPos | null
}

type AdventureCombatCanvasProps = {
  state: CombatState
  copy: {
    movesLeft: string
    selectTarget: string
    selectRangedTarget: string
  }
  onStateChange: (state: CombatState) => void
  onExit: (result: 'win' | 'lose') => void
}

function playerDisplayHeight(cellW: number): number {
  return cellW * (1.3 / 1.2)
}

function attackLunge(progress: number): number {
  if (progress < 0.45) return progress / 0.45
  return Math.max(0, 1 - (progress - 0.45) / 0.55)
}

function lerpPos(a: GridPos, b: GridPos, t: number): GridPos {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

function drawTintedSprite(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  footX: number,
  footY: number,
  cellW: number,
  alpha?: number,
) {
  const targetH = playerDisplayHeight(cellW)
  const scale = targetH / img.height
  const w = img.width * scale
  const h = img.height * scale
  ctx.save()
  if (alpha !== undefined) ctx.globalAlpha = alpha
  ctx.drawImage(img, footX - w / 2, footY - h * 0.98, w, h)
  ctx.restore()
}

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  footX: number,
  footY: number,
  sprites: AdventureSprites,
  img: HTMLImageElement,
) {
  const targetH = playerDisplayHeight(sprites.cellW)
  const scale = targetH / img.height
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, footX - w / 2, footY - h * 0.98, w, h)
}

function drawReachableHighlight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sprites: AdventureSprites,
  color = 'rgba(77, 240, 255, 0.28)',
) {
  const { x: sx, y: sy } = gridToScreen(
    x,
    y,
    0,
    0,
    sprites.cellW,
    sprites.cellHalfH,
  )
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(sx, sy + sprites.cellHalfH, sprites.cellW * 0.22, sprites.cellHalfH * 0.55, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  pos: GridPos,
  sprites: AdventureSprites,
  hp: number,
  maxHp: number,
  variant: 'player' | 'enemy',
  alpha = 1,
  shield = 0,
) {
  if (maxHp <= 0) return

  const screen = gridToScreen(pos.x, pos.y, 0, 0, sprites.cellW, sprites.cellHalfH)
  const footX = screen.x
  const footY = screen.y + sprites.cellHalfH
  const spriteH = playerDisplayHeight(sprites.cellW)
  const barW = sprites.cellW * 0.88
  const barH = 8
  const x = footX - barW / 2
  const y = footY - spriteH * 1.05 - 12

  ctx.save()
  ctx.globalAlpha = alpha

  ctx.fillStyle = 'rgba(8, 12, 20, 0.8)'
  ctx.fillRect(x - 2, y - 2, barW + 4, barH + 4)

  ctx.fillStyle = 'rgba(35, 40, 52, 0.95)'
  ctx.fillRect(x, y, barW, barH)

  const hpRatio = Math.max(0, Math.min(1, hp / maxHp))
  if (hpRatio > 0) {
    ctx.fillStyle = variant === 'player' ? '#22c55e' : '#dc2626'
    ctx.fillRect(x, y, barW * hpRatio, barH)
  }

  if (shield > 0 && variant === 'player') {
    const shieldRatio = Math.min(Math.max(0, 1 - hpRatio), shield / maxHp)
    if (shieldRatio > 0) {
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(x + barW * hpRatio, y, barW * shieldRatio, barH)
    }
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, barW - 1, barH - 1)

  const label =
    shield > 0 && variant === 'player' ? `${hp}+${shield}` : `${Math.max(0, hp)}/${maxHp}`
  ctx.font = 'bold 8px ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#f8fafc'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)'
  ctx.shadowBlur = 3
  ctx.fillText(label, footX, y + barH / 2 + 0.5)

  ctx.restore()
}

export function AdventureCombatCanvas({
  state,
  copy,
  onStateChange,
  onExit,
}: AdventureCombatCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewportRef = useRef<Viewport>({ originX: 0, originY: 0, scale: 1 })
  const spritesRef = useRef<AdventureSprites | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const moveRef = useRef<CombatMoveAnim>({
    grid: { ...state.playerPos },
    target: { ...state.playerPos },
    path: [],
    moving: false,
    t0: 0,
    direction: DEFAULT_CHARACTER_DIRECTION,
    pendingGoal: null,
  })

  useEffect(() => {
    if (!moveRef.current.moving) {
      moveRef.current.grid = { ...state.playerPos }
      moveRef.current.target = { ...state.playerPos }
    }
  }, [state.playerPos])

  useEffect(() => {
    loadAdventureSprites().then((s) => {
      spritesRef.current = s
    })
    loadFireballVfxFrames().catch(() => {
      // Procedural fallback in spell-vfx.ts
    })
  }, [])

  useEffect(() => {
    if (state.phase !== 'enemy' || state.result) return

    const s = stateRef.current
    let delay = 650
    if (isCombatVfxPlaying(s) && s.vfx) {
      delay = Math.max(
        spellVfxDuration(s.vfx.spellId) - (performance.now() - s.vfx.startedAt) + 80,
        200,
      )
    }
    if (isCombatAttackPlaying(s)) {
      delay = Math.max(
        delay,
        ATTACK_ANIM_MS - (performance.now() - (s.attackAnim?.startedAt ?? 0)) + 120,
      )
    }

    const timer = window.setTimeout(() => {
      onStateChange(runEnemyTurn(stateRef.current))
    }, delay)
    return () => window.clearTimeout(timer)
  }, [state.phase, state.result, onStateChange])

  useEffect(() => {
    if (state.result) {
      const timer = window.setTimeout(() => onExit(state.result!), 1200)
      return () => window.clearTimeout(timer)
    }
  }, [state.result, onExit])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const cells: GridPos[] = []
    for (let y = 0; y < COMBAT_ROWS; y++) {
      for (let x = 0; x < COMBAT_COLS; x++) cells.push({ x, y })
    }
    const drawOrder = sortDrawOrder(cells)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = parent.clientWidth * dpr
      canvas.height = parent.clientHeight * dpr
      canvas.style.width = `${parent.clientWidth}px`
      canvas.style.height = `${parent.clientHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    resize()

    const beginStep = (next: GridPos) => {
      const m = moveRef.current
      const dx = next.x - m.grid.x
      const dy = next.y - m.grid.y
      if (dx !== 0 || dy !== 0) m.direction = movementDirection(dx, dy)
      m.target = next
      m.t0 = performance.now()
      m.moving = true
    }

    const onClick = (e: MouseEvent) => {
      const sprites = spritesRef.current
      const s = stateRef.current
      if (
        !sprites ||
        s.phase !== 'player' ||
        s.result ||
        s.vfx ||
        s.attackAnim ||
        moveRef.current.moving
      ) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const mapX =
        (e.clientX - rect.left - viewportRef.current.originX) /
        viewportRef.current.scale
      const mapY =
        (e.clientY - rect.top - viewportRef.current.originY) /
        viewportRef.current.scale

      const goal = pickCellAtMapPoint(
        mapX,
        mapY,
        COMBAT_COLS,
        COMBAT_ROWS,
        (x, y) => isCombatWalkable(x, y),
        sprites.cellW,
        sprites.cellHalfH,
      )
      if (!goal) return

      if (s.selectedSpellId) {
        const spell = getSpell(s.selectedSpellId)
        if (spell?.kind === 'attack') {
          if (
            goal.x === s.enemyPos.x &&
            goal.y === s.enemyPos.y &&
            canTargetEnemyWithSpell(s.playerPos, s.enemyPos, spell.range)
          ) {
            onStateChange(castCombatSpell(s, s.selectedSpellId, goal))
          }
          return
        }
      }

      if (goal.x === s.enemyPos.x && goal.y === s.enemyPos.y) {
        if (manhattan(s.playerPos, goal) === 1) {
          onStateChange(castCombatSpell(s, 'strike', goal))
        }
        return
      }

      const path = findPath(s.playerPos, goal, (x, y) =>
        isCombatWalkable(x, y) && !(x === s.enemyPos.x && y === s.enemyPos.y),
      )
      if (path.length === 0 || path.length > s.movesLeft) return

      moveRef.current.pendingGoal = goal
      moveRef.current.path = path.slice(1)
      beginStep(path[0]!)
    }

    canvas.addEventListener('click', onClick)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const sprites = spritesRef.current
      const s = stateRef.current
      if (!sprites) return

      const w = canvas.clientWidth
      const h = canvas.clientHeight

      const mapBounds = computeMapBounds(
        COMBAT_COLS,
        COMBAT_ROWS,
        (x, y) => isCombatWalkable(x, y),
        sprites.cellW / 2,
        sprites.cellHalfH,
      )
      const padding = 48
      const scale =
        Math.min(
          (w - padding * 2) / mapBounds.width,
          (h - padding * 2 - 120) / mapBounds.height,
        ) * 1.05
      const originX = w / 2 - mapBounds.centerX * scale
      const originY = h / 2 - mapBounds.centerY * scale
      viewportRef.current = { originX, originY, scale }

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#1a1028'
      ctx.fillRect(0, 0, w, h)

      ctx.save()
      ctx.translate(originX, originY)
      ctx.scale(scale, scale)

      for (const { x, y } of drawOrder) {
        if (!isCombatWalkable(x, y)) continue
        const pos = gridToScreen(x, y, 0, 0, sprites.cellW, sprites.cellHalfH)
        drawProceduralStone(ctx, pos.x, pos.y, sprites.cellHalfH, (x * 5 + y * 3) % 4)
      }

      if (s.phase === 'player' && !s.selectedSpellId && s.movesLeft > 0 && !moveRef.current.moving) {
        const reachable = reachableCombatCells(s.playerPos, s.movesLeft, [s.enemyPos])
        for (const cell of reachable) {
          drawReachableHighlight(ctx, cell.x, cell.y, sprites)
        }
      }

      const selectedSpell = s.selectedSpellId ? getSpell(s.selectedSpellId) : null
      if (
        s.phase === 'player' &&
        selectedSpell?.kind === 'attack' &&
        selectedSpell.range > 1 &&
        !moveRef.current.moving
      ) {
        for (const cell of spellTargetCells(s.playerPos, selectedSpell.range)) {
          drawReachableHighlight(ctx, cell.x, cell.y, sprites, 'rgba(251, 146, 60, 0.16)')
        }
        if (canTargetEnemyWithSpell(s.playerPos, s.enemyPos, selectedSpell.range)) {
          drawReachableHighlight(ctx, s.enemyPos.x, s.enemyPos.y, sprites, 'rgba(239, 68, 68, 0.42)')
        }
      }

      const m = moveRef.current
      if (m.moving) {
        const stepProgress = Math.min((now - m.t0) / MOVE_MS, 1)
        if (stepProgress >= 1) {
          m.grid = { ...m.target }
          if (m.path.length > 0) {
            beginStep(m.path.shift()!)
          } else {
            m.moving = false
            const goal = m.pendingGoal
            m.pendingGoal = null
            if (goal) {
              onStateChange(moveCombatPlayer(stateRef.current, goal))
            }
          }
        }
      } else {
        m.grid = { ...s.playerPos }
        m.target = { ...s.playerPos }
      }

      const stepProgress = m.moving ? Math.min((now - m.t0) / MOVE_MS, 1) : 1
      const drawPx = m.moving ? lerp(m.grid.x, m.target.x, stepProgress) : s.playerPos.x
      const drawPy = m.moving ? lerp(m.grid.y, m.target.y, stepProgress) : s.playerPos.y
      const playerRow = characterSpriteRow(m.direction)

      const enemyDef = enemyById(s.enemyId)
      const enemySet: EnemySpriteSet = enemyDef?.spriteSet ?? 'goblin'
      const enemyBundle = sprites.enemySprites[enemySet]
      const enemyIdle = enemyBundle?.idle ?? []
      const enemyAttack = enemyBundle?.attack ?? []

      const playerAttacking =
        s.attackAnim?.actor === 'player' && isCombatAttackPlaying(s, now)
      const enemyAttacking =
        s.attackAnim?.actor === 'enemy' && isCombatAttackPlaying(s, now)

      let drawPlayerPos: GridPos = { x: drawPx, y: drawPy }
      let drawEnemyPos = s.enemyPos
      if (playerAttacking && s.attackAnim) {
        const progress = (now - s.attackAnim.startedAt) / ATTACK_ANIM_MS
        drawPlayerPos = lerpPos(s.playerPos, s.enemyPos, attackLunge(progress) * 0.4)
      }
      if (enemyAttacking && s.attackAnim) {
        const progress = (now - s.attackAnim.startedAt) / ATTACK_ANIM_MS
        drawEnemyPos = lerpPos(s.enemyPos, s.playerPos, attackLunge(progress) * 0.4)
      }

      let enemyFrame =
        enemyIdle[Math.floor(now / 900) % Math.max(enemyIdle.length, 1)]
      if (enemyAttacking && enemyAttack.length > 0) {
        const atkIdx = Math.min(
          3,
          Math.floor(((now - (s.attackAnim?.startedAt ?? now)) / 90) % enemyAttack.length),
        )
        enemyFrame = enemyAttack[atkIdx] ?? enemyAttack[0]
      }

      const playerIdle = sprites.characterIdle[playerRow] ?? sprites.characterIdle[1] ?? []
      const playerRun = sprites.characterRun[playerRow] ?? sprites.characterRun[1] ?? []
      let playerFrame =
        playerIdle[Math.floor(now / 3183) % Math.max(playerIdle.length, 1)]
      if (m.moving) {
        const runIdx = Math.floor(now / 120) % Math.max(playerRun.length, 1)
        playerFrame = playerRun[runIdx] ?? playerIdle[0] ?? playerFrame
      } else if (playerAttacking) {
        const runIdx = Math.min(
          3,
          Math.floor(((now - (s.attackAnim?.startedAt ?? now)) / 85) % Math.max(playerRun.length, 1)),
        )
        playerFrame = playerRun[runIdx] ?? playerIdle[0] ?? playerFrame
      }

      const drawEntity = (
        pos: GridPos,
        img: HTMLImageElement | undefined,
        alpha?: number,
      ) => {
        if (!img) return
        const screen = gridToScreen(pos.x, pos.y, 0, 0, sprites.cellW, sprites.cellHalfH)
        const footY = screen.y + sprites.cellHalfH
        if (alpha !== undefined && alpha < 1) {
          drawTintedSprite(ctx, img, screen.x, footY, sprites.cellW, alpha)
        } else {
          drawCharacter(ctx, screen.x, footY, sprites, img)
        }
      }

      const enemyAlpha = s.enemyAlpha

      const playerZ = drawPx + drawPy
      const enemyZ = s.enemyPos.x + s.enemyPos.y

      if (enemyZ <= playerZ) {
        drawEntity(drawEnemyPos, enemyFrame, enemyAlpha)
      }
      if (playerFrame) {
        drawEntity(drawPlayerPos, playerFrame)
      }
      if (enemyZ > playerZ) {
        drawEntity(drawEnemyPos, enemyFrame, enemyAlpha)
      }

      drawHealthBar(
        ctx,
        drawPlayerPos,
        sprites,
        s.playerHp,
        s.playerMaxHp,
        'player',
        1,
        s.playerShield,
      )
      drawHealthBar(
        ctx,
        drawEnemyPos,
        sprites,
        s.enemyHp,
        s.enemyMaxHp,
        'enemy',
        enemyAlpha ?? 1,
      )

      if (s.vfx) {
        drawSpellVfx(ctx, s.vfx, now, sprites.cellW, sprites.cellHalfH)
      }

      ctx.restore()
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('click', onClick)
    }
  }, [onStateChange])

  const selectedSpell = state.selectedSpellId ? getSpell(state.selectedSpellId) : null

  return (
    <div className="adventure-combat">
      <canvas ref={canvasRef} className="adventure-canvas adventure-combat__canvas" aria-label="Combat arena" />
      <div className="adventure-combat-overlay">
        <div className="adventure-combat-overlay__top">
          <ul className="adventure-combat-log">
            {state.log.slice(-4).map((line, i) => (
              <li key={`${line}-${i}`}>{line}</li>
            ))}
          </ul>
          <p className="adventure-combat-moves">
            {copy.movesLeft}: <strong>{state.movesLeft}</strong>
          </p>
        </div>
        {selectedSpell?.kind === 'attack' ? (
          <p className="adventure-combat-hint">
            {selectedSpell.range > 1 ? copy.selectRangedTarget : copy.selectTarget}
          </p>
        ) : null}
      </div>
    </div>
  )
}
