'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { NPC_PORTRAIT_PATH } from '@/lib/adventure/npc'
import {
  acceptMainQuest,
  completeQuest,
  markIntroSeen,
  readAdventureProgress,
  type AdventureProgress,
} from '@/lib/adventure/progress'
import {
  nextDungeonQuestScroll,
  scrollById,
  TUTORIAL_SCROLL_ID,
  type ScrollDefinition,
} from '@/lib/adventure/scrolls'
import { spellForScroll, unlockSpellForScroll } from '@/lib/adventure/spells'

type DialogCopy = {
  continue: string
  acceptQuest: string
  turnInQuest: string
  close: string
  introTitle: string
  questTitle: string
  completeTitle: string
  allDoneTitle: string
  intro: readonly string[]
  mainQuest: {
    body: string
    reminder: string
    turnIn: string
    complete: string
    spellLearned: string
    allDone: string
    dungeonOffer: string
  }
}

type AdventureDialogProps = {
  open: boolean
  onClose: () => void
  copy: DialogCopy
  npcName: string
  collectedScrollIds: string[]
  completedQuestIds: string[]
  spellLabels: Record<string, string>
  lastUnlockedSpell: string | null
  onMainQuestAccepted?: () => void
  onQuestComplete?: (questId: string, spellId: string | null) => void
}

type DialogStep = 'intro' | 'offer' | 'reminder' | 'turnIn' | 'complete' | 'allDone'

function pendingTurnIn(
  collectedScrollIds: string[],
  completedQuestIds: string[],
): ScrollDefinition | undefined {
  const pendingId = collectedScrollIds.find((id) => !completedQuestIds.includes(id))
  if (!pendingId) return undefined
  return scrollById(pendingId)
}

function resolveDialogStep(
  progress: AdventureProgress,
  collectedScrollIds: string[],
  lastUnlockedSpell: string | null,
): { step: DialogStep; activeScroll?: ScrollDefinition } {
  const turnInScroll = pendingTurnIn(collectedScrollIds, progress.completedQuestIds)
  if (turnInScroll && !lastUnlockedSpell) {
    return { step: 'turnIn', activeScroll: turnInScroll }
  }
  if (lastUnlockedSpell) return { step: 'complete' }

  const nextQuest = nextDungeonQuestScroll(progress.completedQuestIds)
  if (!nextQuest) return { step: 'allDone' }

  if (!progress.introSeen) return { step: 'intro', activeScroll: nextQuest }
  if (!progress.mainQuestAccepted) return { step: 'offer', activeScroll: nextQuest }

  if (collectedScrollIds.includes(nextQuest.id)) {
    return { step: 'turnIn', activeScroll: nextQuest }
  }

  if (progress.completedQuestIds.includes(TUTORIAL_SCROLL_ID)) {
    return { step: 'reminder', activeScroll: nextQuest }
  }

  return { step: 'reminder', activeScroll: nextQuest }
}

