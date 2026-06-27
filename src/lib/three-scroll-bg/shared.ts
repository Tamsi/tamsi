import * as THREE from 'three'

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function scrollProgress() {
  const y = window.scrollY
  const vh = window.innerHeight
  const max = document.documentElement.scrollHeight - vh
  if (max <= 0) return 0
  return clamp(y / max, 0, 1)
}

export type ScrollBgMount = {
  resize: (w: number, h: number) => void
  frame: (p: number, time: number) => void
  dispose: () => void
}

export function createBaseRenderer(host: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  host.appendChild(renderer.domElement)
  return renderer
}

export function trackDisposable<T extends { dispose: () => void }>(
  list: Array<{ dispose: () => void }>,
  item: T,
): T {
  list.push(item)
  return item
}

export function lineMaterial(
  list: Array<{ dispose: () => void }>,
  color: number,
  opacity: number,
) {
  return trackDisposable(
    list,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  )
}
