import { gridToScreen } from '@/lib/adventure/isometric'
import {
  fireballVfxFrameIndex,
  getFireballVfxFrames,
} from '@/lib/adventure/spell-vfx-sprites'
import type { GridPos } from '@/lib/adventure/types'

export type SpellVfx = {
  spellId: string
  from: GridPos
  to: GridPos
  startedAt: number
}

const VFX_DURATIONS: Record<string, number> = {
  strike: 420,
  fireball: 760,
  ward: 560,
  mend: 620,
  chainbolt: 540,
  bastion: 600,
}

export function spellVfxDuration(spellId: string): number {
  return VFX_DURATIONS[spellId] ?? 500
}

export function createSpellVfx(
  spellId: string,
  from: GridPos,
  to: GridPos,
  startedAt = performance.now(),
): SpellVfx {
  return { spellId, from, to, startedAt }
}

function cellFoot(
  pos: GridPos,
  cellW: number,
  cellHalfH: number,
): { x: number; y: number } {
  const screen = gridToScreen(pos.x, pos.y, 0, 0, cellW, cellHalfH)
  return { x: screen.x, y: screen.y + cellHalfH }
}

function easeOut(t: number): number {
  return 1 - (1 - t) ** 3
}

export function drawSpellVfx(
  ctx: CanvasRenderingContext2D,
  vfx: SpellVfx,
  now: number,
  cellW: number,
  cellHalfH: number,
): boolean {
  const duration = spellVfxDuration(vfx.spellId)
  const elapsed = now - vfx.startedAt
  if (elapsed >= duration) return false
  const t = easeOut(Math.min(elapsed / duration, 1))

  const from = cellFoot(vfx.from, cellW, cellHalfH)
  const to = cellFoot(vfx.to, cellW, cellHalfH)

  ctx.save()

  switch (vfx.spellId) {
    case 'strike': {
      const slashAngle = -0.35 + t * 0.9
      ctx.translate(to.x, to.y - 20)
      ctx.rotate(slashAngle)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * (1 - t * 0.6)})`
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(-22, -8)
      ctx.lineTo(18, 12)
      ctx.stroke()
      ctx.restore()
      ctx.save()
      ctx.fillStyle = `rgba(251, 191, 36, ${0.7 * (1 - t)})`
      ctx.beginPath()
      ctx.arc(to.x, to.y - 18, 12 + t * 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 * (1 - t)})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(to.x, to.y - 18, 8 + t * 10, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    case 'fireball': {
      const x = from.x + (to.x - from.x) * t
      const y = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 22
      const frames = getFireballVfxFrames()
      if (frames && frames.length > 0) {
        const frame = frames[fireballVfxFrameIndex(elapsed)]!
        const size = 48 + t * 8
        ctx.globalAlpha = 0.95
        ctx.drawImage(frame, x - size / 2, y - size / 2 - 8, size, size)
        ctx.globalAlpha = 1
      } else {
        const r = 8 + t * 4
        ctx.fillStyle = `rgba(251, 146, 60, ${0.35 * (1 - t * 0.5)})`
        ctx.beginPath()
        ctx.arc(x, y, r * 2.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fb923c'
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (t > 0.82) {
        const burst = (t - 0.82) / 0.18
        ctx.fillStyle = `rgba(253, 224, 71, ${burst * 0.85})`
        ctx.beginPath()
        ctx.arc(to.x, to.y - 16, 10 + burst * 22, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(239, 68, 68, ${burst * 0.5})`
        ctx.beginPath()
        ctx.arc(to.x, to.y - 16, 6 + burst * 16, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'chainbolt': {
      ctx.strokeStyle = `rgba(147, 197, 253, ${0.9 * (1 - t * 0.3)})`
      ctx.lineWidth = 2.5
      ctx.shadowColor = '#60a5fa'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(from.x, from.y - 20)
      const midX = from.x + (to.x - from.x) * 0.5 + Math.sin(t * 20) * 6
      const midY = from.y + (to.y - from.y) * 0.5 - 12
      ctx.lineTo(midX, midY)
      ctx.lineTo(to.x, to.y - 18)
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.fillStyle = `rgba(96, 165, 250, ${0.7 * (1 - t)})`
      ctx.beginPath()
      ctx.arc(to.x, to.y - 18, 8 + t * 10, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'ward':
    case 'bastion': {
      const radius = 18 + t * 22
      const alpha = vfx.spellId === 'bastion' ? 0.55 : 0.4
      ctx.strokeStyle = `rgba(77, 240, 255, ${alpha * (1 - t * 0.6)})`
      ctx.lineWidth = vfx.spellId === 'bastion' ? 4 : 2.5
      ctx.beginPath()
      ctx.arc(from.x, from.y - 20, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = `rgba(77, 240, 255, ${0.12 * (1 - t)})`
      ctx.fill()
      break
    }
    case 'mend': {
      for (let i = 0; i < 5; i++) {
        const phase = (t + i * 0.15) % 1
        const px = from.x + (i - 2) * 8
        const py = from.y - 10 - phase * 28
        ctx.fillStyle = `rgba(74, 222, 128, ${0.85 * (1 - phase)})`
        ctx.beginPath()
        ctx.arc(px, py, 3 + phase * 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = `rgba(134, 239, 172, ${0.35 * (1 - t)})`
      ctx.beginPath()
      ctx.arc(from.x, from.y - 20, 14 + t * 8, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    default:
      break
  }

  ctx.restore()
  return true
}
