type SkipToContentProps = {
  label: string
}

export function SkipToContent({ label }: SkipToContentProps) {
  return (
    <a href="#main-content" className="skip-to-content">
      {label}
    </a>
  )
}
