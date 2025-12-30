import { motion } from 'framer-motion'
import { BookOpen, Star, ChevronRight } from 'lucide-react'

export default function OverviewTab({ player, setActiveTab }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5]">
        <h2 className="font-display text-xl font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#7091E6]" />
          About
        </h2>
        <p className="text-[#8697C4] leading-relaxed">{player.bio}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {player.stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl bg-white border border-[#EDE8F5] text-center"
          >
            <p className="font-display text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-sm text-[#8697C4] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Latest Coach Recommendation Preview */}
      {player.coachRecommendations.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
              <Star className="w-5 h-5 text-[#7091E6]" />
              Latest Recommendation
            </h2>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className="text-sm text-[#3D52A0] font-medium flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center text-white font-bold shrink-0">
              {player.coachRecommendations[0].coach.avatar}
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a2e]">{player.coachRecommendations[0].coach.name}</h4>
              <p className="text-sm text-[#7091E6]">{player.coachRecommendations[0].coach.title}</p>
              <p className="text-[#8697C4] mt-3 leading-relaxed">"{player.coachRecommendations[0].recommendation}"</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {player.coachRecommendations[0].skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-[#EDE8F5] text-[#3D52A0] text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
