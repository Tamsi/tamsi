import type { GridPos } from '@/lib/adventure/types'

const NEIGHBORS: GridPos[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

export function findPath(
  from: GridPos,
  to: GridPos,
  isWalkable: (x: number, y: number) => boolean,
): GridPos[] {
  if (from.x === to.x && from.y === to.y) return []

  const key = (p: GridPos) => `${p.x},${p.y}`
  const queue: GridPos[] = [from]
  const seen = new Set<string>([key(from)])
  const parent = new Map<string, GridPos>()

  while (queue.length) {
    const current = queue.shift()!
    if (current.x === to.x && current.y === to.y) {
      const path: GridPos[] = []
      let node: GridPos | undefined = current
      while (node) {
        path.push(node)
        node = parent.get(key(node))
      }
      path.reverse()
      return path.slice(1)
    }

    for (const dir of NEIGHBORS) {
      const nx = current.x + dir.x
      const ny = current.y + dir.y
      const k = key({ x: nx, y: ny })
      if (seen.has(k) || !isWalkable(nx, ny)) continue
      seen.add(k)
      parent.set(k, current)
      queue.push({ x: nx, y: ny })
    }
  }

  return []
}

export function findNearestWalkable(
  target: GridPos,
  isWalkable: (x: number, y: number) => boolean,
  inBounds: (x: number, y: number) => boolean,
  maxRadius = 12,
): GridPos | null {
  if (isWalkable(target.x, target.y)) return target

  const queue: GridPos[] = [target]
  const seen = new Set<string>([`${target.x},${target.y}`])

  while (queue.length) {
    const current = queue.shift()!
    if (isWalkable(current.x, current.y)) return current

    for (const dir of NEIGHBORS) {
      const nx = current.x + dir.x
      const ny = current.y + dir.y
      if (Math.abs(nx - target.x) + Math.abs(ny - target.y) > maxRadius) continue
      if (!inBounds(nx, ny)) continue
      const k = `${nx},${ny}`
      if (seen.has(k)) continue
      seen.add(k)
      queue.push({ x: nx, y: ny })
    }
  }

  return null
}
