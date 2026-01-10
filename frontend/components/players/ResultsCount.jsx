import { motion } from 'framer-motion'

export default function ResultsCount({ count }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-6 text-muted-foreground"
    >
      Showing {count} player{count !== 1 ? 's' : ''}
    </motion.div>
  )
}
