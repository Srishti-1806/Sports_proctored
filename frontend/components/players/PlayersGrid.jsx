import { motion } from 'framer-motion'
import PlayerCard from './PlayerCard'

export default function PlayersGrid({ players }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {players.map((player, index) => (
        <PlayerCard key={player.id} player={player} index={index} />
      ))}
    </motion.div>
  )
}
