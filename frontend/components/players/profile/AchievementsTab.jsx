import { motion } from 'framer-motion'
import { Trophy, CheckCircle } from 'lucide-react'

export default function AchievementsTab({ achievements }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="font-display text-xl font-bold text-[var(--color-foreground)] flex items-center gap-2">
        <Trophy className="w-5 h-5 text-[var(--color-primary)]" />
        Achievements & Awards
      </h2>
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary-bright)] transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
            <achievement.icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-[var(--color-foreground)] text-lg">{achievement.title}</h3>
            <p className="text-[var(--color-muted,#8697C4)]">{achievement.year}</p>
          </div>
          <CheckCircle className="w-6 h-6 text-green-500" />
        </motion.div>
      ))}
    </motion.div>
  )
}
