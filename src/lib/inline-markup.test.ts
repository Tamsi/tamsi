import { describe, it, expect } from 'vitest'
import { parseInlineMarkup } from './inline-markup'

describe('parseInlineMarkup', () => {
  it('parses bold, code, and safe links', () => {
    const tokens = parseInlineMarkup(
      'See **HuggiMon** (`web/`) on [huggimon.co](https://huggimon.co).',
    )
    expect(tokens).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'strong', value: 'HuggiMon' },
      { type: 'text', value: ' (' },
      { type: 'code', value: 'web/' },
      { type: 'text', value: ') on ' },
      { type: 'link', value: 'huggimon.co', href: 'https://huggimon.co' },
      { type: 'text', value: '.' },
    ])
  })

  it('keeps javascript: links as plain text', () => {
    const tokens = parseInlineMarkup('[x](javascript:alert(1))')
    expect(tokens.every((token) => token.type !== 'link')).toBe(true)
  })
})
