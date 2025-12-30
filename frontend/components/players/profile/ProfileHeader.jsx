import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  Activity,
  Flame
} from 'lucide-react'

export default function ProfileHeader({ player, isFollowing, setIsFollowing }) {
  return (
    <div className="relative -mt-20 mb-6">
      {/* Back Button */}
      <Link href="/players">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-black hover:text-black/50 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to players
        </motion.button>
      </Link>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={player.image} 
              alt={player.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Info */}
        <div className="flex-1 pt-4 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-[#1a1a2e]">{player.name}</h1>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Active
                </span>
              </div>
              <p className="text-lg text-[#7091E6] font-medium">{player.sport} - {player.position}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#8697C4]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {player.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {player.age} years old
                </span>
                <span>{player.height} | {player.weight}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isFollowing 
                    ? 'bg-[#EDE8F5] text-[#3D52A0] border border-[#7091E6]' 
                    : 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white shadow-lg shadow-[#7091E6]/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFollowing ? 'fill-[#3D52A0]' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#ADBBDA] text-[#3D52A0] font-semibold hover:border-[#7091E6] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Connect
              </motion.button>
              <button className="p-3 rounded-xl bg-white border border-[#ADBBDA] text-[#8697C4] hover:border-[#7091E6] transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
