import * as THREE from 'three'
import {
  createBaseRenderer,
  lineMaterial,
  trackDisposable,
  type ScrollBgMount,
} from '@/lib/three-scroll-bg/shared'

const ZOOM_START = 1.5
const ZOOM_END = 1.0
const CAM_Z_BASE = 5.2

function fibonacciSphere(count: number, radius: number) {
  const pts: THREE.Vector3[] = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = phi * i
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius,
      ),
    )
  }
  return pts
}

function orbitRing(radius: number, segments = 96) {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
  }
  return new THREE.BufferGeometry().setFromPoints(pts)
}

/** Full constellation at hero (150% zoom) → dezooms to baseline at page bottom */
export function mountOrbitScene(host: HTMLElement): ScrollBgMount {
  const disposables: Array<{ dispose: () => void }> = []
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 50)
  camera.position.set(0.4, 0.15, CAM_Z_BASE / ZOOM_START)
  const renderer = createBaseRenderer(host)

  const root = new THREE.Group()
  root.position.set(1.65, 0.05, 0)
  root.scale.setScalar(ZOOM_START)
  scene.add(root)

  const rings: THREE.Line[] = []
  for (const spec of [
    { r: 1.55, rx: 0.62, ry: 0.18, rz: 0, op: 0.176 },
    { r: 1.85, rx: 1.05, ry: 0.42, rz: 0.35, op: 0.121 },
    { r: 2.15, rx: 1.45, ry: -0.28, rz: -0.55, op: 0.099 },
  ] as const) {
    const geo = trackDisposable(disposables, orbitRing(spec.r))
    const ring = new THREE.Line(geo, lineMaterial(disposables, 0x2563eb, spec.op))
    ring.rotation.set(spec.rx, spec.ry, spec.rz)
    root.add(ring)
    rings.push(ring)
  }

  const nodes = fibonacciSphere(42, 0.95)
  const linkPositions: number[] = []
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    const b = nodes[(i + 1) % nodes.length]
    const c = nodes[(i + 3) % nodes.length]
    linkPositions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    if (i % 2 === 0) linkPositions.push(a.x, a.y, a.z, c.x, c.y, c.z)
  }
  const linkGeo = new THREE.BufferGeometry()
  linkGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(linkPositions, 3),
  )
  trackDisposable(disposables, linkGeo)
  const links = new THREE.LineSegments(linkGeo, lineMaterial(disposables, 0x64748b, 0.154))
  root.add(links)

  const nodeGeo = trackDisposable(disposables, new THREE.BufferGeometry().setFromPoints(nodes))
  const nodeMat = trackDisposable(
    disposables,
    new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.045,
      transparent: true,
      opacity: 0.605,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  )
  root.add(new THREE.Points(nodeGeo, nodeMat))

  const coreGeo = trackDisposable(disposables, new THREE.IcosahedronGeometry(0.22, 1))
  const coreMat = trackDisposable(
    disposables,
    new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.242,
      wireframe: true,
      depthWrite: false,
    }),
  )
  const core = new THREE.Mesh(coreGeo, coreMat)
  root.add(core)

  return {
    resize(w, h) {
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    },
    frame(p, time) {
      const t = time * 0.00015
      const zoom = THREE.MathUtils.lerp(ZOOM_START, ZOOM_END, p)

      root.rotation.y = p * Math.PI * 0.65 + t * 0.35
      root.rotation.x = -0.18 + p * 0.28
      root.position.y = -p * 1.1
      root.scale.setScalar(zoom)

      rings[0].rotation.y = p * 0.9 + t * 0.5
      rings[1].rotation.z = -p * 0.7 - t * 0.3
      rings[2].rotation.x = p * 0.55 + t * 0.2

      core.rotation.y = t * 2.2
      core.rotation.x = p * 0.4

      camera.position.x = 0.4 + Math.sin(p * Math.PI) * 0.35
      camera.position.y = 0.15
      camera.position.z = CAM_Z_BASE / zoom
      camera.lookAt(1.65, -p * 0.35, 0)

      const fade = 1 - p * 0.35
      coreMat.opacity = 0.242 * fade
      ;(links.material as THREE.LineBasicMaterial).opacity = 0.154 * fade
      nodeMat.opacity = 0.605 * fade

      renderer.render(scene, camera)
    },
    dispose() {
      renderer.dispose()
      disposables.forEach((d) => d.dispose())
      host.removeChild(renderer.domElement)
    },
  }
}
