import { motion } from 'framer-motion'

export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {breakdown.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-4 rounded-2xl bg-white border border-[#EDE8F5] hover:shadow-lg transition-all group"
        >
          <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}> 
            <item.icon className="w-5 h-5 text-white" />
          </div>
          <p className="font-display text-2xl font-bold text-[#1a1a2e]">{item.score}</p>
          <p className="text-xs text-[#8697C4] mt-1">{item.name}</p>
        </motion.div>
      ))}
    </div>
  )
}
