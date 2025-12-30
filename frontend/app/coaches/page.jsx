'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  Award,
  Users,
  TrendingUp,
  ChevronRight,
  Medal,
  Trophy
} from 'lucide-react'

const coaches = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    title: 'Cricket Performance Coach',
    sport: 'Cricket',
    location: 'Mumbai, Maharashtra',
    experience: '12+ years',
    rating: 4.9,
    reviews: 324,
    athletes: 450,
    specialization: ['Batting', 'Mental Conditioning', 'Youth Development'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    verified: true,
    price: '₹2,500-4,000/session'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    title: 'Badminton Champion & Coach',
    sport: 'Badminton',
    location: 'Bangalore, Karnataka',
    experience: '8+ years',
    rating: 4.8,
    reviews: 198,
    athletes: 280,
    specialization: ['Singles Strategy', 'Footwork', 'Competition Prep'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    verified: true,
    price: '₹2,000-3,500/session'
  },
  {
    id: 3,
    name: 'Arjun Mehta',
    title: 'Football Tactical Analyst',
    sport: 'Football',
    location: 'Delhi, NCR',
    experience: '15+ years',
    rating: 4.9,
    reviews: 412,
    athletes: 620,
    specialization: ['Tactical Analysis', 'Set Pieces', 'Team Strategy'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    verified: true,
    price: '₹3,000-5,000/session'
  },
  {
    id: 4,
    name: 'Ananya Reddy',
    title: 'Athletics & Sprinting Coach',
    sport: 'Athletics',
    location: 'Hyderabad, Telangana',
    experience: '10+ years',
    rating: 4.7,
    reviews: 156,
    athletes: 340,
    specialization: ['Sprint Technique', 'Strength Training', 'Race Strategy'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    verified: true,
    price: '₹2,200-3,800/session'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    title: 'Tennis Performance Coach',
    sport: 'Tennis',
    location: 'Pune, Maharashtra',
    experience: '18+ years',
    rating: 4.9,
    reviews: 267,
    athletes: 380,
    specialization: ['Serve Mechanics', 'Match Psychology', 'Junior Development'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    verified: true,
    price: '₹2,800-4,500/session'
  },
  {
    id: 6,
    name: 'Meera Patel',
    title: 'Swimming Elite Coach',
    sport: 'Swimming',
    location: 'Chennai, Tamil Nadu',
    experience: '11+ years',
    rating: 4.8,
    reviews: 203,
    athletes: 290,
    specialization: ['Freestyle', 'Endurance Training', 'Competition Prep'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    verified: true,
    price: '₹2,400-3,600/session'
  }
]

export default function CoachesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const sports = ['all', 'Cricket', 'Football', 'Badminton', 'Tennis', 'Athletics', 'Swimming']

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.location.toLowerCase().includes(searchTerm.toLowerCase())
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#8697C4] mb-6"
        >
          {filteredCoaches.length} coaches found
        </motion.p>

        {/* Coaches Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredCoaches.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/coaches/${coach.id}`}>
                <div className="group bg-white rounded-[24px] p-6 border border-[#EDE8F5] hover:border-[#7091E6] hover:shadow-xl hover:shadow-[#7091E6]/5 transition-all duration-300 cursor-pointer">
                  <div className="flex gap-4">
                    {/* Profile Image */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden">
                        <img 
                          src={coach.image} 
                          alt={coach.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      {coach.verified && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-linear-to-br from-[#3D52A0] to-[#7091E6] rounded-full flex items-center justify-center">
                          <Medal className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-1">
                            {coach.name}
                          </h3>
                          <p className="text-[#8697C4] text-sm">{coach.title}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#8697C4] group-hover:text-[#7091E6] group-hover:translate-x-1 transition-all" />
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-[#1a1a2e]">{coach.rating}</span>
                          <span className="text-[#8697C4] text-sm">({coach.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8697C4] text-sm">
                          <Users className="w-4 h-4" />
                          {coach.athletes} athletes
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-[#8697C4] text-sm">
                        <MapPin className="w-4 h-4" />
                        {coach.location}
                      </div>

                      {/* Specializations */}
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

                      {/* Price and Experience */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#8697C4]">{coach.experience} exp</span>
                        <span className="font-semibold text-[#3D52A0]">{coach.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCoaches.length === 0 && (
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
            <p className="text-[#8697C4]">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
