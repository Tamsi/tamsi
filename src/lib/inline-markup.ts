export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; value: string; href: string }

const TOKEN_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

function isSafeHref(href: string): boolean {
  return /^(https?:\/\/|\/|#|mailto:)/i.test(href)
}

export function parseInlineMarkup(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let lastIndex = 0

  for (const match of text.matchAll(TOKEN_RE)) {
    const raw = match[0]
    const index = match.index ?? 0
    if (index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, index) })
    }

    if (raw.startsWith('**')) {
      tokens.push({ type: 'strong', value: raw.slice(2, -2) })
    } else if (raw.startsWith('`')) {
      tokens.push({ type: 'code', value: raw.slice(1, -1) })
    } else {
      const link = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link && isSafeHref(link[2])) {
        tokens.push({ type: 'link', value: link[1], href: link[2] })
      } else {
        tokens.push({ type: 'text', value: raw })
      }
    }

    lastIndex = index + raw.length
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', value: text }]
}
