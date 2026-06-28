const STORAGE_KEY = 'tamsi-adventure-inventory'

export function readInventory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

export function writeInventory(scrollIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scrollIds))
  } catch {
    // ignore
  }
}

export function addScrollToInventory(scrollId: string): string[] {
  const current = readInventory()
  if (current.includes(scrollId)) return current
  const next = [...current, scrollId]
  writeInventory(next)
  return next
}

export function hasScroll(scrollId: string): boolean {
  return readInventory().includes(scrollId)
}
