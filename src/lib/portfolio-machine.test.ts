import { describe, it, expect } from 'vitest'
import {
  buildLlmsTxt,
  buildPortfolioMachineBlocks,
  blocksToPlainText,
} from './portfolio-machine'
import { locales } from '@/i18n/dictionaries'

describe('portfolio-machine', () => {
  it('builds blocks for every locale', () => {
    for (const locale of locales) {
      const blocks = buildPortfolioMachineBlocks(locale)
      expect(blocks.some((b) => b.type === 'brand')).toBe(true)
      expect(blocks.some((b) => b.type === 'h1')).toBe(true)
      expect(blocks.filter((b) => b.type === 'link').length).toBeGreaterThan(5)
    }
  })

  it('includes llms.txt and human view links', () => {
    const blocks = buildPortfolioMachineBlocks('en')
    const links = blocks.filter((b) => b.type === 'link')
    expect(links.some((l) => l.label === 'LLMS.TXT')).toBe(true)
    expect(links.some((l) => l.label === 'HUMAN VIEW')).toBe(true)
  })

  it('exports plain text without empty sections', () => {
    const text = blocksToPlainText(buildPortfolioMachineBlocks('fr'))
    expect(text).toContain('# ')
    expect(text).toContain('[GITHUB]')
    expect(text.length).toBeGreaterThan(500)
  })

  it('builds llms.txt with canonical URLs', () => {
    const txt = buildLlmsTxt('en')
    expect(txt).toContain('https://tamsi.dev/')
    expect(txt).toContain('/machine')
    expect(txt).toContain('/sitemap.xml')
    expect(txt).toContain('llms.txt?locale=en')
    expect(txt).toContain('ai-code-reviewer-mcp')
  })
})
