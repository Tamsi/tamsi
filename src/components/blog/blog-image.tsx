'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

type BlogImageProps = {
  src: string
  alt: string
  caption?: string
  className?: string
}

export function BlogImage({ src, alt, caption, className }: BlogImageProps) {
  return (
    <figure className={cn('portfolio-blog-image', className)}>
      <div className="portfolio-blog-image-frame">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="portfolio-blog-image-img"
        />
      </div>
      {caption ? (
        <figcaption className="portfolio-blog-image-caption">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
