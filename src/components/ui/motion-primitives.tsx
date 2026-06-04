'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { springBouncy, springSnappy, springSoft } from '@/lib/motion'

type HoverLiftProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  lift?: number
}

export function HoverLift({
  children,
  className,
  lift = 6,
  ...props
}: HoverLiftProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -lift, scale: 1.01 }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      transition={springSnappy}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type MotionButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'primary' | 'outline'
}

export function MotionButton({
  children,
  className,
  variant = 'primary',
  onClick,
  ...props
}: MotionButtonProps) {
  const reduced = useReducedMotion()
  const base =
    variant === 'primary' ? 'portfolio-btn-primary' : 'portfolio-btn-outline'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={
        reduced
          ? undefined
          : { scale: 1.04, boxShadow: '0 0 28px var(--landing-glow-soft)' }
      }
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={springSnappy}
      className={cn(base, className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function MotionLink({
  children,
  className,
  ...props
}: HTMLMotionProps<'a'> & { children: ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.a
      whileHover={reduced ? undefined : { scale: 1.05, y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={springSoft}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  )
}

export function IconPop({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.08, rotate: 3 }}
      transition={springBouncy}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroGlowPulse({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={cn('portfolio-hero-glow', className)} aria-hidden />
  }

  return (
    <motion.div
      className={cn('portfolio-hero-glow', className)}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        className="portfolio-hero-glow-orb"
        animate={{
          scale: [1, 1.08, 1.02, 1.1, 1],
          opacity: [0.65, 0.85, 0.7, 0.9, 0.65],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

export function FloatingGlow({
  className,
  size = 400,
}: {
  className?: string
  size?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className={cn(
        'pointer-events-none absolute rounded-full bg-[var(--landing-glow-soft)] blur-[140px]',
        className,
      )}
      style={{ width: size, height: size }}
      animate={
        reduced
          ? undefined
          : {
              scale: [1, 1.15, 1.05, 1.2, 1],
              opacity: [0.4, 0.65, 0.5, 0.7, 0.4],
            }
      }
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
