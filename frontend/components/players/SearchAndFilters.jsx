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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8697C4]" />
        <input
          type="text"
          placeholder="Search by name, sport, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#EDE8F5] focus:border-[#7091E6] focus:outline-none focus:ring-2 focus:ring-[#7091E6]/20 transition-all"
        />
      </div>

      {/* Sport Filter Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-[#8697C4] shrink-0" />
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedSport === sport
                ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white shadow-lg shadow-[#7091E6]/30'
                : 'bg-white text-[#8697C4] border border-[#EDE8F5] hover:border-[#7091E6]'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
