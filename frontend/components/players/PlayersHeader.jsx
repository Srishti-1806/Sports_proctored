import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function PlayersHeader() {
  const { t } = useLanguage()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="font-display text-5xl font-bold text-foreground mb-3">
        {t('players.title')}
      </h1>
      <p className="text-xl text-muted-foreground">
        {t('players.subtitle')}
      </p>
    </motion.div>
  )
}
