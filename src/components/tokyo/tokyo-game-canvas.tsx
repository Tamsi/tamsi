'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  computeFollowCamera,
  computeOverviewCamera,
  smoothstep,
  tryMoveOnStreets,
  type StreetWalkRuntime,
} from '@/lib/tokyo-game/collision'
import {
  CAMERA_TRANSITION_SEC,
  createPlayer,
  loadLittlestTokyo,
  MOVE_SPEED,
  PLAY_FOV,
  PLAYER_RADIUS,
  setupTokyoSky,
  type WalkBounds,
} from '@/lib/tokyo-game/littlest-tokyo'

const MOVE_KEYS: Record<string, { x: number; z: number }> = {
  ArrowUp: { x: 0, z: -1 },
  ArrowDown: { x: 0, z: 1 },
  ArrowLeft: { x: -1, z: 0 },
  ArrowRight: { x: 1, z: 0 },
  w: { x: 0, z: -1 },
  W: { x: 0, z: -1 },
  s: { x: 0, z: 1 },
  S: { x: 0, z: 1 },
  a: { x: -1, z: 0 },
  A: { x: -1, z: 0 },
  d: { x: 1, z: 0 },
  D: { x: 1, z: 0 },
  z: { x: 0, z: -1 },
  Z: { x: 0, z: -1 },
  q: { x: -1, z: 0 },
  Q: { x: -1, z: 0 },
}

type GameMode = 'overview' | 'transition' | 'playing'

function clampWalk(pos: { x: number; z: number }, bounds: WalkBounds): void {
  pos.x = THREE.MathUtils.clamp(pos.x, bounds.minX, bounds.maxX)
  pos.z = THREE.MathUtils.clamp(pos.z, bounds.minZ, bounds.maxZ)
}

type TokyoGameCanvasProps = {
  onModeChange?: (mode: 'overview' | 'playing') => void
}

export function TokyoGameCanvas({ onModeChange }: TokyoGameCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let mode: GameMode = 'overview'
    let transitionElapsed = 0
    const overviewFov = 40

    const pressed = new Set<string>()
    const onKeyDown = (e: KeyboardEvent) => {
      if (mode === 'overview' && e.key === 'Enter') {
        e.preventDefault()
        if (tokyoModel) {
          controls.enabled = false
          overviewCam.position.copy(camera.position)
          overviewCam.target.copy(controls.target)
          mode = 'transition'
          transitionElapsed = 0
          player.visible = true
          camera.fov = PLAY_FOV
          camera.updateProjectionMatrix()
          setPlaying(true)
          onModeChange?.('playing')
        }
        return
      }

      if (mode === 'playing' && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        if (debugOverlay) {
          debugOverlay.visible = !debugOverlay.visible
        }
        return
      }

      if (mode !== 'playing') return
      if (e.key in MOVE_KEYS) {
        e.preventDefault()
        pressed.add(e.key)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => pressed.delete(e.key)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      overviewFov,
      mount.clientWidth / mount.clientHeight,
      0.002,
      100,
    )

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.enableZoom = false
    controls.enabled = false

    setupTokyoSky(scene, renderer)

    const sun = new THREE.DirectionalLight(0xffffff, 0.85)
    sun.position.set(4, 6, 2)
    sun.castShadow = true
    scene.add(sun)

    const raycaster = new THREE.Raycaster()
    let raf = 0
    let last = performance.now()
    let mixer: THREE.AnimationMixer | null = null
    let tokyoModel: THREE.Group | null = null
    let walkBounds: WalkBounds | null = null
    let walkRuntime: StreetWalkRuntime | null = null
    let debugOverlay: THREE.Group | null = null

    const overviewCam = {
      position: new THREE.Vector3(),
      target: new THREE.Vector3(),
    }
    const camLookAt = new THREE.Vector3()

    const player = createPlayer()
    player.visible = false
    scene.add(player)

    const pos = { x: 0, z: 0, y: 0 }
    let facing = 0

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      if (tokyoModel && mode === 'overview') {
        const overview = computeOverviewCamera(tokyoModel, camera)
        const offset = camera.position.clone().sub(controls.target)
        const dist = overview.position.distanceTo(overview.target)
        if (offset.lengthSq() > 1e-6) offset.setLength(dist)
        else offset.copy(overview.position).sub(overview.target)
        camera.position.copy(controls.target).add(offset)
        controls.update()
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (mixer) mixer.update(dt)

      if (tokyoModel && walkBounds && walkRuntime) {
        if (mode === 'overview') {
          controls.update()
          overviewCam.position.copy(camera.position)
          overviewCam.target.copy(controls.target)
        }

        if (mode === 'transition') {
          transitionElapsed += dt
          const t = smoothstep(transitionElapsed / CAMERA_TRANSITION_SEC)
          const follow = computeFollowCamera(pos, facing)
          camera.position.lerpVectors(overviewCam.position, follow.position, t)
          camLookAt.lerpVectors(overviewCam.target, follow.lookAt, t)
          camera.lookAt(camLookAt)
          if (transitionElapsed >= CAMERA_TRANSITION_SEC) {
            mode = 'playing'
          }
        }

        if (mode === 'playing') {
          let ix = 0
          let iz = 0
          for (const keyName of pressed) {
            const v = MOVE_KEYS[keyName]
            if (v) {
              ix += v.x
              iz += v.z
            }
          }

          const len = Math.hypot(ix, iz)
          if (len > 0) {
            ix /= len
            iz /= len
            facing = Math.atan2(ix, iz)

            const moved = tryMoveOnStreets(
              pos,
              ix * MOVE_SPEED * dt,
              iz * MOVE_SPEED * dt,
              walkRuntime,
              raycaster,
              PLAYER_RADIUS,
            )
            pos.x = moved.x
            pos.z = moved.z
            pos.y = moved.y
            clampWalk(pos, walkBounds)
          }

          player.position.set(pos.x, pos.y, pos.z)
          player.rotation.y = facing

          const follow = computeFollowCamera(pos, facing)
          camera.position.lerp(follow.position, 0.14)
          camera.lookAt(follow.lookAt)
        }
      }

      renderer.render(scene, camera)
    }

    loadLittlestTokyo(scene)
      .then((tokyo) => {
        if (disposed) return
        tokyoModel = tokyo.model
        walkBounds = tokyo.walkBounds
        walkRuntime = tokyo.walk
        debugOverlay = tokyo.debugOverlay
        mixer = tokyo.mixer
        pos.x = tokyo.spawn.x
        pos.z = tokyo.spawn.z
        pos.y = tokyo.spawn.y
        player.position.set(pos.x, pos.y, pos.z)

        const overview = computeOverviewCamera(tokyo.model, camera)
        overviewCam.position.copy(overview.position)
        overviewCam.target.copy(overview.target)
        controls.target.copy(overview.target)
        camera.position.copy(overview.position)
        controls.update()
        controls.enabled = true

        // Show walkable tiles briefly so routes are obvious after load
        debugOverlay.visible = true
        window.setTimeout(() => {
          if (!disposed && debugOverlay) debugOverlay.visible = false
        }, 2500)

        setStatus('ready')
        raf = requestAnimationFrame(tick)
      })
      .catch(() => {
        if (!disposed) setStatus('error')
      })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [onModeChange])

  return (
    <div
      ref={mountRef}
      className="tokyo-game-canvas"
      aria-label="Tokyo mini-game viewport"
      data-status={status}
      data-playing={playing ? 'true' : 'false'}
    />
  )
}
