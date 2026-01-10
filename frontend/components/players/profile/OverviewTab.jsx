import { motion } from 'framer-motion'
import { BookOpen, Star, ChevronRight } from 'lucide-react'

export default function OverviewTab({ player, setActiveTab }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          About
        </h2>
        <p className="text-muted leading-relaxed">{player.bio}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {player.stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl bg-card border border-border text-center"
          >
            <p className="font-display text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Latest Coach Recommendation Preview */}
      {player.coachRecommendations.length > 0 && (
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Latest Recommendation
            </h2>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className="text-sm text-primary-deep font-medium flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center text-white font-bold shrink-0">
              {player.coachRecommendations[0].coach.avatar}
            </div>
            <div>
              <h4 className="font-bold text-foreground">{player.coachRecommendations[0].coach.name}</h4>
              <p className="text-sm text-primary">{player.coachRecommendations[0].coach.title}</p>
              <p className="text-muted mt-3 leading-relaxed">"{player.coachRecommendations[0].recommendation}"</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {player.coachRecommendations[0].skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-popover text-primary-deep text-xs font-medium">
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
