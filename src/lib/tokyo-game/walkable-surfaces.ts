import * as THREE from 'three'
import type { StreetWalkContext } from '@/lib/tokyo-game/collision'
import type { WalkBounds } from '@/lib/tokyo-game/littlest-tokyo'

const _normalMatrix = new THREE.Matrix3()
const _worldNormal = new THREE.Vector3()
const MAX_NAV_CELLS = 6_000

/** Road/sidewalk ground meshes in the official Littlest Tokyo GLB. */
export function isStreetMesh(mesh: THREE.Mesh): boolean {
  return /^Plane\d/i.test(mesh.name)
}

export function collectStreetMeshes(root: THREE.Object3D): THREE.Mesh[] {
  const streets: THREE.Mesh[] = []
  root.traverse((child) => {
    if (child instanceof THREE.Mesh && isStreetMesh(child)) {
      streets.push(child)
    }
  })
  return streets
}

function meshWorldNormalY(hit: THREE.Intersection): number {
  if (!hit.face) return 0
  _normalMatrix.getNormalMatrix(hit.object.matrixWorld)
  _worldNormal.copy(hit.face.normal).applyMatrix3(_normalMatrix).normalize()
  return _worldNormal.y
}

export function computeStreetBounds(streets: THREE.Mesh[]): WalkBounds {
  const box = new THREE.Box3()
  for (const mesh of streets) {
    box.union(new THREE.Box3().setFromObject(mesh))
  }
  const inset = 0.003
  return {
    minX: box.min.x + inset,
    maxX: box.max.x - inset,
    minZ: box.min.z + inset,
    maxZ: box.max.z - inset,
  }
}

export type StreetNavCell = {
  y: number
}

export type StreetNavGrid = {
  bounds: WalkBounds
  cellSize: number
  cols: number
  rows: number
  cells: (StreetNavCell | null)[]
  streetSet: Set<THREE.Object3D>
}

export function raycastStreetY(
  x: number,
  z: number,
  ctx: StreetWalkContext,
  raycaster: THREE.Raycaster,
): number | null {
  raycaster.set(new THREE.Vector3(x, 5, z), new THREE.Vector3(0, -1, 0))
  const hits = raycaster.intersectObjects(ctx.streets, true)

  for (const hit of hits) {
    if (meshWorldNormalY(hit) >= 0.45) return hit.point.y
  }
  return null
}

function pickCellSize(bounds: WalkBounds, requested: number): number {
  let cellSize = requested
  const spanX = bounds.maxX - bounds.minX
  const spanZ = bounds.maxZ - bounds.minZ

  for (let i = 0; i < 8; i++) {
    const cols = Math.ceil(spanX / cellSize)
    const rows = Math.ceil(spanZ / cellSize)
    if (cols * rows <= MAX_NAV_CELLS) return cellSize
    cellSize *= 1.35
  }
  return cellSize
}

/** Pre-bake walkable road cells from Plane* geometry. */
export function bakeStreetNavGrid(
  ctx: StreetWalkContext,
  raycaster: THREE.Raycaster,
  requestedCellSize = 0.012,
): StreetNavGrid {
  const bounds = computeStreetBounds(ctx.streets as THREE.Mesh[])
  const cellSize = pickCellSize(bounds, requestedCellSize)
  const cols = Math.ceil((bounds.maxX - bounds.minX) / cellSize)
  const rows = Math.ceil((bounds.maxZ - bounds.minZ) / cellSize)
  const cells: (StreetNavCell | null)[] = new Array(cols * rows).fill(null)

  for (const mesh of ctx.streets) {
    if (!(mesh instanceof THREE.Mesh)) continue
    const box = new THREE.Box3().setFromObject(mesh)
    const minCol = Math.max(0, Math.floor((box.min.x - bounds.minX) / cellSize))
    const maxCol = Math.min(cols - 1, Math.floor((box.max.x - bounds.minX) / cellSize))
    const minRow = Math.max(0, Math.floor((box.min.z - bounds.minZ) / cellSize))
    const maxRow = Math.min(rows - 1, Math.floor((box.max.z - bounds.minZ) / cellSize))

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const idx = row * cols + col
        if (cells[idx]) continue
        const x = bounds.minX + (col + 0.5) * cellSize
        const z = bounds.minZ + (row + 0.5) * cellSize
        const y = raycastStreetY(x, z, ctx, raycaster)
        if (y !== null) cells[idx] = { y }
      }
    }
  }

  return {
    bounds,
    cellSize,
    cols,
    rows,
    cells,
    streetSet: new Set<THREE.Object3D>(ctx.streets),
  }
}

export function navCellAt(
  nav: StreetNavGrid,
  x: number,
  z: number,
): StreetNavCell | null {
  const col = Math.floor((x - nav.bounds.minX) / nav.cellSize)
  const row = Math.floor((z - nav.bounds.minZ) / nav.cellSize)
  if (col < 0 || row < 0 || col >= nav.cols || row >= nav.rows) return null
  return nav.cells[row * nav.cols + col] ?? null
}

export function findStreetSpawn(
  nav: StreetNavGrid,
): { x: number; z: number; y: number } {
  let bestCol = 0
  let bestRow = 0
  let bestScore = -1

  for (let row = 0; row < nav.rows; row++) {
    for (let col = 0; col < nav.cols; col++) {
      if (!nav.cells[row * nav.cols + col]) continue
      let neighbors = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = row + dr
          const nc = col + dc
          if (nr < 0 || nc < 0 || nr >= nav.rows || nc >= nav.cols) continue
          if (nav.cells[nr * nav.cols + nc]) neighbors++
        }
      }
      if (neighbors > bestScore) {
        bestScore = neighbors
        bestRow = row
        bestCol = col
      }
    }
  }

  const x = nav.bounds.minX + (bestCol + 0.5) * nav.cellSize
  const z = nav.bounds.minZ + (bestRow + 0.5) * nav.cellSize
  const cell = nav.cells[bestRow * nav.cols + bestCol]
  return { x, z, y: cell?.y ?? 0 }
}

/** One merged mesh — built lazily on first toggle to avoid OOM at load. */
export function createStreetDebugHolder(model: THREE.Object3D): THREE.Group {
  const group = new THREE.Group()
  group.name = 'street-debug'
  group.visible = false
  model.add(group)
  return group
}

export function buildStreetDebugMesh(
  nav: StreetNavGrid,
  model: THREE.Object3D,
  holder: THREE.Group,
): void {
  if (holder.children.length > 0) return

  const half = nav.cellSize * 0.45
  const positions: number[] = []
  const worldPos = new THREE.Vector3()

  for (let row = 0; row < nav.rows; row++) {
    for (let col = 0; col < nav.cols; col++) {
      const cell = nav.cells[row * nav.cols + col]
      if (!cell) continue
      worldPos.set(
        nav.bounds.minX + (col + 0.5) * nav.cellSize,
        cell.y + 0.001,
        nav.bounds.minZ + (row + 0.5) * nav.cellSize,
      )
      model.worldToLocal(worldPos)
      const { x, y, z } = worldPos
      positions.push(
        x - half, y, z - half,
        x + half, y, z - half,
        x + half, y, z + half,
        x - half, y, z - half,
        x + half, y, z + half,
        x - half, y, z + half,
      )
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0x4df0ff,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    }),
  )
  mesh.renderOrder = 999
  holder.add(mesh)
}

export function toggleStreetDebug(
  nav: StreetNavGrid,
  model: THREE.Object3D,
  holder: THREE.Group,
): boolean {
  buildStreetDebugMesh(nav, model, holder)
  holder.visible = !holder.visible
  return holder.visible
}
