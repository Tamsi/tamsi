export type SpellKind = 'attack' | 'defense' | 'heal'

export type SpellDefinition = {
  id: string
  kind: SpellKind
  nameKey: string
  /** Scroll quest that unlocks this spell (undefined = starter). */
  scrollId?: string
  damage?: number
  heal?: number
  shield?: number
  range: number
}

export const STARTER_SPELL_ID = 'strike'

export const SPELL_DEFINITIONS: SpellDefinition[] = [
  {
    id: 'strike',
    kind: 'attack',
    nameKey: 'strike',
    damage: 8,
    range: 1,
  },
  {
    id: 'fireball',
    kind: 'attack',
    nameKey: 'fireball',
    scrollId: 'scroll-blog-unsloth',
    damage: 16,
    range: 3,
  },
  {
    id: 'ward',
    kind: 'defense',
    nameKey: 'ward',
    scrollId: 'scroll-blog-hermes',
    shield: 12,
    range: 0,
  },
  {
    id: 'mend',
    kind: 'heal',
    nameKey: 'mend',
    scrollId: 'scroll-blog-qwen',
    heal: 22,
    range: 0,
  },
  {
    id: 'chainbolt',
    kind: 'attack',
    nameKey: 'chainbolt',
    scrollId: 'scroll-blog-redbee',
    damage: 20,
    range: 2,
  },
  {
    id: 'bastion',
    kind: 'defense',
    nameKey: 'bastion',
    scrollId: 'scroll-blog-ai-reviewer',
    shield: 18,
    range: 0,
  },
]

const SPELLS_BY_ID = Object.fromEntries(
  SPELL_DEFINITIONS.map((s) => [s.id, s]),
) as Record<string, SpellDefinition>

export function getSpell(id: string): SpellDefinition | undefined {
  return SPELLS_BY_ID[id]
}

export function spellForScroll(scrollId: string): SpellDefinition | undefined {
  return SPELL_DEFINITIONS.find((s) => s.scrollId === scrollId)
}

const STORAGE_KEY = 'tamsi-adventure-spells'

export function readUnlockedSpells(): string[] {
  if (typeof window === 'undefined') return [STARTER_SPELL_ID]
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [STARTER_SPELL_ID]
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return [STARTER_SPELL_ID]
    const ids = parsed.filter((id): id is string => typeof id === 'string')
    return ids.includes(STARTER_SPELL_ID) ? ids : [STARTER_SPELL_ID, ...ids]
  } catch {
    return [STARTER_SPELL_ID]
  }
}

export function unlockSpell(spellId: string): string[] {
  const current = readUnlockedSpells()
  if (current.includes(spellId)) return current
  const next = [...current, spellId]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
  return next
}

export function unlockSpellForScroll(scrollId: string): string | null {
  const spell = spellForScroll(scrollId)
  if (!spell) return null
  unlockSpell(spell.id)
  return spell.id
}
