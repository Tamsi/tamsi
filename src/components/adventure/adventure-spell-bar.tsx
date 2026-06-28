'use client'

import { useEffect } from 'react'
import {
  castCombatSpell,
  selectCombatSpell,
  type CombatState,
} from '@/lib/adventure/combat'
import { spellIconPath } from '@/lib/adventure/spell-icons'
import { SPELL_DEFINITIONS } from '@/lib/adventure/spells'

type AdventureSpellBarProps = {
  unlockedSpellIds: string[]
  spellLabels: Record<string, string>
  combatState: CombatState
  onCombatStateChange: (state: CombatState) => void
}

export function AdventureSpellBar({
  unlockedSpellIds,
  spellLabels,
  combatState,
  onCombatStateChange,
}: AdventureSpellBarProps) {
  const unlockedSpells = SPELL_DEFINITIONS.filter((s) =>
    unlockedSpellIds.includes(s.id),
  )

  const canCast =
    combatState.phase === 'player' &&
    !combatState.result &&
    !combatState.vfx &&
    !combatState.attackAnim

  useEffect(() => {
    if (unlockedSpells.length === 0) return

    const onKey = (e: KeyboardEvent) => {
      if (combatState.phase !== 'player' || combatState.result) return
      if (combatState.vfx || combatState.attackAnim) return

      const idx = Number(e.key) - 1
      if (idx < 0 || idx >= unlockedSpells.length) return
      const spell = unlockedSpells[idx]

      e.preventDefault()
      if (spell.kind === 'attack') {
        const active = combatState.selectedSpellId === spell.id
        onCombatStateChange(selectCombatSpell(combatState, active ? null : spell.id))
      } else {
        onCombatStateChange(castCombatSpell(combatState, spell.id, combatState.enemyPos))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [combatState, onCombatStateChange, unlockedSpells])

  if (unlockedSpells.length === 0) return null

  return (
    <nav className="adventure-spell-bar" aria-label="Spell bar">
      {unlockedSpells.map((spell, index) => {
        const active = combatState.selectedSpellId === spell.id
        const disabled = !canCast
        const icon = spellIconPath(spell.id)

        return (
          <button
            key={spell.id}
            type="button"
            className={`adventure-spell-slot adventure-spell-slot--${spell.kind}${active ? ' is-active' : ''}`}
            disabled={disabled}
            title={spellLabels[spell.id] ?? spell.id}
            aria-label={spellLabels[spell.id] ?? spell.id}
            onClick={() => {
              if (disabled) return
              if (spell.kind === 'attack') {
                onCombatStateChange(
                  selectCombatSpell(combatState, active ? null : spell.id),
                )
              } else {
                onCombatStateChange(
                  castCombatSpell(combatState, spell.id, combatState.enemyPos),
                )
              }
            }}
          >
            {icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={icon}
                alt=""
                className="adventure-spell-slot__img"
                width={40}
                height={40}
                draggable={false}
              />
            ) : null}
            <span className="adventure-spell-slot__label">{spellLabels[spell.id] ?? spell.id}</span>
            <span className="adventure-spell-slot__key">{index + 1}</span>
          </button>
        )
      })}
    </nav>
  )
}
