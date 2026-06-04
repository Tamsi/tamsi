import { describe, it, expect } from 'vitest'
import { dictionaries, locales, defaultLocale } from './dictionaries'

describe('dictionaries', () => {
  it('has an entry for every declared locale', () => {
    for (const loc of locales) {
      expect(dictionaries[loc]).toBeDefined()
    }
  })

  it('default locale is one of the supported locales', () => {
    expect(locales).toContain(defaultLocale)
  })

  it('keeps parallel collections in sync across locales', () => {
    const projectsCounts = locales.map((l) => dictionaries[l].projects.items.length)
    const experienceCounts = locales.map((l) => dictionaries[l].experience.items.length)
    const languageCounts = locales.map((l) => dictionaries[l].about.languages.length)
    const interestCounts = locales.map((l) => dictionaries[l].interests.groups.length)
    expect(new Set(projectsCounts).size).toBe(1)
    expect(new Set(experienceCounts).size).toBe(1)
    expect(new Set(languageCounts).size).toBe(1)
    expect(new Set(interestCounts).size).toBe(1)
  })

  it('every project has the required fields', () => {
    for (const loc of locales) {
      for (const p of dictionaries[loc].projects.items) {
        expect(p.title).toBeTruthy()
        expect(p.language).toBeTruthy()
        expect(p.url).toMatch(/^https?:\/\//)
        expect(['github', 'gitlab', 'huggingface']).toContain(p.source)
        expect(p.description).toBeTruthy()
      }
    }
  })
})
