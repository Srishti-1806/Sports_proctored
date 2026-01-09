import { motion } from 'framer-motion'
import { Trophy, CheckCircle } from 'lucide-react'

export default function AchievementsTab({ achievements }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="font-display text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
        <Trophy className="w-5 h-5 text-[#7091E6]" />
        Achievements & Awards
      </h2>
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#EDE8F5] hover:shadow-lg hover:border-[#7091E6] transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
            <achievement.icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-[#1a1a2e] text-lg">{achievement.title}</h3>
            <p className="text-[#8697C4]">{achievement.year}</p>
          </div>
          <CheckCircle className="w-6 h-6 text-green-500" />
        </motion.div>
      ))}
    </motion.div>
  )
}
