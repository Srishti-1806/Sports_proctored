'use client'

import { motion } from 'framer-motion'
import CircularGallery from '../react_bits/CircularGallery'

const galleryItems = [
  {
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    text: 'Standardized Assessment'
  },
  {
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop',
    text: 'Global Network'
  },
  {
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop',
    text: 'Your Sports Profile'
  },
  {
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
    text: 'Track Progress'
  },
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    text: 'Connect with Coaches'
  },
  {
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
    text: 'Level Up'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-350 mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className=""
        >
          <h2 className="font-display text-6xl lg:text-7xl font-bold text-foreground">
            Key Strengths
          </h2>
        </motion.div>

        <div className="h-100 w-full">
          <CircularGallery 
            items={galleryItems}
            bend={-0.5} 
            textColor={'varforeground'} 
            borderRadius={0.05} 
            scrollEase={0.02}
            autoScrollSpeed={0.1}
          />
        </div>
      </div>
    </section>
  )
}
