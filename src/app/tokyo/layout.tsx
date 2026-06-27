import { Suspense } from 'react'
import '@/styles/tokyo.css'

export default function TokyoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="tokyo-page min-h-dvh" />}>
      {children}
    </Suspense>
  )
}
