import * as THREE from 'three'
import {
  createBaseRenderer,
  lineMaterial,
  trackDisposable,
  type ScrollBgMount,
} from '@/lib/three-scroll-bg/shared'

function helixPoints(
  turns: number,
  radius: number,
  height: number,
  segments: number,
  phase = 0,
) {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = t * turns * Math.PI * 2 + phase
    pts.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        (t - 0.5) * height,
        Math.sin(angle) * radius,
      ),
    )
  }
  return pts
}

function depthGrid(
  disposables: Array<{ dispose: () => void }>,
  size: number,
  divisions: number,
  opacity: number,
) {
  const geo = new THREE.PlaneGeometry(size, size, divisions, divisions)
  trackDisposable(disposables, geo)
  const mat = new THREE.MeshBasicMaterial({
    color: 0x2563eb,
    wireframe: true,
    transparent: true,
    opacity,
    depthWrite: false,
  })
  trackDisposable(disposables, mat)
  return new THREE.Mesh(geo, mat)
}

/** Double helix + depth grids — data / flow aesthetic */
export function mountHelixScene(host: HTMLElement): ScrollBgMount {
  const disposables: Array<{ dispose: () => void }> = []

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60)
  camera.position.set(-0.2, 0.3, 6.2)

  const renderer = createBaseRenderer(host)

  const root = new THREE.Group()
  root.position.set(1.85, 0, 0)
  root.rotation.z = 0.22
  scene.add(root)

  // Background depth grids
  const backGrid = depthGrid(disposables, 14, 18, 0.04)
  backGrid.rotation.x = -Math.PI / 2
  backGrid.position.set(0, -2.8, -3.5)
  root.add(backGrid)

  const midGrid = depthGrid(disposables, 10, 14, 0.06)
  midGrid.rotation.x = -Math.PI / 2.4
  midGrid.position.set(-0.6, -1.2, -1.8)
  root.add(midGrid)

  // Twin helices
  const helixAGeo = new THREE.BufferGeometry().setFromPoints(
    helixPoints(2.2, 0.72, 4.2, 140, 0),
  )
  trackDisposable(disposables, helixAGeo)
  const helixBGeo = new THREE.BufferGeometry().setFromPoints(
    helixPoints(2.2, 0.72, 4.2, 140, Math.PI),
  )
  trackDisposable(disposables, helixBGeo)
  const strandA = new THREE.Line(
    helixAGeo,
    lineMaterial(disposables, 0x2563eb, 0.2),
  )
  const strandB = new THREE.Line(
    helixBGeo,
    lineMaterial(disposables, 0x0ea5e9, 0.14),
  )
  root.add(strandA, strandB)

  // Rungs between strands
  const rungPositions: number[] = []
  const segA = helixPoints(2.2, 0.72, 4.2, 48, 0)
  const segB = helixPoints(2.2, 0.72, 4.2, 48, Math.PI)
  for (let i = 0; i < segA.length; i += 3) {
    const a = segA[i]
    const b = segB[i]
    rungPositions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }
  const rungGeo = new THREE.BufferGeometry()
  rungGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(rungPositions, 3),
  )
  trackDisposable(disposables, rungGeo)
  const rungs = new THREE.LineSegments(rungGeo, lineMaterial(disposables, 0x94a3b8, 0.1))
  root.add(rungs)

  // Nodes along primary strand
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(
    segA.filter((_, i) => i % 2 === 0),
  )
  trackDisposable(disposables, nodeGeo)
  const nodeMat = trackDisposable(
    disposables,
    new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  )
  root.add(new THREE.Points(nodeGeo, nodeMat))

  // Horizontal scan rings
  const scanRings: THREE.Line[] = []
  for (const y of [-1.4, 0, 1.4]) {
    const ringGeo = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 65 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2
        return new THREE.Vector3(Math.cos(a) * 1.05, y, Math.sin(a) * 1.05)
      }),
    )
    trackDisposable(disposables, ringGeo)
    const ring = new THREE.Line(ringGeo, lineMaterial(disposables, 0x64748b, 0.08))
    root.add(ring)
    scanRings.push(ring)
  }

  return {
    resize(w, h) {
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    },
    frame(p, time) {
      const t = time * 0.00012
      const phase = p * Math.PI * 1.4

      root.rotation.y = p * Math.PI * 0.5 + t * 0.25
      root.position.y = -p * 1.25
      root.position.x = 1.85 + Math.sin(p * Math.PI) * 0.2

      strandA.rotation.y = phase * 0.15
      strandB.rotation.y = -phase * 0.12
      rungs.rotation.y = phase * 0.08

      backGrid.position.z = -3.5 - p * 1.2
      midGrid.position.z = -1.8 - p * 0.6
      ;(backGrid.material as THREE.MeshBasicMaterial).opacity = 0.04 + p * 0.02
      ;(midGrid.material as THREE.MeshBasicMaterial).opacity = 0.06 - p * 0.02

      scanRings.forEach((ring, i) => {
        ring.rotation.y = t * (0.4 + i * 0.15) + p * 0.3
        ;(ring.material as THREE.LineBasicMaterial).opacity = 0.08 * (1 - p * 0.4)
      })

      camera.position.x = -0.2 + Math.sin(p * Math.PI * 0.9) * 0.45
      camera.position.y = 0.3 - p * 0.5
      camera.position.z = 6.2 - p * 0.7
      camera.lookAt(1.85, -p * 0.4, 0)

      const fade = 1 - p * 0.3
      ;(strandA.material as THREE.LineBasicMaterial).opacity = 0.2 * fade
      ;(strandB.material as THREE.LineBasicMaterial).opacity = 0.14 * fade
      nodeMat.opacity = 0.5 * fade

      renderer.render(scene, camera)
    },
    dispose() {
      renderer.dispose()
      disposables.forEach((d) => d.dispose())
      host.removeChild(renderer.domElement)
    },
  }
}
