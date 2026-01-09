'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Award, TrendingUp,ChevronRight, Trophy, Loader2 } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const sports = ['all', 'Cricket', 'Football', 'Badminton', 'Tennis', 'Athletics', 'Swimming', 'Basketball', 'Hockey']

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'coach')

      if (error) throw error

      // Transform coaches data
      const transformedCoaches = (data || []).map(coach => {
        const athleticStats = coach.athletic_stats || {}
        const certifications = coach.certifications || []
        
        return {
          ...coach,
          full_name: coach.full_name || 'Anonymous Coach',
          profilePicture: coach.profile_picture || coach.avatar_url,
          sport: athleticStats.primarySport || coach.sport || 'N/A',
          experience: athleticStats.experience || athleticStats.age || 'N/A',
          certificationsCount: certifications.length,
          location: coach.location || 'Location not set'
        }
      })

      setCoaches(transformedCoaches)
    } catch (err) {
      console.error('Error fetching coaches:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = 
      coach.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.sport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === 'all' || coach.sport === selectedSport
    return matchesSearch && matchesSport
  })

  return (
    <div className="min-h-screen bg-[#fafbff] pt-24 pb-12">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-6xl lg:text-7xl font-bold text-[#1a1a2e] mb-4">
            Find Your Coach
          </h1>
          <p className="text-xl text-[#8697C4] max-w-2xl">
            Connect with elite coaches across India. Get personalized training and take your game to the next level.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8697C4]" />
              <input
                type="text"
                placeholder="Search by name, sport, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#EDE8F5] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none transition-all text-[#1a1a2e] placeholder:text-[#ADBBDA]"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 rounded-2xl border border-[#EDE8F5] hover:border-[#7091E6] transition-colors flex items-center gap-2 text-[#1a1a2e] font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Sport Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSport === sport
                    ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white'
                    : 'bg-white text-[#8697C4] border border-[#EDE8F5] hover:border-[#7091E6]'
                }`}
              >
                {sport === 'all' ? 'All Sports' : sport}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#8697C4] mb-6"
          >
            {filteredCoaches.length} coaches found
          </motion.p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#7091E6] animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">
              Error loading coaches
            </h3>
            <p className="text-[#8697C4] mb-4">
              {error}
            </p>
            <button
              onClick={fetchCoaches}
              className="px-6 py-3 bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Coaches Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/coaches/${coach.id}`}>
                  <div className="group bg-white rounded-3xl p-6 border border-[#EDE8F5] hover:border-[#7091E6] transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
                    <div className="flex flex-col h-full">
                      {/* Coach Image and Verified Badge */}
                      <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] overflow-hidden mx-auto">
                          {coach.profilePicture ? (
                            <img 
                              src={coach.profilePicture} 
                              alt={coach.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                              {coach.full_name?.charAt(0) || 'C'}
                            </div>
                          )}
                        </div>
                        {coach.certificationsCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-8 h-8 bg-linear-to-r from-[#3D52A0] to-[#7091E6] rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Coach Info */}
                      <div className="text-center mb-4">
                        <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-1 group-hover:text-[#7091E6] transition-colors">
                          {coach.full_name || 'Anonymous Coach'}
                        </h3>
                        <p className="text-[#8697C4] text-sm mb-2">{coach.title || coach.sport}</p>
                        
                        {/* Location */}
                        {coach.location && (
                          <div className="flex items-center justify-center gap-1 text-[#8697C4] text-sm mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{coach.location}</span>
                          </div>
                        )}

                        {/* Sport Badge */}
                        {coach.sport && (
                          <span className="inline-block px-3 py-1 bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white text-xs font-medium rounded-full">
                            {coach.sport}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[#fafbff] rounded-xl">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Award className="w-4 h-4 text-[#7091E6]" />
                            <span className="font-bold text-[#1a1a2e]">{coach.certificationsCount || 0}</span>
                          </div>
                          <p className="text-xs text-[#8697C4]">Certs</p>
                        </div>
                        <div className="text-center border-x border-[#EDE8F5]">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-bold text-[#1a1a2e]">{coach.experience}</span>
                          </div>
                          <p className="text-xs text-[#8697C4]">Experience</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-[#1a1a2e]">{(coach.achievements || []).length}</span>
                          </div>
                          <p className="text-xs text-[#8697C4]">Awards</p>
                        </div>
                      </div>

                      {/* Specializations */}
                      {coach.specialization && Array.isArray(coach.specialization) && coach.specialization.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {coach.specialization.slice(0, 2).map((spec, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 rounded-lg bg-[#EDE8F5] text-[#3D52A0] text-xs font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                          {coach.specialization.length > 2 && (
                            <span className="px-2 py-1 rounded-lg bg-[#EDE8F5] text-[#8697C4] text-xs font-medium">
                              +{coach.specialization.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* View Profile */}
                      <div className="flex items-center justify-center mt-auto pt-3 border-t border-[#EDE8F5]">
                        <div className="flex items-center gap-1 text-[#7091E6] text-sm font-medium group-hover:gap-2 transition-all">
                          <span>View Profile</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCoaches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-[#EDE8F5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#8697C4]" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">
              No coaches found
            </h3>
            <p className="text-[#8697C4] mb-4">
              {coaches.length === 0 
                ? "No coaches have signed up yet. Be the first to join as a coach!"
                : "Try adjusting your search or filters"
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
