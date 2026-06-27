/** Procedural isometric grass tiles (Dofus cell footprint). */
export const GRASS_CELL_W = 53
export const GRASS_CELL_H = 27

type GrassShade = { top: string; left: string; right: string }

const VARIANTS: GrassShade[] = [
  { top: '#7ec85a', left: '#5fa842', right: '#8ed468' },
  { top: '#72bc52', left: '#56963c', right: '#84cc62' },
  { top: '#86cf64', left: '#68a84a', right: '#96d872' },
  { top: '#6bb34e', left: '#528e3a', right: '#7ec05c' },
]

function drawIsoGrassTile(
  ctx: CanvasRenderingContext2D,
  cx: number,
  footY: number,
  shade: GrassShade,
) {
  const hw = GRASS_CELL_W / 2
  const hh = GRASS_CELL_H / 2

  ctx.beginPath()
  ctx.moveTo(cx, footY - hh)
  ctx.lineTo(cx + hw, footY)
  ctx.lineTo(cx, footY + hh)
  ctx.lineTo(cx - hw, footY)
  ctx.closePath()
  ctx.fillStyle = shade.top
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(cx, footY + hh)
  ctx.lineTo(cx + hw, footY)
  ctx.lineTo(cx + hw, footY + 3)
  ctx.lineTo(cx, footY + hh + 3)
  ctx.closePath()
  ctx.fillStyle = shade.right
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(cx, footY + hh)
  ctx.lineTo(cx - hw, footY)
  ctx.lineTo(cx - hw, footY + 3)
  ctx.lineTo(cx, footY + hh + 3)
  ctx.closePath()
  ctx.fillStyle = shade.left
  ctx.fill()
}

export function createGrassTileImage(variant: number): HTMLImageElement {
  const pad = 4
  const canvas = document.createElement('canvas')
  canvas.width = GRASS_CELL_W + pad * 2
  canvas.height = GRASS_CELL_H + pad * 2 + 3
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')

  const cx = canvas.width / 2
  const footY = pad + GRASS_CELL_H / 2
  drawIsoGrassTile(ctx, cx, footY, VARIANTS[variant % VARIANTS.length])

  const img = new Image()
  img.src = canvas.toDataURL('image/png')
  return img
}

export function loadProceduralGrassTiles(): Promise<Map<number, HTMLImageElement>> {
  return Promise.all(
    VARIANTS.map(
      (_, i) =>
        new Promise<[number, HTMLImageElement]>((resolve, reject) => {
          const img = createGrassTileImage(i)
          img.onload = () => resolve([i, img])
          img.onerror = () => reject(new Error('Grass tile generation failed'))
        }),
    ),
  ).then((entries) => new Map(entries))
}

export function drawProceduralGrass(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  cellHalfH: number,
  variant: number,
) {
  const footY = sy + cellHalfH
  drawIsoGrassTile(ctx, sx, footY, VARIANTS[variant % VARIANTS.length])
}
