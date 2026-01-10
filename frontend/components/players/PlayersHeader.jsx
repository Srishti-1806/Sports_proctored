import { motion } from 'framer-motion'

export default function PlayersHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="font-display text-5xl font-bold text-foreground mb-3">
        Discover Players
      </h1>
          <p className="text-xl text-muted-foreground">
        Connect with talented players across India
      </p>
    </motion.div>
  )
}
