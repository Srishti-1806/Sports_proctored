'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import TextType from '../react_bits/TextType'
import { useLanguage } from '../../lib/context/LanguageContext'
import { useTheme } from 'next-themes'

export default function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 mt-8 relative"
    >
      {/* Physics-driven bouncing ball (canvas-like using a positioned div) */}
      <BallPhysics />
      <h1 className="font-display text-[48px] xs:text-[56px] sm:text-[80px] md:text-[100px] lg:text-[140px] font-bold leading-[0.85] tracking-tight text-foreground mb-4 sm:mb-6">
          {t('hero.title1')}
        <br />
          <span className="gradient-text">
          <TextType 
            variableSpeed={{ min: 60, max: 80 }} 
            text={[
              t('hero.network'),
              t('hero.community'),
              t('hero.platform'),
              t('hero.ecosystem'),
              t('hero.hub')
            ]} 
            deletingSpeed={100} 
            pauseDuration={2000} 
            showCursor={true} 
            onSentenceComplete={()=>{}}
          />
        </span>
      </h1>
        <p className="text-base sm:text-lg md:text-xl text-primary-muted max-w-2xl font-light">
        {t('hero.subtitle')}
      </p>
    </motion.div>
  )
}

function BallPhysics() {
  const ballRef = useRef(null)
  const containerRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const ball = ballRef.current
    const container = containerRef.current || document.body
    if (!ball) return

    // Canvas width/height
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    // Responsive scale based on viewport width (base 1440px)
    const scale = Math.min(Math.max(vw / 1440, 0.6), 1.2)

    // Initial position: near top-right (80% of width, apex)
    let x = vw * 0.8
    let y = 100

    // Initial velocities (scale horizontally with viewport)
    let dx = -5 * scale // strictly moves left
    let dy = 0  // apex of first arc

    // Adjusted gravity and ground configuration (scale gravity moderately)
    let gravity = 0.45 * Math.max(0.9, scale)
    const bounceDamping = 0.75
    // raise ground to reduce vertical travel slightly
    let groundY = Math.max(vh * 0.50, 260)

    // Responsive ball size (in px)
    let ballSize = Math.round(24 * Math.min(Math.max(scale, 0.8), 1.1))

    let rafId = null
    let restartTimer = null

    function step() {
      // apply gravity
      dy += gravity

      // integrate
      x += dx
      y += dy

      // bounce when hitting ground
      if (y >= groundY) {
        y = groundY
        dy = -Math.abs(dy) * bounceDamping
        // if bounce is very small, stop vertical motion
        if (Math.abs(dy) < 0.6) dy = 0
      }

      // apply slight horizontal friction so it slows as it moves left
      dx *= 0.999

      // update DOM
      ball.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ball.style.width = ball.style.height = ballSize + 'px'

      // when the ball leaves left side or settles near the left, restart after a short pause
      if (x < -100 || (x < vw * 0.2 && dx > -0.2 && dy === 0)) {
        cancelAnimationFrame(rafId)
        // small pause before restarting
        restartTimer = setTimeout(() => {
          // recalc viewport and ground in case of resize while paused
          vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
          const newVh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
          groundY = Math.max(newVh * 0.50, 260)
          // recalc scale and velocities
          const newScale = Math.min(Math.max(vw / 1440, 0.6), 1.2)
          x = vw * 0.8
          y = 100
          dx = -5 * newScale
          dy = 0
          gravity = 0.45 * Math.max(0.9, newScale)
          ballSize = Math.round(24 * Math.min(Math.max(newScale, 0.8), 1.1))
          // place immediately so restart looks identical to initial run
          ball.style.transform = `translate3d(${x}px, ${y}px, 0)`
          ball.style.width = ball.style.height = ballSize + 'px'
          rafId = requestAnimationFrame(step)
        }, 600)
        return
      }

      rafId = requestAnimationFrame(step)
    }

    // initial placement - set transform immediately so first run matches restarts
    ball.style.position = 'fixed'
    ball.style.left = '0'
    ball.style.top = '0'
    ball.style.willChange = 'transform'
    ball.style.width = ball.style.height = ballSize + 'px'
    ball.style.transform = `translate3d(${x}px, ${y}px, 0)`

    rafId = requestAnimationFrame(step)

    function onResize() {
      vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      const newVh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      groundY = Math.max(newVh * 0.50, 260)
    }

    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafId)
      if (restartTimer) clearTimeout(restartTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [theme])

  return (
    <div ref={containerRef} className="pointer-events-none">
      <div
        ref={ballRef}
        aria-hidden="true"
        className={`w-6 h-6 rounded-full shadow-lg ${theme === 'dark' ? 'bg-white' : 'bg-primary-bright'}`}
        style={{ transform: 'translate3d(0px, 0px, 0px)' }}
      />
    </div>
  )
}
