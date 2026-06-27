import * as THREE from 'three'
import {
  isStreetWalkable,
  navCellAt,
  type StreetNavGrid,
} from '@/lib/tokyo-game/walkable-surfaces'

const _normalMatrix = new THREE.Matrix3()
const _worldNormal = new THREE.Vector3()

function meshWorldNormal(hit: THREE.Intersection): number {
  if (!hit.face) return 0
  _normalMatrix.getNormalMatrix(hit.object.matrixWorld)
  _worldNormal.copy(hit.face.normal).applyMatrix3(_normalMatrix).normalize()
  return _worldNormal.y
}

const BODY_HEIGHT = 0.012
const MAX_STEP = 0.035

export type StreetWalkContext = {
  streets: THREE.Object3D[]
  obstacles: THREE.Object3D
}

export type StreetWalkRuntime = {
  ctx: StreetWalkContext
  nav: StreetNavGrid
}

export function sampleStreetGroundInitial(
  x: number,
  z: number,
  runtime: StreetWalkRuntime,
  raycaster: THREE.Raycaster,
): number | null {
  const cell = navCellAt(runtime.nav, x, z)
  return cell?.y ?? null
}

export function hasWallBetween(
  fromX: number,
  fromZ: number,
  toX: number,
  toZ: number,
  bodyY: number,
  runtime: StreetWalkRuntime,
  raycaster: THREE.Raycaster,
  radius: number,
): boolean {
  const dx = toX - fromX
  const dz = toZ - fromZ
  const len = Math.hypot(dx, dz)
  if (len < 1e-5) return false

  const dir = new THREE.Vector3(dx / len, 0, dz / len)
  const samples = [
    [0, 0],
    [dir.z * radius, -dir.x * radius],
  ] as const

  for (const [ox, oz] of samples) {
    raycaster.set(
      new THREE.Vector3(fromX + ox, bodyY + BODY_HEIGHT, fromZ + oz),
      dir,
    )
    raycaster.far = len + radius * 0.2
    const hits = raycaster.intersectObject(runtime.ctx.obstacles, true)
    for (const hit of hits) {
      if (hit.distance > len + radius * 0.15) break
      if (runtime.nav.streetSet.has(hit.object)) continue
      if (meshWorldNormal(hit) < 0.3) return true
    }
  }

  return false
}

export type MoveResult = {
  x: number
  z: number
  y: number
}

function canStepTo(
  fromY: number,
  toX: number,
  toZ: number,
  nav: StreetNavGrid,
): StreetNavGrid['cells'][number] {
  const cell = navCellAt(nav, toX, toZ)
  if (!cell) return null
  if (Math.abs(cell.y - fromY) > MAX_STEP) return null
  return cell
}

export function tryMoveOnStreets(
  pos: { x: number; z: number; y: number },
  dx: number,
  dz: number,
  runtime: StreetWalkRuntime,
  raycaster: THREE.Raycaster,
  radius: number,
): MoveResult {
  let { x, z, y } = pos
  const { nav } = runtime

  const nextX = x + dx
  const cellX = canStepTo(y, nextX, z, nav)
  if (
    cellX &&
    !hasWallBetween(x, z, nextX, z, y, runtime, raycaster, radius)
  ) {
    x = nextX
    y = cellX.y
  }

  const nextZ = z + dz
  const cellZ = canStepTo(y, x, nextZ, nav)
  if (
    cellZ &&
    !hasWallBetween(x, z, x, nextZ, y, runtime, raycaster, radius)
  ) {
    z = nextZ
    y = cellZ.y
  }

  const ground = navCellAt(nav, x, z)
  if (ground) y = ground.y

  return { x, z, y }
}

export function computeOverviewCamera(
  model: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
): { position: THREE.Vector3; target: THREE.Vector3 } {
  const bbox = new THREE.Box3().setFromObject(model)
  const center = bbox.getCenter(new THREE.Vector3())
  const size = bbox.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  const fovRad = (camera.fov * Math.PI) / 180
  const fitHeightDistance = maxDim / (2 * Math.tan(fovRad / 2))
  const fitWidthDistance = fitHeightDistance / camera.aspect
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.72

  const position = new THREE.Vector3(
    center.x + distance * 0.38,
    center.y + distance * 0.52,
    center.z + distance * 0.82,
  )
  const target = center.clone()
  target.y = bbox.min.y + size.y * 0.38

  return { position, target }
}

export function computeFollowCamera(
  pos: { x: number; y: number; z: number },
  facing: number,
): { position: THREE.Vector3; lookAt: THREE.Vector3 } {
  const eyeY = pos.y + 0.014
  const camDist = 0.055
  const camHeight = 0.018
  const targetX = pos.x - Math.sin(facing) * camDist * 0.4
  const targetZ = pos.z - Math.cos(facing) * camDist * 0.4

  return {
    position: new THREE.Vector3(
      targetX,
      eyeY + camHeight,
      targetZ + camDist,
    ),
    lookAt: new THREE.Vector3(
      pos.x + Math.sin(facing) * 0.015,
      eyeY,
      pos.z + Math.cos(facing) * 0.015,
    ),
  }
}

export function smoothstep(t: number): number {
  const c = THREE.MathUtils.clamp(t, 0, 1)
  return c * c * (3 - 2 * c)
}

export { isStreetWalkable }
