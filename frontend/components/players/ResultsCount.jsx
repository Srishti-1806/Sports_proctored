import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function ResultsCount({ count }) {
  const { t } = useLanguage()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-6 text-muted-foreground"
    >
      {count} {t('players.results')}
    </motion.div>
  )
}
