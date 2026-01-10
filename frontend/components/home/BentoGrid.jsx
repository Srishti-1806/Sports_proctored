'use client'

import { motion } from 'framer-motion'
import { Trophy, MapPin, ArrowRight, TrendingUp,Activity,Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import AvatarCircles from './AvatarCircles'

export default function BentoGrid({ onSignupClick, onLoginClick }) {
  const router = useRouter()
  const { user } = useAuth()

  const handleProfileClick = (e) => {
    e.preventDefault()
    if (user) {
      router.push('/profile')
    } else {
      onLoginClick()
    }
  }

  const handleGetStartedClick = () => {
    if (user) {
      // Check user role from metadata
      const userRole = user.user_metadata?.role || user.role
      
      if (userRole === 'player') {
        router.push('/coaches')
      } else if (userRole === 'coach') {
        router.push('/players')
      } else {
        // Default fallback if role is not set
        router.push('/coaches')
      }
    } else {
      onSignupClick()
    }
  }

  return (
    <div className="grid grid-cols-12 gap-3 auto-rows-[140px]">
      
      {/* Large Featured Card - Top Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="col-span-12 lg:col-span-5 row-span-2 rounded-[24px] bg-linear-to-br from-primary-deep to-primary-bright p-6 relative overflow-hidden group cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="relative h-full flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-4">
              FEATURED
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Find Your Coach
              <br />Across India
            </h2>
            <p className="text-primary-light text-sm sm:text-base mb-4">
              Browse coaches nationwide. Build your sports career.
            </p>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 text-white font-semibold"
            whileHover={{ x: 5 }}
          >
            <span>Build your sports profile</span>
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>

        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-8 -right-8 w-28 h-28 border border-white/20 rounded-[30px]"
        />
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
          className="col-span-6 lg:col-span-3 row-span-2 rounded-[24px] bg-card border border-border p-4 relative overflow-hidden group hover:border-primary-bright transition-colors duration-300"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-deep" />
            </div>
            <div className="text-xs text-primary-muted font-medium">LIVE</div>
          </div>
          
          <div>
            <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
              25K+
            </div>
            <div className="text-primary-muted text-xs sm:text-sm">Players Connected</div>
          </div>

          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="font-medium">+15% this month</span>
          </div>
        </div>
      </motion.div>

      {/* Performance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="col-span-6 lg:col-span-4 row-span-2 rounded-[24px] bg-card p-5 relative overflow-hidden border border-border hover:border-primary-bright transition-colors duration-300"
      >
        <div className="relative flex flex-col h-full justify-between">
          <div>
            <Activity className="w-7 h-7 text-primary-bright mb-3" />
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
              Standardized
              <br />Assessment
            </h3>
          </div>
          
          <div className="flex items-end justify-between">
            <div className="flex gap-1">
              {[40, 60, 45, 80, 55, 70, 90].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="w-1.5 bg-linear-to-t from-primary-bright to-primary-light rounded-full"
                />
              ))}
            </div>
            <div className="text-primary-bright font-display text-2xl font-bold">94%</div>
          </div>
        </div>
      </motion.div>

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="col-span-12 lg:col-span-4 row-span-1 rounded-[32px] bg-primary-soft p-6 relative overflow-hidden group cursor-pointer"
        onClick={handleGetStartedClick}
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="font-display text-lg sm:text-xl font-bold text-[#1a1a2e] mb-1">
                Start for Free
              </div>
              <div className="text-xs sm:text-sm text-[#8697C4]">No credit card required</div>
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Venue Finder */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
        className="col-span-6 lg:col-span-3 row-span-2 rounded-[32px] bg-card border border-border p-6 hover:border-primary-bright transition-colors duration-300"
      >
        <MapPin className="w-8 h-8 text-primary-bright mb-4" />
        <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
          Find Venues
        </h3>
        <p className="text-primary-muted text-xs sm:text-sm mb-4">
          450+ facilities across India
        </p>

        <div className="space-y-2">
          {[['Mumbai', '78'], ['Delhi', '65'], ['Bangalore', '52']].map(([city, count], i) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-primary-soft transition-colors"
            >
              <span className="text-sm font-medium text-foreground group-hover:text-primary-deep">{city}</span>
              <span className="text-xs text-primary-muted group-hover:text-primary-deep">{count}+</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trophy/Achievement Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="col-span-6 lg:col-span-5 row-span-2 rounded-[24px] bg-linear-to-br from-primary-deep to-primary-light p-5 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-border rounded-full" />
        
        <div className="relative flex flex-col h-full justify-between">
          <div>
            <Trophy className="w-8 h-8 text-white mb-3" />
            <h3 className="mt-5 font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              1.2K Coaches
              <br />Across India
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            <AvatarCircles
              numPeople={1200}
              avatarUrls={[
                { imageUrl: 'https://i.pravatar.cc/200?img=12', profileUrl: '#' },
                { imageUrl: 'https://i.pravatar.cc/200?img=14', profileUrl: '#' },
                { imageUrl: 'https://i.pravatar.cc/200?img=18', profileUrl: '#' },
                { imageUrl: 'https://i.pravatar.cc/200?img=21', profileUrl: '#' }
              ]}
            />
          </div>
        </div>
      </motion.div>

      {/* Success Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="col-span-6 lg:col-span-4 row-span-1 rounded-[24px] bg-card border border-border p-4 hover:border-primary-bright transition-colors duration-300"
      >
        <div className="flex items-center justify-between h-full">
            <div>
            <div className="font-display text-2xl sm:text-3xl font-bold gradient-text mb-1">
              96%
            </div>
            <div className="text-primary-muted text-xs">Success Rate</div>
          </div>
          <Award className="w-10 h-10 text-primary-bright" />
        </div>
      </motion.div>

    </div>
  )
}
