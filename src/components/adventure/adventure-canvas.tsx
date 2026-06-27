'use client'

import { useEffect, useRef, useState } from 'react'
import { pickGrassId } from '@/lib/adventure/dofus-assets'
import { drawProceduralGrass } from '@/lib/adventure/grass-tile'
import {
  characterSpriteRow,
  computeMapBounds,
  DEFAULT_CHARACTER_DIRECTION,
  gridToScreen,
  lerp,
  movementDirection,
  pickCellAtMapPoint,
  sortDrawOrder,
} from '@/lib/adventure/isometric'
import { findPath } from '@/lib/adventure/pathfinding'
import {
  loadAdventureSprites,
  type AdventureSprites,
} from '@/lib/adventure/sprites'
import {
  findSpawn,
  isWalkable,
  MAP_COLS,
  MAP_ROWS,
  tileAt,
} from '@/lib/adventure/world-map'
import type { GridPos } from '@/lib/adventure/types'

const MOVE_MS = 140
/** idle_1_0 → idle_1_1 → idle_1_2 (450ms) → idle_1_3 — 10s total loop. */
const IDLE_FRAME_DURATIONS_MS = [3183, 3183, 450, 3184] as const
const IDLE_LOOP_MS = IDLE_FRAME_DURATIONS_MS.reduce((sum, ms) => sum + ms, 0)
/** Single shared idle loop: idle_1_0 → idle_1_3 (SW row). */
const IDLE_ANIMATION_ROW = 1

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

type Viewport = {
  originX: number
  originY: number
  scale: number
}

function drawGrassTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sprites: AdventureSprites,
) {
  const { x: sx, y: sy } = gridToScreen(
    x,
    y,
    0,
    0,
    sprites.cellW,
    sprites.cellHalfH,
  )

  if (sprites.source === 'procedural') {
    const variant = (x * 7 + y * 13) % 4
    drawProceduralGrass(ctx, sx, sy, sprites.cellHalfH, variant)
    return
  }

  if (sprites.source === 'dofus') {
    const id = pickGrassId(x, y)
    const img = sprites.grassTiles.get(id)
    const meta = sprites.grassMeta[String(id)]
    if (img) {
      if (meta) ctx.drawImage(img, sx + meta.x, sy + meta.y)
      else {
        ctx.drawImage(
          img,
          sx - img.width / 2,
          sy + sprites.cellHalfH - img.height,
        )
      }
      return
    }
  }
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


export function AdventureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewportRef = useRef<Viewport>({ originX: 0, originY: 0, scale: 1 })
  const spritesRef = useRef<AdventureSprites | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const stateRef = useRef({
    grid: findSpawn(),
    target: findSpawn(),
    path: [] as GridPos[],
    t0: 0,
    moving: false,
    direction: DEFAULT_CHARACTER_DIRECTION,
  })

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

    const cells: GridPos[] = []
    for (let y = 0; y < MAP_ROWS; y++) {
      for (let x = 0; x < MAP_COLS; x++) cells.push({ x, y })
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
      const s = stateRef.current
      const dx = next.x - s.grid.x
      const dy = next.y - s.grid.y
      if (dx !== 0 || dy !== 0) {
        s.direction = movementDirection(dx, dy)
      }
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

    const onClick = (e: MouseEvent) => {
      const sprites = spritesRef.current
      if (!sprites) return

      const rect = canvas.getBoundingClientRect()
      const mapX = (e.clientX - rect.left - viewportRef.current.originX) / viewportRef.current.scale
      const mapY = (e.clientY - rect.top - viewportRef.current.originY) / viewportRef.current.scale

      const goal = pickCellAtMapPoint(
        mapX,
        mapY,
        MAP_COLS,
        MAP_ROWS,
        isWalkable,
        sprites.cellW,
        sprites.cellHalfH,
      )
      if (!goal) return

      const s = stateRef.current
      const from = s.moving ? s.target : s.grid
      const path = findPath(from, goal, isWalkable)
      if (path.length === 0) return
      startPath(path)
    }

    canvas.addEventListener('click', onClick)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const sprites = spritesRef.current
      if (!sprites) return

      const s = stateRef.current
      let px = s.grid.x
      let py = s.grid.y
      let stepProgress = 0
      if (s.moving) {
        stepProgress = Math.min((now - s.t0) / MOVE_MS, 1)
        px = lerp(s.grid.x, s.target.x, stepProgress)
        py = lerp(s.grid.y, s.target.y, stepProgress)
        if (stepProgress >= 1) {
          s.grid = { ...s.target }
          if (s.path.length > 0) beginStep(s.path.shift()!)
          else s.moving = false
        }
      }

      const spriteRow = characterSpriteRow(s.direction)
      const runFrames =
        sprites.characterRun[spriteRow] ?? sprites.characterRun[1] ?? []
      const idleFrames = sprites.characterIdle[IDLE_ANIMATION_ROW] ?? []

      let sprite: HTMLImageElement | undefined
      if (s.moving && runFrames.length > 0) {
        const runFrame = Math.min(
          Math.floor(stepProgress * runFrames.length),
          runFrames.length - 1,
        )
        sprite = runFrames[runFrame]
      } else if (idleFrames.length > 0) {
        const idleFrame = idleFrameIndex(now)
        sprite = idleFrames[idleFrame]
      }

      const mapBounds = computeMapBounds(
        MAP_COLS,
        MAP_ROWS,
        (x, y) => tileAt(x, y) !== 'void',
        sprites.cellW / 2,
        sprites.cellHalfH,
      )

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const padding = 32
      const scale =
        Math.min(
          (w - padding * 2) / mapBounds.width,
          (h - padding * 2) / mapBounds.height,
        ) * 1.05
      const originX = w / 2 - mapBounds.centerX * scale
      const originY = h / 2 - mapBounds.centerY * scale
      viewportRef.current = { originX, originY, scale }

      ctx.clearRect(0, 0, w, h)
      ctx.save()
      ctx.translate(originX, originY)
      ctx.scale(scale, scale)

      for (const { x, y } of drawOrder) {
        if (tileAt(x, y) === 'void') continue
        drawGrassTile(ctx, x, y, sprites)
      }

      const playerPos = gridToScreen(
        px,
        py,
        0,
        0,
        sprites.cellW,
        sprites.cellHalfH,
      )
      const footX = playerPos.x
      const footY = playerPos.y + sprites.cellHalfH
      if (sprite) {
        drawCharacter(ctx, footX, footY, sprites, sprite)
      }

      ctx.restore()
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('click', onClick)
    }
  }, [status])

  return (
    <canvas
      ref={canvasRef}
      className="adventure-canvas"
      data-status={status}
      aria-label="Isometric adventure map"
    />
  )
}
