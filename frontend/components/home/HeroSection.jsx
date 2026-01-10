'use client'

import { motion } from 'framer-motion'
import TextType from '../react_bits/TextType'

export default function HeroSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 mt-8"
    >
      <h1 className="font-display text-[48px] xs:text-[56px] sm:text-[80px] md:text-[100px] lg:text-[140px] font-bold leading-[0.85] tracking-tight text-foreground mb-4 sm:mb-6">
          INDIA'S SPORTS
        <br />
          <span className="gradient-text">
          <TextType variableSpeed={{ min: 60, max: 80 }} text={["NETWORK", "COMMUNITY", "PLATFORM", "ECOSYSTEM", "HUB"]} deletingSpeed={100} pauseDuration={2000} showCursor={true} onSentenceComplete={()=>{}}/>
        </span>
      </h1>
        <p className="text-base sm:text-lg md:text-xl text-primary-muted max-w-2xl font-light">
        Connect with coaches across India. Get assessed. Level up your game.
      </p>
    </motion.div>
  )
}
