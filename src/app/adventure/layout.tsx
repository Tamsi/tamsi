import { Suspense } from 'react'
import '@/styles/adventure.css'

export default function AdventureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="adventure-page min-h-dvh" />}>
      {children}
    </Suspense>
  )
}
