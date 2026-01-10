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
          className="flex items-center gap-2 text-[var(--color-foreground)] hover:text-[var(--color-muted,#000000)] mb-4 transition-colors"
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
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 border-4 border-[var(--color-card)] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Info */}
        <div className="flex-1 pt-4 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-[var(--color-foreground)]">{player.name}</h1>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Active
                </span>
              </div>
              <p className="text-lg text-[var(--color-primary-bright)] font-medium">{player.sport} - {player.position}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--color-muted,#8697C4)]">
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
                    ? 'bg-[var(--color-popover)] text-[var(--color-primary-deep)] border border-[var(--color-primary-bright)]' 
                    : 'bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white shadow-lg shadow-[var(--color-primary-bright)]/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFollowing ? 'fill-[var(--color-primary-deep)]' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-primary-deep)] font-semibold hover:border-[var(--color-primary-bright)] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Connect
              </motion.button>
              <button className="p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted,#8697C4)] hover:border-[var(--color-primary-bright)] transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
