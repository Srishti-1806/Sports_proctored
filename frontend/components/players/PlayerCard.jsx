import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin,
  Star,
  Trophy,
  TrendingUp,
  Target,
  Flame,
  Medal
} from 'lucide-react'

export default function PlayerCard({ player, index }) {
  return (
    <Link href={`/players/${player.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(61, 82, 160, 0.15)' }}
        className="bg-white rounded-3xl overflow-hidden border border-[#EDE8F5] cursor-pointer group"
      >
        {/* Player Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={player.image}
            alt={player.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
              player.status === 'Elite Performer'
                ? 'bg-linear-to-r from-amber-500 to-yellow-400 text-white'
                : 'bg-green-100 text-green-600'
            }`}>
              <Flame className="w-3 h-3" /> {player.status}
            </span>
          </div>

          {/* Player Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display text-2xl font-bold text-white mb-1">
              {player.name}
            </h3>
            <p className="text-white/90 text-sm mb-2">
              {player.sport} - {player.position}
            </p>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {player.location}
              </span>
              <span>{player.age} yrs</span>
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-[#1a1a2e]">{player.rating}</span>
              <span className="text-[#8697C4] text-sm">({player.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              {player.improvement}
            </div>
          </div>

          {/* Overall Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#8697C4]">Overall Score</span>
              <span className="font-bold text-[#3D52A0]">{player.overallScore}</span>
            </div>
            <div className="h-2 bg-[#EDE8F5] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${player.overallScore}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                className="h-full bg-linear-to-r from-[#3D52A0] to-[#7091E6]"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#EDE8F5]">
            <div className="text-center">
              <Trophy className="w-5 h-5 text-[#7091E6] mx-auto mb-1" />
              <div className="font-bold text-[#1a1a2e] text-sm">{player.achievements}</div>
              <div className="text-xs text-[#8697C4]">Achievements</div>
            </div>
            <div className="text-center">
              <Target className="w-5 h-5 text-[#7091E6] mx-auto mb-1" />
              <div className="font-bold text-[#1a1a2e] text-sm">{player.height}</div>
              <div className="text-xs text-[#8697C4]">Height</div>
            </div>
            <div className="text-center">
              <Medal className="w-5 h-5 text-[#7091E6] mx-auto mb-1" />
              <div className="font-bold text-[#1a1a2e] text-sm">{player.trainingHours}</div>
              <div className="text-xs text-[#8697C4]">Training</div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
