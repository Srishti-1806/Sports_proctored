import { motion } from 'framer-motion'
import { Activity, Dumbbell } from 'lucide-react'

export default function TrainingTab({ trainingHistory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
        <h2 className="font-display text-xl font-bold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--color-primary-bright)]" />
          Recent Training Sessions
        </h2>
        <div className="space-y-3">
          {trainingHistory.map((session, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-popover)/50] hover:bg-[var(--color-popover)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-card)] flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-[var(--color-primary-bright)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-foreground)]">{session.type}</p>
                  <p className="text-sm text-[var(--color-muted,#8697C4)]">{session.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-[var(--color-foreground)]">{session.duration}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  session.intensity === 'High' ? 'bg-red-100 text-red-600' :
                  session.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {session.intensity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
