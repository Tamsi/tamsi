'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ParticleConstellationProps {
  className?: string
  particleCount?: number
  connectionDistance?: number
  mouseRadius?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function ParticleConstellation({
  className,
  particleCount = 80,
  connectionDistance = 150,
  mouseRadius = 200,
}: ParticleConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)
  const prefersReducedMotion = useRef(false)

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
      particlesRef.current = particles
    },
    [particleCount],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      return { width: rect.width, height: rect.height }
    }

    let { width, height } = setCanvasSize()
    initParticles(width, height)

    const handleResize = () => {
      const size = setCanvasSize()
      width = size.width
      height = size.height
      initParticles(width, height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    const primaryColor = { r: 37, g: 99, b: 235 }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const particles = particlesRef.current
      const mouse = mouseRef.current

      for (const p of particles) {
        if (!prefersReducedMotion.current) {
          p.x += p.vx
          p.y += p.vy

          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1

          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * 0.02
            p.vx += dx * force
            p.vy += dy * force

            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
            const maxSpeed = 1.5
            if (speed > maxSpeed) {
              p.vx = (p.vx / speed) * maxSpeed
              p.vy = (p.vy / speed) * maxSpeed
            }
          } else {
            p.vx *= 0.999
            p.vy *= 0.999
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${p.opacity})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.2
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      const mouseDist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y)
      if (mouseDist < 10000) {
        for (const p of particles) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouseRadius) {
            const opacity = (1 - dist / mouseRadius) * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${opacity})`
            ctx.lineWidth = 0.3
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [initParticles, connectionDistance, mouseRadius])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-auto absolute inset-0 h-full w-full', className)}
    />
  )
}