export function AdventureDialog({
  open,
  onClose,
  copy,
  npcName,
  collectedScrollIds,
  completedQuestIds,
  spellLabels,
  lastUnlockedSpell,
  onMainQuestAccepted,
  onQuestComplete,
}: AdventureDialogProps) {
  const [progress, setProgress] = useState<AdventureProgress>({
    introSeen: false,
    mainQuestAccepted: false,
    completedQuestIds: [],
    defeatedEnemyIds: [],
    currentMapId: 'entrance',
  })
  const [step, setStep] = useState<DialogStep>('intro')
  const [activeScroll, setActiveScroll] = useState<ScrollDefinition | undefined>()

  useEffect(() => {
    if (!open) return
    const p = readAdventureProgress()
    p.completedQuestIds = completedQuestIds
    setProgress(p)
    const resolved = resolveDialogStep(p, collectedScrollIds, lastUnlockedSpell)
    setStep(resolved.step)
    setActiveScroll(resolved.activeScroll)
  }, [open, collectedScrollIds, completedQuestIds, lastUnlockedSpell])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleContinueIntro = useCallback(() => {
    const next = markIntroSeen()
    setProgress(next)
    setStep('offer')
  }, [])

  const handleAcceptQuest = useCallback(() => {
    const next = acceptMainQuest()
    setProgress(next)
    onMainQuestAccepted?.()
    onClose()
  }, [onClose, onMainQuestAccepted])

  const handleTurnIn = useCallback(() => {
    const scroll = pendingTurnIn(collectedScrollIds, progress.completedQuestIds)
    if (!scroll) return
    const spellId = unlockSpellForScroll(scroll.id)
    const next = completeQuest(scroll.id)
    setProgress(next)
    onQuestComplete?.(scroll.id, spellId)
    setStep('complete')
  }, [collectedScrollIds, onQuestComplete, progress.completedQuestIds])

  const title = useMemo(() => {
    if (step === 'intro') return copy.introTitle
    if (step === 'allDone') return copy.allDoneTitle
    if (step === 'complete') return copy.completeTitle
    return copy.questTitle
  }, [copy, step])

  const dungeonOfferText = useMemo(() => {
    if (!activeScroll) return copy.mainQuest.body
    if (activeScroll.id === TUTORIAL_SCROLL_ID) return copy.mainQuest.body
    return copy.mainQuest.dungeonOffer
  }, [activeScroll, copy.mainQuest.body, copy.mainQuest.dungeonOffer])

  if (!open) return null

  return (
    <div className="adventure-quest-overlay" role="presentation" onClick={onClose}>
      <div
        className="adventure-quest-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adventure-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="adventure-quest-panel__header">
          <div className="adventure-quest-panel__portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NPC_PORTRAIT_PATH} alt="" width={56} height={70} draggable={false} />
          </div>
          <div>
            <p className="adventure-quest-panel__kicker">{npcName}</p>
            <h2 id="adventure-dialog-title" className="adventure-quest-panel__title">
              {title}
            </h2>
          </div>
          <button type="button" className="adventure-quest-panel__close" onClick={onClose} aria-label={copy.close}>
            ×
          </button>
        </header>

        <div className="adventure-quest-panel__body">
          {step === 'intro' ? (
            <>
              {copy.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="adventure-quest-panel__offer">
                  {paragraph}
                </p>
              ))}
              <button type="button" className="adventure-quest-panel__btn adventure-quest-panel__btn--primary" onClick={handleContinueIntro}>
                {copy.continue}
              </button>
            </>
          ) : null}

          {step === 'offer' ? (
            <>
              <p className="adventure-quest-panel__offer">{dungeonOfferText}</p>
              <button type="button" className="adventure-quest-panel__btn adventure-quest-panel__btn--primary" onClick={handleAcceptQuest}>
                {copy.acceptQuest}
              </button>
            </>
          ) : null}

          {step === 'reminder' ? (
            <>
              <p className="adventure-quest-panel__offer">
                {activeScroll?.id === TUTORIAL_SCROLL_ID
                  ? copy.mainQuest.reminder
                  : copy.mainQuest.dungeonOffer}
              </p>
              <button type="button" className="adventure-quest-panel__btn" onClick={onClose}>
                {copy.close}
              </button>
            </>
          ) : null}

          {step === 'turnIn' ? (
            <>
              <p className="adventure-quest-panel__offer">{copy.mainQuest.turnIn}</p>
              <button type="button" className="adventure-quest-panel__btn adventure-quest-panel__btn--primary" onClick={handleTurnIn}>
                {copy.turnInQuest}
              </button>
            </>
          ) : null}

          {step === 'complete' ? (
            <>
              <div className="adventure-quest-reward">
                <p>{copy.mainQuest.complete}</p>
                {lastUnlockedSpell ? (
                  <p>
                    {copy.mainQuest.spellLearned.replace(
                      '{spell}',
                      spellLabels[lastUnlockedSpell] ?? lastUnlockedSpell,
                    )}
                  </p>
                ) : null}
              </div>
              <button type="button" className="adventure-quest-panel__btn" onClick={onClose}>
                {copy.close}
              </button>
            </>
          ) : null}

          {step === 'allDone' ? (
            <>
              <p className="adventure-quest-panel__offer">{copy.mainQuest.allDone}</p>
              <button type="button" className="adventure-quest-panel__btn" onClick={onClose}>
                {copy.close}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
