'use client'

import { useEffect } from 'react'
import { endPlayerTurn, type CombatState } from '@/lib/adventure/combat'

type AdventureEndTurnButtonProps = {
  combatState: CombatState
  label: string
  onCombatStateChange: (state: CombatState) => void
}

export function AdventureEndTurnButton({
  combatState,
  label,
  onCombatStateChange,
}: AdventureEndTurnButtonProps) {
  const canEnd =
    combatState.phase === 'player' &&
    !combatState.result &&
    !combatState.vfx &&
    !combatState.attackAnim

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!canEnd) return
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      onCombatStateChange(endPlayerTurn(combatState))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canEnd, combatState, onCombatStateChange])

  return (
    <button
      type="button"
      className="adventure-end-turn"
      disabled={!canEnd}
      onClick={() => onCombatStateChange(endPlayerTurn(combatState))}
    >
      {label}
    </button>
  )
}
