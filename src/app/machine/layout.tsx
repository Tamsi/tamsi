import { Suspense } from 'react'
import { Source_Code_Pro } from 'next/font/google'
import '@/styles/machine.css'

const sourceCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export default function MachineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={sourceCode.variable}>
      <Suspense fallback={<div className="portfolio-machine-page min-h-dvh" />}>
        {children}
      </Suspense>
    </div>
  )
}
