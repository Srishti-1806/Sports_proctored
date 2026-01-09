import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function RecommendationsTab({ coachRecommendations }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="font-display text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
        <Star className="w-5 h-5 text-[#7091E6]" />
        Coach Recommendations
      </h2>
      {coachRecommendations.map((rec, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-white border border-[#EDE8F5] hover:shadow-lg transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center text-white font-bold shrink-0 text-lg">
              {rec.coach.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-[#1a1a2e] text-lg">{rec.coach.name}</h4>
                  <p className="text-[#7091E6]">{rec.coach.title}</p>
                </div>
                <span className="text-sm text-[#8697C4]">{rec.date}</span>
              </div>
              <p className="text-[#8697C4] mt-4 leading-relaxed text-lg">"{rec.recommendation}"</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {rec.skills.map((skill) => (
                  <span key={skill} className="px-4 py-1.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
