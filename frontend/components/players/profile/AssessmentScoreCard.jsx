import { motion } from 'framer-motion'
import { Gauge, TrendingUp, Play } from 'lucide-react'

export default function AssessmentScoreCard({ assessmentScores }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 md:p-8 rounded-3xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl transform -translate-x-1/3 translate-y-1/3" />
      
      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5" />
            <span className="font-medium text-white/80">Overall Assessment Score</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display text-6xl md:text-7xl font-bold">{assessmentScores.overall}</span>
            <span className="text-2xl text-white/60">/100</span>
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> {assessmentScores.improvement}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span>Last: {assessmentScores.lastAssessment}</span>
            <span>Next: {assessmentScores.nextAssessment}</span>
          </div>
        </div>

        {/* Take Assessment CTA */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#3D52A0] font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            <Play className="w-5 h-5" />
            Take Proctored Assessment
          </motion.button>
          <p className="text-sm text-white/60 text-center md:text-right">
            Complete your next assessment to unlock new opportunities
          </p>
        </div>
      </div>
    </motion.div>
  )
}
