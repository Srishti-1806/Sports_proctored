import { motion } from 'framer-motion'
import { Gauge, Calendar } from 'lucide-react'

export default function AssessmentsTab({ assessmentScores }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-primary" />
          Detailed Score Breakdown
        </h2>
        <div className="space-y-5">
          {assessmentScores.breakdown.map((item, index) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <span className="font-bold text-foreground">{item.score}/100</span>
              </div>
              <div className="h-3 rounded-full bg-popover overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full bg-linear-to-r ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment History */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Assessment History
        </h2>
        <div className="space-y-4">
          {[
            { date: assessmentScores.lastAssessment, score: assessmentScores.overall, change: assessmentScores.improvement },
            { date: 'Nov 15, 2024', score: (assessmentScores.overall - 4).toFixed(1), change: '+3.1%' },
            { date: 'Oct 15, 2024', score: (assessmentScores.overall - 7).toFixed(1), change: '+2.8%' },
            { date: 'Sep 15, 2024', score: (assessmentScores.overall - 10).toFixed(1), change: '+4.0%' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-popover/50 hover:bg-popover transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.date}</p>
                  <p className="text-sm text-muted">Completed Assessment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{item.score}</p>
                <p className="text-sm text-green-500">{item.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
