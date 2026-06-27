import type { BlogBlock } from '@/content/blog'
import { BlogImage } from '@/components/blog/blog-image'

export function ArticleContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="portfolio-article">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={index}>{block.text}</p>
          case 'heading':
            if (block.level === 2) {
              return <h2 key={index}>{block.text}</h2>
            }
            return <h3 key={index}>{block.text}</h3>
          case 'code':
            return (
              <pre key={index} data-language={block.language}>
                <code>{block.code}</code>
              </pre>
            )
          case 'list':
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          case 'image':
            return (
              <BlogImage
                key={index}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
                link={block.link}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
