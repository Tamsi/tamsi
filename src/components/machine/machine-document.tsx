import type { MachineBlock } from '@/lib/portfolio-machine'

function MachineLink({ label, url }: { label: string; url: string }) {
  const external = url.startsWith('http') || url.startsWith('mailto:')
  return (
    <a
      href={url}
      className="portfolio-machine-link"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="machine-link-label">[{label}]</span>
      <span className="machine-link-url">({url})</span>
    </a>
  )
}

export function MachineDocument({ blocks }: { blocks: MachineBlock[] }) {
  return (
    <article className="portfolio-machine-doc">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'brand':
            return (
              <p key={i} className="machine-brand">
                TAMSI
              </p>
            )
          case 'h1':
            return (
              <h1 key={i} className="machine-h1">
                {block.text}
              </h1>
            )
          case 'h2':
            return (
              <h2 key={i} className="machine-h2">
                {block.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i} className="machine-h3">
                {block.text}
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="machine-p">
                {block.text}
              </p>
            )
          case 'link':
            return <MachineLink key={i} label={block.label} url={block.url} />
          case 'list':
            return (
              <ul key={i} className="machine-list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          case 'kv':
            return (
              <p key={i} className="machine-kv">
                <strong>{block.key}:</strong> {block.value}
              </p>
            )
          case 'rule':
            return <hr key={i} className="machine-rule" />
          default:
            return null
        }
      })}
    </article>
  )
}
