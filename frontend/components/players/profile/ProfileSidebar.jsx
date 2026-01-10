import { motion } from 'framer-motion'
import { Video, Play, TrendingUp, Flame, Mail, MapPin } from 'lucide-react'

export default function ProfileSidebar({ player }) {
  return (
    <div className="space-y-6">
      {/* Take Assessment Card */}
      <div className="p-6 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold">Proctored Assessment</h3>
            <p className="text-sm text-white/70">Verify your skills</p>
          </div>
        </div>
        <p className="text-white/80 text-sm mb-4">
          Complete an AI-monitored assessment to validate your athletic abilities and unlock new opportunities.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-card text-primary-deep font-semibold flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start Assessment
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Performance Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted">Current Rank</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              #{player.performanceStats.currentRank} <TrendingUp className="w-4 h-4 text-green-500" />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Training Streak</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" /> {player.performanceStats.trainingStreak} days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Weekly Hours</span>
            <span className="font-bold text-foreground">{player.performanceStats.weeklyHours} hrs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Improvement</span>
            <span className="font-bold text-green-500">{player.assessmentScores.improvement}</span>
          </div>
        </div>
      </div>

      {/* Contact Card */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Connect</h3>
        <div className="space-y-3">
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-popover transition-colors">
            <Mail className="w-5 h-5 text-primary-bright" />
            <span className="text-muted">{player.name.toLowerCase().replace(' ', '.')}@email.com</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-popover transition-colors">
            <MapPin className="w-5 h-5 text-primary-bright" />
            <span className="text-muted">{player.location}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
