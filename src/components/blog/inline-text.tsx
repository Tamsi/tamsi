import { parseInlineMarkup } from '@/lib/inline-markup'

export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInlineMarkup(text).map((token, index) => {
        switch (token.type) {
          case 'strong':
            return <strong key={index}>{token.value}</strong>
          case 'code':
            return <code key={index}>{token.value}</code>
          case 'link':
            return (
              <a
                key={index}
                href={token.href}
                {...(token.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {token.value}
              </a>
            )
          default:
            return <span key={index}>{token.value}</span>
        }
      })}
    </>
  )
}
