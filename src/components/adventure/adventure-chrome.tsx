'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdventureCanvas } from '@/components/adventure/adventure-canvas'
import { AdventureCombatCanvas } from '@/components/adventure/adventure-combat-canvas'
import { AdventureDialog } from '@/components/adventure/adventure-dialog'
import { AdventureInventory } from '@/components/adventure/adventure-inventory'
import { AdventureScrollReader } from '@/components/adventure/adventure-scroll-reader'
import { AdventureSpellBar } from '@/components/adventure/adventure-spell-bar'
import {
  ATTACK_ANIM_MS,
  clearCombatVfx,
  createCombatState,
  spellVfxDuration,
  type CombatState,
} from '@/lib/adventure/combat'
import { AdventureEndTurnButton } from '@/components/adventure/adventure-end-turn-button'
import { enemyById } from '@/lib/adventure/enemies'
import { addScrollToInventory, readInventory } from '@/lib/adventure/inventory'
import type { MapId } from '@/lib/adventure/maps'
import {
  markEnemyDefeated,
  readAdventureProgress,
  setCurrentMapId,
} from '@/lib/adventure/progress'
import { MAP_SCROLLS, TUTORIAL_SCROLL_ID } from '@/lib/adventure/scrolls'
import { readUnlockedSpells, unlockSpellForScroll } from '@/lib/adventure/spells'
import { defaultLocale, dictionaries, locales, type Locale } from '@/i18n/dictionaries'

function resolveLocale(param: string | null): Locale {
  return locales.includes(param as Locale) ? (param as Locale) : defaultLocale
}

