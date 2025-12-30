'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Star, Clock, Phone, Globe, Navigation, ChevronRight, X, Heart, Share2, Dumbbell, Waves, Target, Footprints, Trophy, CheckCircle, Compass, Layers, ZoomIn, ZoomOut, LocateFixed } from 'lucide-react'

export default function StadiumsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Venues', icon: Layers },
    { id: 'stadium', label: 'Stadiums', icon: Trophy },
    { id: 'gym', label: 'Gyms', icon: Dumbbell },
    { id: 'pool', label: 'Pools', icon: Waves },
    { id: 'court', label: 'Courts', icon: Target },
    { id: 'track', label: 'Tracks', icon: Footprints }
  ]

  const venues = [
    {
      id: 1,
      name: 'Miami Sports Arena',
      type: 'Stadium',
      typeIcon: Trophy,
      rating: 4.8,
      reviews: 342,
      distance: '0.8 mi',
      address: '1234 Sports Boulevard, Miami, FL 33101',
      phone: '+1 (305) 555-0123',
      website: 'www.miamisportsarena.com',
      hours: 'Open 6:00 AM - 11:00 PM',
      isOpen: true,
      price: '$$$',
      amenities: ['Parking', 'Lockers', 'Showers', 'Pro Shop', 'Café'],
      sports: ['Basketball', 'Volleyball', 'Wrestling'],
      images: 3,
      isFavorite: true,
      featured: true,
      description: 'State-of-the-art multi-sport arena featuring Olympic-standard facilities and seating for 15,000 spectators.'
    },
    {
      id: 2,
      name: 'Elite Performance Center',
      type: 'Gym',
      typeIcon: Dumbbell,
      rating: 4.9,
      reviews: 567,
      distance: '1.2 mi',
      address: '567 Fitness Lane, Miami, FL 33102',
      phone: '+1 (305) 555-0456',
      website: 'www.eliteperformance.com',
      hours: 'Open 24 Hours',
      isOpen: true,
      price: '$$',
      amenities: ['Free Weights', 'Cardio Zone', 'Personal Training', 'Sauna', 'Juice Bar'],
      sports: ['Weightlifting', 'CrossFit', 'Boxing'],
      images: 5,
      isFavorite: false,
      featured: true,
      description: 'Premier fitness facility with cutting-edge equipment and world-class trainers.'
    },
    {
      id: 3,
      name: 'Aquatic Sports Complex',
      type: 'Pool',
      typeIcon: Waves,
      rating: 4.7,
      reviews: 189,
      distance: '2.1 mi',
      address: '890 Ocean Drive, Miami Beach, FL 33139',
      phone: '+1 (305) 555-0789',
      website: 'www.miamiaquatics.com',
      hours: 'Open 5:30 AM - 9:00 PM',
      isOpen: true,
      price: '$$',
      amenities: ['Olympic Pool', 'Diving Boards', 'Hot Tub', 'Lessons', 'Team Training'],
      sports: ['Swimming', 'Diving', 'Water Polo'],
      images: 4,
      isFavorite: true,
      featured: false,
      description: 'Olympic-sized swimming facility with professional coaching and competitive training programs.'
    },
    {
      id: 4,
      name: 'Riverside Tennis Club',
      type: 'Court',
      typeIcon: Target,
      rating: 4.6,
      reviews: 234,
      distance: '3.5 mi',
      address: '456 Court Lane, Coral Gables, FL 33146',
      phone: '+1 (305) 555-0321',
      website: 'www.riversidetennisclub.com',
      hours: 'Open 7:00 AM - 10:00 PM',
      isOpen: true,
      price: '$$$',
      amenities: ['12 Courts', 'Pro Shop', 'Ball Machine', 'Coaching', 'Restaurant'],
      sports: ['Tennis', 'Pickleball'],
      images: 6,
      isFavorite: false,
      featured: false,
      description: 'Exclusive tennis club with pristine hard and clay courts, professional instruction available.'
    },
    {
      id: 5,
      name: 'Community Athletics Track',
      type: 'Track',
      typeIcon: Footprints,
      rating: 4.4,
      reviews: 156,
      distance: '1.8 mi',
      address: '321 Runner Way, Miami, FL 33125',
      phone: '+1 (305) 555-0654',
      website: 'www.miamitrack.org',
      hours: 'Open 5:00 AM - 9:00 PM',
      isOpen: true,
      price: '$',
      amenities: ['400m Track', 'Field Events', 'Bleachers', 'Restrooms', 'Water Stations'],
      sports: ['Track & Field', 'Running', 'Walking'],
      images: 2,
      isFavorite: false,
      featured: false,
      description: 'Public athletics track with professional-grade surface, perfect for training and competitions.'
    },
    {
      id: 6,
      name: 'Downtown Basketball Courts',
      type: 'Court',
      typeIcon: Target,
      rating: 4.3,
      reviews: 412,
      distance: '0.5 mi',
      address: '100 Main Street, Miami, FL 33130',
      phone: '+1 (305) 555-0987',
      website: 'www.miamiparks.gov/basketball',
      hours: 'Open 6:00 AM - 10:00 PM',
      isOpen: true,
      price: 'Free',
      amenities: ['4 Courts', 'Lights', 'Water Fountain', 'Benches'],
      sports: ['Basketball', '3x3 Basketball'],
      images: 3,
      isFavorite: true,
      featured: false,
      description: 'Popular outdoor basketball courts in the heart of downtown. Daily pickup games and leagues.'
    }
  ]

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || venue.address.toLowerCase().includes(searchQuery.toLowerCase()) || venue.sports.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = activeFilter === 'all' || venue.type.toLowerCase() === activeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* Header */}
      <div className="bg-linear-to-r from-[#3D52A0] to-[#7091E6] pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold text-white mb-4">
              Discover Venues
            </h1>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8697C4]" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7091E6] text-[#1a1a2e]"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#3D52A0] font-semibold"
              >
                <LocateFixed className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-20">
              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-100 lg:h-175 rounded-2xl overflow-hidden"
              >

                {/* Simulated Map Elements */}
                <div className="absolute inset-0 p-6">

                  {/* Venue Markers */}
                  {venues.slice(0, 5).map((venue, index) => {
                    const positions = [
                      { top: '20%', left: '30%' },
                      { top: '35%', left: '60%' },
                      { top: '50%', left: '25%' },
                      { top: '65%', left: '70%' },
                      { top: '80%', left: '45%' }
                    ]
                    return (
                      <motion.div
                        key={venue.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedVenue(venue)}
                        className="absolute cursor-pointer"
                        style={positions[index]}
                      >
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                              selectedVenue?.id === venue.id
                                ? 'bg-[#3D52A0] ring-4 ring-[#7091E6]/50'
                                : 'bg-linear-to-br from-[#3D52A0] to-[#7091E6]'
                            }`}
                          >
                            <venue.typeIcon className="w-5 h-5 text-white" />
                          </motion.div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#3D52A0] rotate-45" />
                        </div>
                      </motion.div>
                    )
                  })}

                  {/* Current Location Marker */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-[#7091E6]/20 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#7091E6]/40 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-[#3D52A0] border-3 border-white shadow-lg" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors">
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors">
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors">
                    <Compass className="w-5 h-5" />
                  </button>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7091E6]" />
                    <span className="text-sm font-medium text-[#1a1a2e]">
                      {filteredVenues.length} venues
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Venues List */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Filters */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeFilter === filter.id
                      ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white shadow-lg'
                      : 'bg-white text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5] border border-[#EDE8F5]'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-[#8697C4]">
                <span className="font-semibold text-[#1a1a2e]">{filteredVenues.length}</span> found
              </p>
            </div>

            {/* Venues List */}
            <div className="space-y-3">
              {filteredVenues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedVenue(venue)}
                  className={`p-4 rounded-xl bg-white border hover:shadow-lg hover:border-[#7091E6] transition-all cursor-pointer group ${
                    selectedVenue?.id === venue.id ? 'border-[#7091E6] shadow-md' : 'border-[#EDE8F5]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#EDE8F5] to-[#ADBBDA] flex items-center justify-center shrink-0">
                      <venue.typeIcon className="w-6 h-6 text-[#7091E6]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#1a1a2e] group-hover:text-[#3D52A0] transition-colors truncate">
                          {venue.name}
                        </h3>
                        {venue.isOpen && (
                          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#8697C4]">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold text-[#1a1a2e]">{venue.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{venue.distance}</span>
                        <span>•</span>
                        <span>{venue.type}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[#ADBBDA] group-hover:text-[#7091E6] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Venue Detail Modal */}
      <AnimatePresence>
        {selectedVenue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedVenue(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header Image */}
              <div className="relative h-48 bg-linear-to-br from-[#3D52A0] to-[#7091E6] rounded-t-3xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <selectedVenue.typeIcon className="w-20 h-20 text-white/30" />
                </div>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute top-4 left-4 flex gap-2">
                  {selectedVenue.featured && (
                    <span className="px-3 py-1 rounded-lg bg-linear-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold">
                      Featured
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-lg bg-white/20 text-white text-sm font-medium">
                    {selectedVenue.type}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="font-display text-2xl font-bold text-white">{selectedVenue.name}</h2>
                  <div className="flex items-center gap-3 mt-2 text-white/80">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{selectedVenue.rating}</span>
                      <span>({selectedVenue.reviews} reviews)</span>
                    </div>
                    <span>•</span>
                    <span>{selectedVenue.distance}</span>
                    <span>•</span>
                    <span>{selectedVenue.price}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#EDE8F5]">
                    <div className="flex items-center gap-2 text-[#3D52A0] mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Hours</span>
                    </div>
                    <p className="font-semibold text-[#1a1a2e]">{selectedVenue.hours}</p>
                    <span className={`text-xs ${selectedVenue.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {selectedVenue.isOpen ? 'Currently Open' : 'Currently Closed'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EDE8F5]">
                    <div className="flex items-center gap-2 text-[#3D52A0] mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{selectedVenue.address}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-display font-bold text-[#1a1a2e] mb-2">About</h3>
                  <p className="text-[#8697C4] leading-relaxed">{selectedVenue.description}</p>
                </div>

                {/* Sports */}
                <div>
                  <h3 className="font-display font-bold text-[#1a1a2e] mb-3">Available Sports</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.sports.map((sport) => (
                      <span 
                        key={sport}
                        className="px-4 py-2 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-medium text-sm"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-display font-bold text-[#1a1a2e] mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.amenities.map((amenity) => (
                      <span 
                        key={amenity}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#EDE8F5] text-[#3D52A0] text-sm"
                      >
                        <CheckCircle className="w-4 h-4" /> {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={`tel:${selectedVenue.phone}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/50 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-[#3D52A0]" />
                    <div>
                      <p className="text-xs text-[#8697C4]">Phone</p>
                      <p className="font-medium text-[#1a1a2e]">{selectedVenue.phone}</p>
                    </div>
                  </a>
                  <a 
                    href={`https://${selectedVenue.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/50 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-[#3D52A0]" />
                    <div>
                      <p className="text-xs text-[#8697C4]">Website</p>
                      <p className="font-medium text-[#1a1a2e] truncate">{selectedVenue.website}</p>
                    </div>
                  </a>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg"
                  >
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </motion.button>
                  <button className="p-4 rounded-xl border border-[#ADBBDA] text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors">
                    <Heart className={`w-5 h-5 ${selectedVenue.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button className="p-4 rounded-xl border border-[#ADBBDA] text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}