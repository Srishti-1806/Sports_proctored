import { motion } from 'framer-motion'

export default function CoverPhoto() {
  return (
    <div className="relative h-48 md:h-64 bg-linear-to-r from-[#7091E6] via-[#3D52A0] to-[#8697C4] mb-24">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-10 right-20 w-40 h-40 rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"
        />
      </div>
    </div>
  )
}
