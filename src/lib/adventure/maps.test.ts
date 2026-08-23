import { describe, expect, it } from 'vitest'
import { dictionaries, locales } from '@/i18n/dictionaries'
import { getAllBlogPosts } from '@/lib/blog'
import { enemyForMap } from '@/lib/adventure/enemies'
import {
  DUNGEON_MAP_IDS,
  MAP_DEFINITIONS,
  MAP_ORDER,
  dungeonDepth,
  tileAtMap,
  type MapId,
} from '@/lib/adventure/maps'
import { findPath } from '@/lib/adventure/pathfinding'
import { BLOG_SCROLL_SLUGS, MAP_SCROLLS } from '@/lib/adventure/scrolls'
import { SPELL_DEFINITIONS, spellForScroll } from '@/lib/adventure/spells'

function isFloor(mapId: MapId, x: number, y: number): boolean {
  return tileAtMap(mapId, x, y) !== 'void'
}

describe('adventure maps', () => {
  it('keeps every ascii row at a consistent width', () => {
    for (const mapId of MAP_ORDER) {
      const { ascii } = MAP_DEFINITIONS[mapId]
      const width = ascii[0].length
      expect(width).toBeGreaterThan(0)
      for (const row of ascii) {
        expect(row.length).toBe(width)
      }
    }
  })

  it('places spawn and transitions on walkable floor', () => {
    for (const mapId of MAP_ORDER) {
      const def = MAP_DEFINITIONS[mapId]
      expect(isFloor(mapId, def.spawn.x, def.spawn.y)).toBe(true)
      for (const transition of def.transitions) {
        expect(isFloor(mapId, transition.position.x, transition.position.y)).toBe(
          true,
        )
      }
    }
  })

  it('chains dungeon rooms left-to-right', () => {
    for (let i = 0; i < MAP_ORDER.length; i++) {
      const mapId = MAP_ORDER[i]!
      const def = MAP_DEFINITIONS[mapId]
      const left = def.transitions.find((t) => t.direction === 'left')
      const right = def.transitions.find((t) => t.direction === 'right')
      if (i > 0) {
        expect(left?.targetMapId).toBe(MAP_ORDER[i - 1])
      }
      if (i < MAP_ORDER.length - 1) {
        expect(right?.targetMapId).toBe(MAP_ORDER[i + 1])
      } else {
        expect(right).toBeUndefined()
      }
    }
  })
})

describe('adventure blog content', () => {
  it('covers every published blog post with a dungeon scroll', () => {
    const slugs = new Set(
      MAP_SCROLLS.filter((s) => s.kind === 'blog').map((s) => s.blogSlug),
    )
    for (const post of getAllBlogPosts()) {
      expect(slugs.has(post.slug), post.slug).toBe(true)
    }
    expect(BLOG_SCROLL_SLUGS).toHaveLength(DUNGEON_MAP_IDS.length)
  })

  it('gives each dungeon an enemy, a scroll, and a turn-in spell', () => {
    for (const mapId of DUNGEON_MAP_IDS) {
      const depth = dungeonDepth(mapId)
      const enemy = enemyForMap(mapId, depth)
      const scroll = MAP_SCROLLS.find((s) => s.mapId === mapId)
      expect(enemy, mapId).toBeTruthy()
      expect(scroll, mapId).toBeTruthy()
      expect(isFloor(mapId, enemy!.position.x, enemy!.position.y)).toBe(true)
      expect(isFloor(mapId, scroll!.position.x, scroll!.position.y)).toBe(true)
      expect(scroll!.guardedByEnemyId).toBe(enemy!.id)
      expect(spellForScroll(scroll!.id), scroll!.id).toBeTruthy()
    }
  })

  it('keeps a path from spawn to the exit and to the scroll after the guard falls', () => {
    for (const mapId of DUNGEON_MAP_IDS) {
      const def = MAP_DEFINITIONS[mapId]
      const enemy = enemyForMap(mapId, dungeonDepth(mapId))
      const scroll = MAP_SCROLLS.find((s) => s.mapId === mapId)
      const floorWalk = (x: number, y: number) => isFloor(mapId, x, y)

      for (const transition of def.transitions) {
        expect(
          findPath(def.spawn, transition.position, floorWalk).length,
        ).toBeGreaterThan(0)
      }

      expect(scroll).toBeTruthy()
      expect(findPath(def.spawn, scroll!.position, floorWalk).length).toBeGreaterThan(
        0,
      )

      const blockedWalk = (x: number, y: number) => {
        if (enemy && x === enemy.position.x && y === enemy.position.y) return false
        return floorWalk(x, y)
      }
      const approach = findPath(def.spawn, enemy!.position, (x, y) => {
        if (x === enemy!.position.x && y === enemy!.position.y) return true
        return blockedWalk(x, y)
      })
      expect(approach.length, mapId).toBeGreaterThan(0)
    }
  })

  it('exposes FR/EN titles for every blog scroll and unlocked spell', () => {
    for (const locale of locales) {
      const blog = dictionaries[locale].adventure.scrolls.blog
      for (const slug of BLOG_SCROLL_SLUGS) {
        expect(blog[slug].title.length).toBeGreaterThan(0)
        expect(blog[slug].excerpt.length).toBeGreaterThan(0)
      }
      for (const spell of SPELL_DEFINITIONS) {
        const label =
          dictionaries[locale].adventure.spells[
            spell.nameKey as keyof typeof dictionaries.fr.adventure.spells
          ]
        expect(label.length).toBeGreaterThan(0)
      }
    }
  })
})
