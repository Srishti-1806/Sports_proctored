import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <Users className="w-16 h-16 text-[#8697C4] mx-auto mb-4" />
      <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">
        No players found
      </h3>
      <p className="text-[#8697C4]">
        Try adjusting your search or filters
      </p>
    </motion.div>
  )
}
