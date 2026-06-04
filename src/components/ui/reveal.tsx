'use client'

import { motion, type Variants, useReducedMotion } from 'motion/react'
import { type ReactNode } from 'react'

type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-in'
  | 'fade'
  | 'fade-up-blur'

const ease = [0.25, 0.1, 0.25, 1] as const

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
}

const variants: Record<RevealVariant, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'fade-up-blur': {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
}

export function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants[variant]}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  stagger?: number
  delay?: number
  className?: string
  once?: boolean
  amount?: number
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
    },
  }),
}

export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className,
  once = true,
  amount = 0.15,
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      custom={stagger}
      variants={containerVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  variant?: RevealVariant
  duration?: number
  className?: string
  spring?: boolean
}

export function StaggerItem({
  children,
  variant = 'fade-up',
  duration = 0.55,
  className,
  spring = false,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={variants[variant]}
      transition={
        spring
          ? { type: 'spring', stiffness: 280, damping: 24 }
          : { duration, ease }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
