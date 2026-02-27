'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

const TRANSITION = { type: 'spring', stiffness: 120, damping: 18 } as const

interface Segment {
  id: string
  d: string
  /** Spread direction: [dx, dy] in px when hovered */
  spread: [number, number]
}

const segments: Segment[] = [
  // Outer circle (split into 4 quadrants)
  { id: 'outer-tr', d: 'M 200 20 A 180 180 0 0 1 380 200', spread: [18, -18] },
  { id: 'outer-br', d: 'M 380 200 A 180 180 0 0 1 200 380', spread: [18, 18] },
  { id: 'outer-bl', d: 'M 200 380 A 180 180 0 0 1 20 200', spread: [-18, 18] },
  { id: 'outer-tl', d: 'M 20 200 A 180 180 0 0 1 200 20', spread: [-18, -18] },

  // Horizontal parallels
  { id: 'lat-top', d: 'M 60 120 Q 200 80 340 120', spread: [0, -22] },
  { id: 'lat-mid', d: 'M 20 200 Q 200 200 380 200', spread: [0, 0] },
  { id: 'lat-bot', d: 'M 60 280 Q 200 320 340 280', spread: [0, 22] },

  // Vertical meridians
  { id: 'mer-center', d: 'M 200 20 Q 200 200 200 380', spread: [0, 0] },
  { id: 'mer-left', d: 'M 200 20 Q 120 200 200 380', spread: [-24, 0] },
  { id: 'mer-right', d: 'M 200 20 Q 280 200 200 380', spread: [24, 0] },
  { id: 'mer-far-left', d: 'M 200 20 Q 55 200 200 380', spread: [-36, 0] },
  { id: 'mer-far-right', d: 'M 200 20 Q 345 200 200 380', spread: [36, 0] },
]

export function WwwGlobe({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {segments.map(({ id, d, spread }) => (
          <motion.path
            key={id}
            d={d}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={false}
            animate={{
              x: hovered ? spread[0] : 0,
              y: hovered ? spread[1] : 0,
              opacity: hovered ? 0.35 : 0.2,
            }}
            transition={TRANSITION}
          />
        ))}
      </svg>
    </div>
  )
}
