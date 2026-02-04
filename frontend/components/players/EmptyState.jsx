import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function EmptyState() {
  const { t } = useLanguage()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
        {t('players.noPlayersFound')}
      </h3>
      <p className="text-muted-foreground">
        {t('players.tryAdjusting')}
      </p>
    </motion.div>
  )
}
