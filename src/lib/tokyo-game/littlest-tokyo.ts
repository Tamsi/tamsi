import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  DRACOLoader,
  DRACO_GLTF_CONFIG,
} from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import type { StreetWalkRuntime } from '@/lib/tokyo-game/collision'
import {
  bakeStreetNavGrid,
  collectStreetMeshes,
  createStreetDebugOverlay,
  findStreetSpawn,
} from '@/lib/tokyo-game/walkable-surfaces'

/** Bundled copy of the official Three.js example asset (CC BY — Glen Fox). */
export const LITTLEST_TOKYO_URL = '/models/LittlestTokyo.glb'

export type WalkBounds = {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export type LittlestTokyoScene = {
  model: THREE.Group
  mixer: THREE.AnimationMixer
  walkBounds: WalkBounds
  walk: StreetWalkRuntime
  spawn: { x: number; z: number; y: number }
  debugOverlay: THREE.Group
}

export function setupTokyoSky(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
): void {
  const sky = new Sky()
  sky.scale.setScalar(10_000)

  const envScene = new THREE.Scene()
  envScene.add(sky)

  const uniforms = sky.material.uniforms
  uniforms.turbidity.value = 0
  uniforms.rayleigh.value = 3
  uniforms.mieDirectionalG.value = 0.7
  uniforms.cloudElevation.value = 1
  uniforms.sunPosition.value.set(-0.8, 0.19, 0.56)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(envScene).texture
  pmrem.dispose()

  scene.add(sky)
}

export async function loadLittlestTokyo(
  scene: THREE.Scene,
): Promise<LittlestTokyoScene> {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG)

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  const gltf = await loader.loadAsync(LITTLEST_TOKYO_URL)
  dracoLoader.dispose()

  const model = gltf.scene
  model.position.set(1, 1, 0)
  model.scale.setScalar(0.01)
  scene.add(model)

  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  const streets = collectStreetMeshes(model)
  const ctx = { streets, obstacles: model }
  const raycaster = new THREE.Raycaster()
  const nav = bakeStreetNavGrid(ctx, raycaster)
  const walk: StreetWalkRuntime = { ctx, nav }
  const spawn = findStreetSpawn(nav)
  const debugOverlay = createStreetDebugOverlay(nav, model)

  const mixer = new THREE.AnimationMixer(model)
  if (gltf.animations[0]) {
    mixer.clipAction(gltf.animations[0]).play()
  }

  return {
    model,
    mixer,
    walkBounds: nav.bounds,
    walk,
    spawn,
    debugOverlay,
  }
}

export function createPlayer(): THREE.Group {
  const player = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.0035, 0.007, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xff6b9d, roughness: 0.35 }),
  )
  body.position.y = 0.009
  body.castShadow = true
  player.add(body)

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.0032, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xffe0bd, roughness: 0.65 }),
  )
  head.position.y = 0.016
  head.castShadow = true
  player.add(head)

  return player
}

export const MOVE_SPEED = 0.11
export const PLAYER_RADIUS = 0.004
export const CAMERA_TRANSITION_SEC = 1.25
export const PLAY_FOV = 58
