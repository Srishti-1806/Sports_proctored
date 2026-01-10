import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'

export default function SearchAndFilters({ 
  searchQuery, 
  setSearchQuery, 
  selectedSport, 
  setSelectedSport 
}) {
  const sports = ['All Sports', 'Basketball', 'Badminton', 'Football', 'Athletics', 'Tennis', 'Swimming']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, sport, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border focus:border-primary-bright focus:outline-none focus:ring-2 focus:ring-primary-bright/20 transition-all"
        />
      </div>

      {/* Sport Filter Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedSport === sport
                ? 'bg-linear-to-r from-primary-deep to-primary-bright text-white shadow-lg shadow-primary-bright/30'
                : 'bg-card text-muted-foreground border border-border hover:border-primary-bright'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
