import { interestMediaById } from '@/data/interests-media'
import { CURSOR_PROFILE_URL, SITE_URL, socialLinks } from '@/data/site-links'
import {
  dictionaries,
  type Dictionary,
  type Locale,
} from '@/i18n/dictionaries'

export type MachineBlock =
  | { type: 'brand' }
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'link'; label: string; url: string }
  | { type: 'list'; items: string[] }
  | { type: 'kv'; key: string; value: string }
  | { type: 'rule' }

function bioToText(segments: Dictionary['about']['bio1']): string {
  return segments.map((s) => s.text).join('')
}

export function buildPortfolioMachineBlocks(locale: Locale): MachineBlock[] {
  const t = dictionaries[locale]
  const blocks: MachineBlock[] = []

  const push = (...items: MachineBlock[]) => blocks.push(...items)

  push({ type: 'brand' })
  push({ type: 'link', label: 'LLMS.TXT', url: `${SITE_URL}/llms.txt` })
  push({ type: 'link', label: 'HUMAN VIEW', url: `${SITE_URL}/` })
  for (const key of ['about', 'experience', 'interests', 'projects', 'contact'] as const) {
    push({
      type: 'link',
      label: t.nav[key].toUpperCase(),
      url: `${SITE_URL}/#${key}`,
    })
  }
  push({ type: 'rule' })

  push({ type: 'p', text: `${t.hero.badgeNew} · ${t.hero.badge}` })
  push({ type: 'h1', text: `${t.hero.title} — ${t.hero.titleAccent}` })
  push({ type: 'p', text: t.hero.subtitle })
  push({
    type: 'link',
    label: t.hero.ctaPrimary.toUpperCase(),
    url: `${SITE_URL}/#projects`,
  })
  push({
    type: 'link',
    label: t.hero.ctaSecondary.toUpperCase(),
    url: `${SITE_URL}/#contact`,
  })
  for (const { label, href } of socialLinks) {
    push({ type: 'link', label: label.toUpperCase(), url: href })
  }
  push({ type: 'rule' })

  push({ type: 'h2', text: t.about.title })
  push({ type: 'p', text: `"${t.about.quote}" — ${t.about.quoteAuthor}` })
  push({ type: 'p', text: bioToText(t.about.bio1) })
  push({ type: 'p', text: bioToText(t.about.bio2) })
  push({ type: 'kv', key: 'location', value: t.about.location })
  push({
    type: 'link',
    label: t.about.company.toUpperCase(),
    url: t.about.companyUrl,
  })
  push({
    type: 'link',
    label: t.about.school.toUpperCase(),
    url: t.about.schoolUrl,
  })
  push({ type: 'h3', text: t.about.focusTitle })
  push({ type: 'p', text: t.about.focusSubtitle })
  for (const item of t.about.focusItems) {
    push({ type: 'p', text: item.title })
    push({ type: 'p', text: item.description })
  }
  push({ type: 'h3', text: t.about.languagesTitle })
  for (const lang of t.about.languages) {
    push({ type: 'kv', key: lang.name, value: lang.level })
  }
  push({ type: 'rule' })

  push({ type: 'h2', text: t.experience.title })
  for (const item of t.experience.items) {
    push({ type: 'h3', text: item.title })
    push({ type: 'kv', key: 'org', value: item.org })
    push({ type: 'kv', key: 'period', value: item.period })
    push({ type: 'kv', key: 'location', value: item.location })
    push({ type: 'p', text: item.description })
  }
  push({ type: 'rule' })

  push({ type: 'h2', text: t.interests.title })
  push({ type: 'p', text: t.interests.subtitle })
  for (const group of t.interests.groups) {
    const media = interestMediaById[group.id]
    push({ type: 'h3', text: group.title })
    push({ type: 'p', text: group.description })
    push({ type: 'list', items: group.items })
    if (media) {
      push({
        type: 'link',
        label: media.linkLabel.toUpperCase(),
        url: media.link,
      })
      push({
        type: 'kv',
        key: 'demo_video',
        value: `${SITE_URL}${media.video}`,
      })
    }
  }
  push({ type: 'rule' })

  push({ type: 'h2', text: t.projects.title })
  push({ type: 'p', text: t.projects.sectionSubtitle })
  for (const project of t.projects.items) {
    const tag = project.featured ? `[${t.projects.featuredLabel}] ` : ''
    push({ type: 'h3', text: `${tag}${project.title}` })
    push({ type: 'kv', key: 'stack', value: project.language })
    push({ type: 'p', text: project.description })
    push({
      type: 'link',
      label: project.source.toUpperCase(),
      url: project.url,
    })
  }
  push({ type: 'rule' })

  push({ type: 'h2', text: t.contact.title })
  push({ type: 'p', text: t.contact.subtitle })
  push({ type: 'link', label: 'CURSOR', url: CURSOR_PROFILE_URL })
  for (const { label, href } of socialLinks) {
    push({ type: 'link', label: label.toUpperCase(), url: href })
  }
  push({
    type: 'p',
    text: t.contact.copyright.replace('{year}', String(new Date().getFullYear())),
  })

  return blocks
}

export function buildLlmsTxt(locale: Locale = 'en'): string {
  const t = dictionaries[locale]
  const lines: string[] = [
    '# Tamsi Besson',
    `> ${t.meta.description}`,
    '',
    '## Interfaces',
    `- Human (visual): ${SITE_URL}/`,
    `- Machine (structured): ${SITE_URL}/machine`,
    `- Locale: ?locale=fr | ?locale=en (default: ${locale})`,
    `- This file (FR): ${SITE_URL}/llms.txt`,
    `- This file (EN): ${SITE_URL}/llms.txt?locale=en`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
    '## Contact',
    `- Cursor: ${CURSOR_PROFILE_URL}`,
    ...socialLinks.map((l) => `- ${l.label}: ${l.href}`),
    '',
    '## Summary',
    bioToText(t.about.bio1),
    bioToText(t.about.bio2),
    '',
    '## Focus',
    ...t.about.focusItems.map((f) => `- **${f.title}**: ${f.description}`),
    '',
    '## Open source projects',
    ...t.projects.items.map(
      (p) =>
        `- ${p.title} (${p.language}): ${p.url}${p.featured ? ' [featured]' : ''} — ${p.description}`,
    ),
    '',
    '## Interests & tooling',
    ...t.interests.groups.map((g) => {
      const media = interestMediaById[g.id]
      const link = media ? ` — ${media.link}` : ''
      return `- **${g.title}**: ${g.description} (${g.items.join(', ')})${link}`
    }),
    '',
    '## Experience',
    ...t.experience.items.map(
      (e) => `- ${e.title} @ ${e.org} (${e.period}): ${e.description}`,
    ),
    '',
    '## Preferred context for agents',
    '- Stack: Next.js, TypeScript, Python, MCP, Playwright, Firebase, Drupal/Symfony',
    '- Location: Paris, France',
    '- Languages: French (native), English (professional)',
  ]
  return lines.join('\n')
}

export function blocksToPlainText(blocks: MachineBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'brand':
          return 'TAMSI'
        case 'h1':
          return `# ${block.text}`
        case 'h2':
          return `## ${block.text}`
        case 'h3':
          return `### ${block.text}`
        case 'p':
          return block.text
        case 'link':
          return `[${block.label}]\n(${block.url})`
        case 'list':
          return block.items.map((i) => `- ${i}`).join('\n')
        case 'kv':
          return `${block.key}: ${block.value}`
        case 'rule':
          return '---'
        default:
          return ''
      }
    })
    .join('\n\n')
}