export function AdventureChrome() {
  const searchParams = useSearchParams()
  const locale = resolveLocale(searchParams.get('locale'))
  const t = dictionaries[locale].adventure
  const homeHref = locale === defaultLocale ? '/' : `/?locale=${locale}`

  const [dialogOpen, setDialogOpen] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [readerScrollId, setReaderScrollId] = useState<string | null>(null)
  const [mainQuestAccepted, setMainQuestAccepted] = useState(false)
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([])
  const [defeatedEnemyIds, setDefeatedEnemyIds] = useState<string[]>([])
  const [collectedScrollIds, setCollectedScrollIds] = useState<string[]>([])
  const [unlockedSpellIds, setUnlockedSpellIds] = useState<string[]>([])
  const [currentMapId, setMapId] = useState<MapId>('entrance')
  const [pickupToast, setPickupToast] = useState<string | null>(null)
  const [combatState, setCombatState] = useState<CombatState | null>(null)
  const [lastUnlockedSpell, setLastUnlockedSpell] = useState<string | null>(null)

  const tutorialComplete = completedQuestIds.includes(TUTORIAL_SCROLL_ID)

  useEffect(() => {
    const progress = readAdventureProgress()
    setMainQuestAccepted(progress.mainQuestAccepted)
    setCompletedQuestIds(progress.completedQuestIds)
    setDefeatedEnemyIds(progress.defeatedEnemyIds)
    setMapId(progress.currentMapId)
    setCollectedScrollIds(readInventory())
    setUnlockedSpellIds(readUnlockedSpells())
  }, [])

  const scrollMeta = useMemo(() => {
    const meta: Record<string, { title: string; excerpt: string }> = {}
    for (const def of MAP_SCROLLS) {
      if (def.kind === 'tutorial' && def.contentKey) {
        const scroll = t.scrolls[def.contentKey]
        if (scroll) meta[def.id] = { title: scroll.title, excerpt: scroll.excerpt }
      } else if (def.kind === 'blog' && def.blogSlug) {
        const blogScrolls = t.scrolls.blog as Record<string, { title: string; excerpt: string }>
        const blog = blogScrolls[def.blogSlug]
        if (blog) meta[def.id] = { title: blog.title, excerpt: blog.excerpt }
      }
    }
    return meta
  }, [t.scrolls])

  const spellLabels = useMemo(() => {
    const labels: Record<string, string> = {}
    for (const [id, label] of Object.entries(t.spells)) {
      if (typeof label === 'string') labels[id] = label
    }
    return labels
  }, [t.spells])

  const handleNpcInteract = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const handleScrollPickup = useCallback(
    (scrollId: string) => {
      setCollectedScrollIds((prev) => {
        if (prev.includes(scrollId)) return prev
        const next = addScrollToInventory(scrollId)
        setPickupToast(t.inventory.pickup)
        window.setTimeout(() => setPickupToast(null), 2600)
        return next
      })
    },
    [t.inventory.pickup],
  )

  const handleMapChange = useCallback((mapId: MapId) => {
    setMapId(mapId)
    setCurrentMapId(mapId)
  }, [])

  const handleCombatStateChange = useCallback((next: CombatState) => {
    setCombatState(next)
    if (next.vfx || next.attackAnim) {
      const vfxMs = next.vfx ? spellVfxDuration(next.vfx.spellId) : 0
      const attackMs = next.attackAnim ? ATTACK_ANIM_MS : 0
      window.setTimeout(() => {
        setCombatState((current) => {
          if (!current) return current
          const sameVfx =
            next.vfx && current.vfx?.startedAt === next.vfx.startedAt
          const sameAttack =
            next.attackAnim &&
            current.attackAnim?.startedAt === next.attackAnim.startedAt
          if (sameVfx || sameAttack) return clearCombatVfx(current)
          return current
        })
      }, Math.max(vfxMs, attackMs))
    }
  }, [])

  const handleEnemyEngage = useCallback(
    (enemyId: string) => {
      const enemy = enemyById(enemyId)
      if (!enemy) return
      setCombatState(createCombatState(enemy, readUnlockedSpells()))
    },
    [],
  )

  const handleCombatExit = useCallback(
    (result: 'win' | 'lose') => {
      if (!combatState) return
      if (result === 'win') {
        const next = markEnemyDefeated(combatState.enemyId)
        setDefeatedEnemyIds(next.defeatedEnemyIds)
        setPickupToast(t.combat.victory)
        window.setTimeout(() => setPickupToast(null), 2600)
      } else {
        setPickupToast(t.combat.defeat)
        window.setTimeout(() => setPickupToast(null), 2600)
        setMapId('entrance')
        setCurrentMapId('entrance')
      }
      setCombatState(null)
    },
    [combatState, t.combat.defeat, t.combat.victory],
  )

  const handleQuestComplete = useCallback((questId: string, spellId: string | null) => {
    setCompletedQuestIds((prev) =>
      prev.includes(questId) ? prev : [...prev, questId],
    )
    if (spellId) {
      setUnlockedSpellIds(readUnlockedSpells())
      setLastUnlockedSpell(spellId)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'i' && e.key !== 'I') return
      if (readerScrollId || dialogOpen || combatState) return
      e.preventDefault()
      setInventoryOpen((open) => !open)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialogOpen, readerScrollId, combatState])

  const handleReadScroll = useCallback((scrollId: string) => {
    setInventoryOpen(false)
    setReaderScrollId(scrollId)
  }, [])

  return (
    <div className="adventure-page">
      {combatState ? (
        <AdventureCombatCanvas
          state={combatState}
          copy={t.combat}
          onStateChange={handleCombatStateChange}
          onExit={handleCombatExit}
        />
      ) : (
        <AdventureCanvas
          mapId={currentMapId}
          onNpcInteract={handleNpcInteract}
          mainQuestAccepted={mainQuestAccepted}
          tutorialComplete={tutorialComplete}
          collectedScrollIds={collectedScrollIds}
          defeatedEnemyIds={defeatedEnemyIds}
          onScrollPickup={handleScrollPickup}
          onMapChange={handleMapChange}
          onEnemyEngage={handleEnemyEngage}
          transitionLockedHint={t.transitionLocked}
        />
      )}

      <header className="adventure-hud">
        <Link href={homeHref} className="adventure-hud-back">
          ← {t.back}
        </Link>
        <div className="adventure-hud-title">
          <span className="adventure-hud-kicker">{t.kicker}</span>
          <h1>{combatState ? t.combat.title : t.title}</h1>
        </div>
        <p className="adventure-hud-hint">
          {combatState ? t.combat.hint : t.controls}
        </p>
        <p className="adventure-hud-credit">{t.credit}</p>
      </header>

      {pickupToast ? (
        <div className="adventure-pickup-toast" role="status">
          {pickupToast}
        </div>
      ) : null}

      <AdventureDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setLastUnlockedSpell(null)
        }}
        copy={t.dialog}
        npcName={t.npc.name}
        collectedScrollIds={collectedScrollIds}
        completedQuestIds={completedQuestIds}
        spellLabels={spellLabels}
        lastUnlockedSpell={lastUnlockedSpell}
        onMainQuestAccepted={() => setMainQuestAccepted(true)}
        onQuestComplete={handleQuestComplete}
      />

      <AdventureInventory
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        scrollIds={collectedScrollIds}
        scrollMeta={scrollMeta}
        scrollDefs={MAP_SCROLLS}
        copy={t.inventory}
        onReadScroll={handleReadScroll}
      />

      <AdventureScrollReader
        locale={locale}
        scrollId={readerScrollId}
        onClose={() => setReaderScrollId(null)}
        tutorialScrolls={{ tutoWelcome: t.scrolls.tutoWelcome }}
        copy={t.scrollReader}
      />

      {combatState ? (
        <AdventureSpellBar
          unlockedSpellIds={unlockedSpellIds}
          spellLabels={spellLabels}
          combatState={combatState}
          onCombatStateChange={handleCombatStateChange}
        />
      ) : null}

      {combatState ? (
        <AdventureEndTurnButton
          combatState={combatState}
          label={t.combat.endTurn}
          onCombatStateChange={handleCombatStateChange}
        />
      ) : null}
    </div>
  )
}
