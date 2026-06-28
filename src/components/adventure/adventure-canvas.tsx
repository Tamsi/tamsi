'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AdventureMapArrows } from '@/components/adventure/adventure-map-arrows'
import { pickGrassId } from '@/lib/adventure/dofus-assets'
import { dungeonDepth, type MapId } from '@/lib/adventure/maps'
import { enemyForMap } from '@/lib/adventure/enemies'
import { drawProceduralGrass, drawProceduralStone } from '@/lib/adventure/grass-tile'
import {
  cellCenter,
  characterSpriteRow,
  computeMapBounds,
  DEFAULT_CHARACTER_DIRECTION,
  gridToScreen,
  lerp,
  movementDirection,
  pickCellAtMapPoint,
  sortDrawOrder,
} from '@/lib/adventure/isometric'
import { getMapDefinition } from '@/lib/adventure/maps'
import { findPath, findNearestWalkable } from '@/lib/adventure/pathfinding'
import { scrollAtCell, TUTORIAL_SCROLL_ID } from '@/lib/adventure/scrolls'
import {
  loadAdventureSprites,
  type AdventureSprites,
} from '@/lib/adventure/sprites'
import {
  findSpawn,
  getTransition,
  isNpcCell,
  isWalkable,
  mapSize,
  tileAt,
} from '@/lib/adventure/world-map'
import type { GridPos } from '@/lib/adventure/types'

const MOVE_MS = 140
const IDLE_FRAME_DURATIONS_MS = [3183, 3183, 450, 3184] as const
const IDLE_LOOP_MS = IDLE_FRAME_DURATIONS_MS.reduce((sum, ms) => sum + ms, 0)
const IDLE_ANIMATION_ROW = 1
const NPC_IDLE_FRAME_MS = 900

function idleFrameIndex(now: number): number {
  const t = now % IDLE_LOOP_MS
  let elapsed = 0
  for (let i = 0; i < IDLE_FRAME_DURATIONS_MS.length; i++) {
    elapsed += IDLE_FRAME_DURATIONS_MS[i]
    if (t < elapsed) return i
  }
  return 0
}

function playerDisplayHeight(cellW: number): number {
  return cellW * (1.3 / 1.2)
}

type Viewport = { originX: number; originY: number; scale: number }

type WorldState = {
  mapId: MapId
  mainQuestAccepted: boolean
  tutorialComplete: boolean
  collectedScrollIds: string[]
  defeatedEnemyIds: string[]
}

type AdventureCanvasProps = {
  mapId: MapId
  onNpcInteract: () => void
  mainQuestAccepted: boolean
  tutorialComplete: boolean
  collectedScrollIds: string[]
  defeatedEnemyIds: string[]
  onScrollPickup: (scrollId: string) => void
  onMapChange: (mapId: MapId) => void
  onEnemyEngage: (enemyId: string) => void
  transitionLockedHint: string
}

function drawFloorTile(
  ctx: CanvasRenderingContext2D,
  mapId: MapId,
  x: number,
  y: number,
  sprites: AdventureSprites,
) {
  const kind = tileAt(mapId, x, y)
  const { x: sx, y: sy } = gridToScreen(x, y, 0, 0, sprites.cellW, sprites.cellHalfH)

  if (kind === 'stone') {
    drawProceduralStone(ctx, sx, sy, sprites.cellHalfH, (x * 7 + y * 13) % 4)
    return
  }

  if (sprites.source === 'procedural') {
    drawProceduralGrass(ctx, sx, sy, sprites.cellHalfH, (x * 7 + y * 13) % 4)
    return
  }

  if (sprites.source === 'dofus') {
    const id = pickGrassId(x, y)
    const img = sprites.grassTiles.get(id)
    const meta = sprites.grassMeta[String(id)]
    if (img) {
      if (meta) ctx.drawImage(img, sx + meta.x, sy + meta.y)
      else ctx.drawImage(img, sx - img.width / 2, sy + sprites.cellHalfH - img.height)
    }
  }
}

