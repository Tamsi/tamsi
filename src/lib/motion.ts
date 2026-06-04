export const easeOut = [0.25, 0.1, 0.25, 1] as const

export const springSnappy = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 28,
}

export const springSoft = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26,
}

export const springBouncy = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 18,
}

export const fadeUpBlur = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export const staggerContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})
