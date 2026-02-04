'use client'

import { motion } from 'framer-motion'
import TextType from '../react_bits/TextType'
import { useLanguage } from '../../lib/context/LanguageContext'

export default function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 mt-8"
    >
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