type CharacterDrawOptions = {
  alpha?: number
}

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  footX: number,
  footY: number,
  sprites: AdventureSprites,
  img: HTMLImageElement,
  options?: CharacterDrawOptions,
) {
  const targetH = playerDisplayHeight(sprites.cellW)
  const scale = targetH / img.height
  const w = img.width * scale
  const h = img.height * scale
  ctx.save()
  if (options?.alpha !== undefined) ctx.globalAlpha = options.alpha
  ctx.drawImage(img, footX - w / 2, footY - h * 0.98, w, h)
  ctx.restore()
}

function drawQuestMarker(
  ctx: CanvasRenderingContext2D,
  footX: number,
  footY: number,
  sprites: AdventureSprites,
  label = '!',
) {
  const h = playerDisplayHeight(sprites.cellW)
  const y = footY - h * 1.05
  ctx.save()
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(footX, y, 9, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1a1208'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, footX, y + 0.5)
  ctx.restore()
}

function drawScroll(
  ctx: CanvasRenderingContext2D,
  footX: number,
  footY: number,
  sprites: AdventureSprites,
  pulse: number,
) {
  const bob = Math.sin(pulse * 0.003) * 3
  const w = sprites.cellW * 0.32
  const h = w * 1.25
  const baseY = footY + sprites.cellHalfH * 0.25 + bob
  ctx.save()
  ctx.translate(footX, baseY)
  ctx.rotate(-0.12)
  ctx.globalAlpha = 0.35 + Math.sin(pulse * 0.004) * 0.15
  ctx.fillStyle = '#fde68a'
  ctx.beginPath()
  ctx.ellipse(0, -h * 0.45, w * 0.75, h * 0.35, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.fillStyle = '#f4e4bc'
  ctx.strokeStyle = '#8b6914'
  ctx.lineWidth = 1.5
  ctx.fillRect(-w / 2, -h, w, h)
  ctx.strokeRect(-w / 2, -h, w, h)
  ctx.restore()
}

export function AdventureCanvas({
  mapId,
  onNpcInteract,
  onScrollPickup,
  onMapChange,
  onEnemyEngage,
  mainQuestAccepted,
  tutorialComplete,
  collectedScrollIds,
  defeatedEnemyIds,
  transitionLockedHint,
}: AdventureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewportRef = useRef<Viewport>({ originX: 0, originY: 0, scale: 1 })
  const spritesRef = useRef<AdventureSprites | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const stateRef = useRef({
    grid: findSpawn(mapId),
    target: findSpawn(mapId),
    path: [] as GridPos[],
    t0: 0,
    moving: false,
    direction: DEFAULT_CHARACTER_DIRECTION,
  })

  const worldRef = useRef<WorldState>({
    mapId,
    mainQuestAccepted,
    tutorialComplete,
    collectedScrollIds,
    defeatedEnemyIds,
  })
  const callbacksRef = useRef({ onNpcInteract, onScrollPickup, onMapChange, onEnemyEngage })
  const pendingNavRef = useRef<'left' | 'right' | null>(null)

  const handleArrowNavigate = useCallback((direction: 'left' | 'right') => {
    pendingNavRef.current = direction
  }, [])
  worldRef.current = {
    mapId,
    mainQuestAccepted,
    tutorialComplete,
    collectedScrollIds,
    defeatedEnemyIds,
  }
  callbacksRef.current = { onNpcInteract, onScrollPickup, onMapChange, onEnemyEngage }

  useEffect(() => {
    const spawn = findSpawn(mapId)
    stateRef.current = {
      grid: spawn,
      target: spawn,
      path: [],
      t0: 0,
      moving: false,
      direction: DEFAULT_CHARACTER_DIRECTION,
    }
  }, [mapId])

  useEffect(() => {
    loadAdventureSprites()
      .then((sprites) => {
        spritesRef.current = sprites
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    if (status !== 'ready') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0

    const getMapId = () => worldRef.current.mapId
    const { cols, rows } = mapSize(getMapId())

    const isScrollVisibleAt = (x: number, y: number): boolean => {
      const w = worldRef.current
      if (!w.mainQuestAccepted) return false
      const scroll = scrollAtCell(x, y, w.mapId)
      if (!scroll) return false
      if (w.collectedScrollIds.includes(scroll.id)) return false
      if (scroll.guardedByEnemyId && !w.defeatedEnemyIds.includes(scroll.guardedByEnemyId)) {
        return false
      }
      if (scroll.id !== TUTORIAL_SCROLL_ID && !w.tutorialComplete) return false
      return true
    }

    const isEnemyVisibleAt = (x: number, y: number): boolean => {
      const w = worldRef.current
      if (!w.tutorialComplete) return false
      const depth = dungeonDepth(w.mapId)
      const enemy = enemyForMap(w.mapId, depth)
      if (!enemy) return false
      if (w.defeatedEnemyIds.includes(enemy.id)) return false
      return enemy.position.x === x && enemy.position.y === y
    }

    const tryPickupAtGrid = (grid: GridPos) => {
      const w = worldRef.current
      if (!w.mainQuestAccepted) return
      const scroll = scrollAtCell(grid.x, grid.y, w.mapId)
      if (!scroll || w.collectedScrollIds.includes(scroll.id)) return
      if (scroll.guardedByEnemyId && !w.defeatedEnemyIds.includes(scroll.guardedByEnemyId)) return
      callbacksRef.current.onScrollPickup(scroll.id)
    }

    const canUseTransition = (targetMapId: MapId): boolean => {
      const w = worldRef.current
      if (targetMapId !== 'entrance' && !w.tutorialComplete) return false
      return true
    }

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
      const s = stateRef.current
      const dx = next.x - s.grid.x
      const dy = next.y - s.grid.y
      if (dx !== 0 || dy !== 0) s.direction = movementDirection(dx, dy)
      s.target = next
      s.t0 = performance.now()
      s.moving = true
    }

    const startPath = (path: GridPos[]) => {
      if (path.length === 0) return
      const s = stateRef.current
      if (s.moving) s.grid = { ...s.target }
      s.path = path.slice(1)
      beginStep(path[0])
    }

    const playerGrid = (): GridPos => {
      const s = stateRef.current
      return s.moving ? s.target : s.grid
    }

    const walkToCell = (goal: GridPos) => {
      const mid = getMapId()
      const from = playerGrid()
      if (from.x === goal.x && from.y === goal.y) return true

      const canWalkTo = (x: number, y: number) =>
        isWalkable(mid, x, y) || Boolean(getTransition(mid, x, y))

      let path = findPath(from, goal, canWalkTo)
      if (path.length === 0) {
        const { cols, rows } = mapSize(mid)
        const nearest = findNearestWalkable(
          goal,
          (x, y) => isWalkable(mid, x, y),
          (x, y) => x >= 0 && y >= 0 && x < cols && y < rows,
        )
        if (nearest) path = findPath(from, nearest, canWalkTo)
      }
      if (path.length === 0) return false
      startPath(path)
      return true
    }

    const walkToTransition = (direction: 'left' | 'right') => {
      const mid = getMapId()
      const mapDef = getMapDefinition(mid)
      const tr = mapDef.transitions.find((t) => t.direction === direction)
      if (!tr || !canUseTransition(tr.targetMapId)) return
      if (stateRef.current.moving) return

      const from = playerGrid()
      if (from.x === tr.position.x && from.y === tr.position.y) {
        callbacksRef.current.onMapChange(tr.targetMapId)
        return
      }

      walkToCell(tr.position)
    }

    const onClick = (e: MouseEvent) => {
      const sprites = spritesRef.current
      if (!sprites) return
      const mid = getMapId()
      const { cols: c, rows: r } = mapSize(mid)
      const walkable = (x: number, y: number) =>
        isWalkable(mid, x, y) || isScrollVisibleAt(x, y) || isNpcCell(mid, x, y)

      const rect = canvas.getBoundingClientRect()
      const mapX =
        (e.clientX - rect.left - viewportRef.current.originX) / viewportRef.current.scale
      const mapY =
        (e.clientY - rect.top - viewportRef.current.originY) / viewportRef.current.scale

      const mapDef = getMapDefinition(mid)
      if (mapDef.npcPosition) {
        const npcCenter = cellCenter(
          mapDef.npcPosition.x,
          mapDef.npcPosition.y,
          sprites.cellW,
          sprites.cellHalfH,
        )
        const npcHitRadius = sprites.cellW * 0.52
        if (
          (mapX - npcCenter.x) ** 2 + (mapY - npcCenter.y) ** 2 <=
          npcHitRadius ** 2
        ) {
          callbacksRef.current.onNpcInteract()
          return
        }
      }

      const goal = pickCellAtMapPoint(
        mapX,
        mapY,
        c,
        r,
        (x, y) =>
          isScrollVisibleAt(x, y) ||
          isEnemyVisibleAt(x, y) ||
          walkable(x, y) ||
          Boolean(getTransition(mid, x, y)),
        sprites.cellW,
        sprites.cellHalfH,
      )
      if (!goal) return

      if (isNpcCell(mid, goal.x, goal.y)) {
        callbacksRef.current.onNpcInteract()
        return
      }

      const transition = getTransition(mid, goal.x, goal.y)
      if (transition && canUseTransition(transition.targetMapId)) {
        const from = playerGrid()
        if (from.x === goal.x && from.y === goal.y) {
          callbacksRef.current.onMapChange(transition.targetMapId)
        } else {
          walkToCell(goal)
        }
        return
      }

      if (isEnemyVisibleAt(goal.x, goal.y)) {
        const depth = dungeonDepth(mid)
        const enemy = enemyForMap(mid, depth)
        if (enemy) callbacksRef.current.onEnemyEngage(enemy.id)
        return
      }

      if (isScrollVisibleAt(goal.x, goal.y)) {
        const here = playerGrid()
        if (here.x === goal.x && here.y === goal.y) {
          tryPickupAtGrid(goal)
          return
        }
        const path = findPath(here, goal, (x, y) => isWalkable(mid, x, y))
        if (path.length === 0) return
        startPath(path)
        return
      }

      const from = playerGrid()
      const path = findPath(from, goal, (x, y) => isWalkable(mid, x, y))
      if (path.length === 0) return
      startPath(path)
    }

    canvas.addEventListener('click', onClick)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const sprites = spritesRef.current
      if (!sprites) return

      const mid = getMapId()
      const { cols: c, rows: r } = mapSize(mid)
      const cells: GridPos[] = []
      for (let y = 0; y < r; y++) {
        for (let x = 0; x < c; x++) cells.push({ x, y })
      }
      const drawOrder = sortDrawOrder(cells)

      const s = stateRef.current

      if (pendingNavRef.current && !s.moving) {
        const direction = pendingNavRef.current
        pendingNavRef.current = null
        walkToTransition(direction)
      }

      let px = s.grid.x
      let py = s.grid.y
      let stepProgress = 0
      if (s.moving) {
        stepProgress = Math.min((now - s.t0) / MOVE_MS, 1)
        px = lerp(s.grid.x, s.target.x, stepProgress)
        py = lerp(s.grid.y, s.target.y, stepProgress)
        if (stepProgress >= 1) {
          s.grid = { ...s.target }
          tryPickupAtGrid(s.grid)
          const tr = getTransition(mid, s.grid.x, s.grid.y)
          if (tr && canUseTransition(tr.targetMapId)) {
            callbacksRef.current.onMapChange(tr.targetMapId)
          } else if (s.path.length > 0) beginStep(s.path.shift()!)
          else s.moving = false
        }
      }

      const spriteRow = characterSpriteRow(s.direction)
      const runFrames = sprites.characterRun[spriteRow] ?? sprites.characterRun[1] ?? []
      const idleFrames = sprites.characterIdle[IDLE_ANIMATION_ROW] ?? []
      let sprite: HTMLImageElement | undefined
      if (s.moving && runFrames.length > 0) {
        sprite = runFrames[Math.min(Math.floor(stepProgress * runFrames.length), runFrames.length - 1)]
      } else if (idleFrames.length > 0) {
        sprite = idleFrames[idleFrameIndex(now)]
      }

      const mapBounds = computeMapBounds(
        c,
        r,
        (x, y) => tileAt(mid, x, y) !== 'void',
        sprites.cellW / 2,
        sprites.cellHalfH,
      )

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const padding = 32
      const scale =
        Math.min((w - padding * 2) / mapBounds.width, (h - padding * 2) / mapBounds.height) * 1.05
      viewportRef.current = {
        originX: w / 2 - mapBounds.centerX * scale,
        originY: h / 2 - mapBounds.centerY * scale,
        scale,
      }

      ctx.clearRect(0, 0, w, h)
      if (mid.startsWith('dungeon-')) {
        ctx.fillStyle = '#1e1a16'
        ctx.fillRect(0, 0, w, h)
      }
      ctx.save()
      ctx.translate(viewportRef.current.originX, viewportRef.current.originY)
      ctx.scale(scale, scale)

      for (const { x, y } of drawOrder) {
        if (tileAt(mid, x, y) === 'void') continue
        drawFloorTile(ctx, mid, x, y, sprites)

        if (isScrollVisibleAt(x, y)) {
          const pos = gridToScreen(x, y, 0, 0, sprites.cellW, sprites.cellHalfH)
          drawScroll(ctx, pos.x, pos.y + sprites.cellHalfH, sprites, now)
        }
      }

      const mapDef = getMapDefinition(mid)
      const depth = dungeonDepth(mid)
      const enemy = enemyForMap(mid, depth)
      const enemyVisible =
        enemy &&
        worldRef.current.tutorialComplete &&
        !worldRef.current.defeatedEnemyIds.includes(enemy.id)

      const npcPos = mapDef.npcPosition
      const npcFrames = sprites.npcIdle
      const npcSprite =
        npcFrames.length > 0
          ? npcFrames[Math.floor(now / NPC_IDLE_FRAME_MS) % npcFrames.length]
          : undefined

      type Drawable = { z: number; draw: () => void }
      const drawables: Drawable[] = []

      if (npcPos && npcSprite) {
        const pos = gridToScreen(npcPos.x, npcPos.y, 0, 0, sprites.cellW, sprites.cellHalfH)
        const footY = pos.y + sprites.cellHalfH
        drawables.push({
          z: npcPos.x + npcPos.y,
          draw: () => {
            drawCharacter(ctx, pos.x, footY, sprites, npcSprite)
            drawQuestMarker(ctx, pos.x, footY, sprites)
          },
        })
      }

      if (enemyVisible && enemy) {
        const frames = sprites.enemySprites[enemy.spriteSet]?.idle ?? []
        const enemyImg = frames[Math.floor(now / NPC_IDLE_FRAME_MS) % Math.max(frames.length, 1)]
        if (enemyImg) {
          const pos = gridToScreen(
            enemy.position.x,
            enemy.position.y,
            0,
            0,
            sprites.cellW,
            sprites.cellHalfH,
          )
          const footY = pos.y + sprites.cellHalfH
          drawables.push({
            z: enemy.position.x + enemy.position.y,
            draw: () => {
              drawCharacter(ctx, pos.x, footY, sprites, enemyImg, {
                alpha: enemy.alpha,
              })
              drawQuestMarker(ctx, pos.x, footY, sprites, '⚔')
            },
          })
        }
      }

      const playerPos = gridToScreen(px, py, 0, 0, sprites.cellW, sprites.cellHalfH)
      const playerFootY = playerPos.y + sprites.cellHalfH
      if (sprite) {
        drawables.push({
          z: px + py,
          draw: () => drawCharacter(ctx, playerPos.x, playerFootY, sprites, sprite!),
        })
      }

      drawables.sort((a, b) => a.z - b.z)
      for (const d of drawables) d.draw()

      ctx.restore()
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('click', onClick)
    }
  }, [status, mapId])

  return (
    <div className="adventure-map-shell">
      <canvas
        ref={canvasRef}
        className="adventure-canvas"
        data-status={status}
        aria-label="Isometric adventure map"
      />
      <AdventureMapArrows
        mapId={mapId}
        tutorialComplete={tutorialComplete}
        lockedHint={transitionLockedHint}
        onNavigate={handleArrowNavigate}
      />
    </div>
  )
}
