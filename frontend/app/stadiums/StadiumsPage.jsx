'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Star, Clock, Phone, Globe, Navigation, ChevronRight, X, Heart, Share2, Dumbbell, Waves, Target, Footprints, Trophy, CheckCircle, Compass, Layers, ZoomIn, ZoomOut, Home, Activity, MapPinned } from 'lucide-react'
import StadiumMap from '@/components/stadiums/StadiumMap'

export default function StadiumsPage() {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [activeFilter, setActiveFilter] = useState('all')
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const geocodeCacheRef = useRef(new Map())

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedVenue) {
      // Lock body scroll
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow || ''
      }
    }
  }, [selectedVenue])

  // Get user's location with improved fallback
  useEffect(() => {
    // Function to get location from IP address
    const getLocationFromIP = async () => {
      try {
        console.log('Attempting to get location from IP address...');
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          console.log('✓ Location from IP:', data.city, data.country_name);
          setUserLocation({
            longitude: data.longitude,
            latitude: data.latitude
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error getting location from IP:', error);
        return false;
      }
    };

    if (navigator.geolocation) {
      // First attempt: Try high accuracy with shorter timeout
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✓ GPS location obtained');
          setUserLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        },
        (error) => {
          console.log('⚠ High accuracy GPS failed:', error.message, '- Trying low accuracy...');
          
          // Second attempt: Try with low accuracy (faster, more reliable)
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('✓ Low accuracy location obtained');
              setUserLocation({
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
              });
            },
            async (error) => {
              console.log('⚠ Low accuracy GPS also failed:', error.message, '- Trying IP location...');
              // Try to get location from IP address
              const ipLocationSuccess = await getLocationFromIP();
              if (!ipLocationSuccess) {
                console.log('ℹ Using default location (New Delhi)');
                setUserLocation({ longitude: 77.2090, latitude: 28.6139 });
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 300000 // Accept cached position up to 5 minutes old
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        }
      );
    } else {
      // No geolocation support, try IP-based location
      console.log('Geolocation not supported, trying IP-based location');
      getLocationFromIP().then((success) => {
        if (!success) {
          console.log('Falling back to default location (New Delhi)');
          setUserLocation({ longitude: 77.2090, latitude: 28.6139 });
        }
      });
    }
  }, []);

  // Fetch real venues from OpenStreetMap via Overpass API
  useEffect(() => {
    if (!userLocation) return;

    const fetchVenues = async () => {
      setLoading(true);
      try {
        // Call our backend API endpoint with increased radius to fetch more venues
        const response = await fetch(
          `/api/nearby-sports?lat=${userLocation.latitude}&lon=${userLocation.longitude}&radius=50000`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch sports facilities');
        }

        const data = await response.json();

        // Transform facilities to match our venue structure
        const transformedVenues = await Promise.all(
          data.facilities.map(async (facility, index) => {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              facility.latitude,
              facility.longitude
            );

            // Get human-readable address
            const address = await reverseGeocode(facility.longitude, facility.latitude);

            // Format sports description if available
            let sportsDescription = '';
            if (facility.sport) {
              const sports = facility.sport.includes(';') 
                ? facility.sport.split(';').map(s => s.trim())
                : [facility.sport];
              
              const formattedSports = sports.map(s => 
                s.split(/[_\s]/)
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')
              );
              
              if (formattedSports.length > 3) {
                sportsDescription = ` offering ${formattedSports.length} sports including ${formattedSports.slice(0, 3).join(', ')} and more`;
              } else if (formattedSports.length > 0) {
                sportsDescription = ` for ${formattedSports.join(', ')}`;
              }
            }

            return {
              id: facility.id,
              name: facility.name || `${mapFacilityType(facility.type)}${facility.sport ? ` (${facility.sport})` : ''}`,
              type: mapFacilityType(facility.type),
              typeIcon: getIconForType(facility.type),
              rating: null,
              reviews: null,
              distance: formatDistance(distance),
              distanceValue: distance,
              address: address,
              coordinates: [facility.longitude, facility.latitude],
              phone: 'Contact information not available',
              website: 'N/A',
              hours: 'Check local hours',
              isOpen: true,
              price: 'N/A',
              amenities: getAmenitiesForType(facility.type, facility.tags),
              sports: getSportsForType(facility.type, facility.sport),
              images: 1,
              isFavorite: false,
              featured: false,
              description: `${facility.name || 'Sports facility'} - ${mapFacilityType(facility.type)}${sportsDescription}`
            };
          })
        );

        // Sort by distance (nearest first)
        transformedVenues.sort((a, b) => a.distanceValue - b.distanceValue);

        setVenues(transformedVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [userLocation]);

  const filters = [
    { id: 'all', label: 'All Venues', icon: Layers },
    { id: 'stadium', label: 'Stadiums', icon: Trophy },
    { id: 'sports_centre', label: 'Sports Centres', icon: Activity },
    { id: 'sports_hall', label: 'Sports Halls', icon: Home },
    { id: 'gym', label: 'Gyms & Fitness', icon: Dumbbell },
    { id: 'pool', label: 'Pools', icon: Waves },
    { id: 'pitch', label: 'Playing Fields', icon: Target },
    { id: 'track', label: 'Tracks', icon: Footprints },
    { id: 'golf', label: 'Golf Courses', icon: Target },
    { id: 'recreation', label: 'Recreation', icon: MapPinned }
  ]

  // Helper functions
  async function reverseGeocode(longitude, latitude) {
    // Use a lightweight cache to avoid spamming the geocoding API
    const cacheKey = `${longitude},${latitude}`
    const cache = geocodeCacheRef.current
    if (cache.has(cacheKey)) return cache.get(cacheKey)

    // If no Mapbox token is configured, return coords fallback
    if (!accessToken) {
      const fallback = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`
      cache.set(cacheKey, fallback)
      return fallback
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(longitude)},${encodeURIComponent(latitude)}.json?access_token=${encodeURIComponent(accessToken)}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Geocoding HTTP ${response.status}`)
      }
      const data = await response.json()
      const place = data.features && data.features.length > 0 ? data.features[0].place_name : null
      const result = place || `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`
      cache.set(cacheKey, result)
      return result
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      const fallback = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`
      cache.set(cacheKey, fallback)
      return fallback
    }
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function formatDistance(km) {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  }

  function mapFacilityType(osmType) {
    const mapping = {
      'stadium': 'Stadium',
      'sports_centre': 'Sports Centre',
      'sports_hall': 'Sports Hall',
      'gym': 'Gym / Fitness Centre',
      'fitness_station': 'Fitness Station',
      'pitch': 'Playing Field',
      'track': 'Track',
      'swimming_pool': 'Swimming Pool',
      'ice_rink': 'Ice Rink',
      'horse_riding': 'Horse Riding',
      'golf_course': 'Golf Course',
      'miniature_golf': 'Mini Golf',
      'recreation_ground': 'Recreation Ground',
      'school_sports': 'School Sports Facility',
      'sports_facility': 'Sports Facility'
    };
    return mapping[osmType] || 'Sports Venue';
  }

  function getIconForType(osmType) {
    const mapping = {
      'stadium': Trophy,
      'sports_centre': Target,
      'sports_hall': Target,
      'gym': Dumbbell,
      'fitness_station': Dumbbell,
      'pitch': Footprints,
      'track': Footprints,
      'swimming_pool': Waves,
      'ice_rink': Waves,
      'horse_riding': Target,
      'golf_course': Target,
      'miniature_golf': Target,
      'recreation_ground': Waves,
      'school_sports': Target,
      'sports_facility': Trophy
    };
    return mapping[osmType] || Trophy;
  }

  function getAmenitiesForType(osmType, tags = {}) {
    const baseAmenities = {
      'stadium': ['Seating', 'Restrooms', 'Parking'],
      'sports_centre': ['Multiple Sports', 'Lockers', 'Equipment'],
      'sports_hall': ['Indoor Sports', 'Lockers', 'Equipment'],
      'gym': ['Weights', 'Cardio Equipment', 'Showers', 'Lockers'],
      'fitness_station': ['Outdoor Workout', 'Free Access'],
      'pitch': ['Playing Field', 'Goals/Posts'],
      'track': ['Running Track', 'Lanes'],
      'swimming_pool': ['Pool', 'Changing Rooms', 'Lockers'],
      'ice_rink': ['Ice Surface', 'Skate Rental', 'Changing Rooms'],
      'horse_riding': ['Horses', 'Riding Arena', 'Lessons'],
      'golf_course': ['Golf Holes', 'Club House', 'Parking'],
      'miniature_golf': ['Mini Golf', 'Family Friendly'],
      'recreation_ground': ['Open Space', 'Multi-use'],
      'school_sports': ['School Facility', 'Limited Access'],
    };

    const amenities = baseAmenities[osmType] || ['Sports Facility'];
    
    if (tags.surface) amenities.push(`Surface: ${tags.surface}`);
    if (tags.access) amenities.push(`Access: ${tags.access}`);
    if (tags.capacity) amenities.push(`Capacity: ${tags.capacity}`);
    
    return amenities;
  }

  function getSportsForType(osmType, sport) {
    if (sport) {
      // Handle semicolon-separated sports
      const sports = sport.includes(';') 
        ? sport.split(';').map(s => s.trim())
        : [sport];
      
      // Format each sport name properly
      return sports.map(s => 
        s.split(/[_\s]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      );
    }

    const defaultSports = {
      'stadium': ['Football', 'Athletics', 'Events'],
      'sports_centre': ['Multiple Sports'],
      'sports_hall': ['Indoor Sports'],
      'gym': ['Fitness', 'Strength Training', 'Cardio'],
      'fitness_station': ['Bodyweight Training', 'Outdoor Fitness'],
      'pitch': ['Football', 'Cricket', 'Rugby'],
      'track': ['Running', 'Athletics'],
      'swimming_pool': ['Swimming', 'Diving', 'Water Sports'],
      'ice_rink': ['Ice Skating', 'Hockey'],
      'horse_riding': ['Equestrian', 'Horse Riding'],
      'golf_course': ['Golf'],
      'miniature_golf': ['Mini Golf'],
      'recreation_ground': ['Various Sports'],
      'school_sports': ['Various Sports'],
    };

    return defaultSports[osmType] || ['Sports'];
  }

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || venue.address.toLowerCase().includes(searchQuery.toLowerCase()) || venue.sports.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (activeFilter === 'all') {
      return matchesSearch;
    }
    
    // Map filter IDs to facility types
    const filterMap = {
      'stadium': ['stadium'],
      'sports_centre': ['sports centre', 'sports_centre'],
      'sports_hall': ['sports hall', 'sports_hall'],
      'gym': ['gym / fitness centre', 'gym', 'fitness centre', 'fitness_centre', 'fitness station', 'fitness_station'],
      'pool': ['swimming pool', 'swimming_pool'],
      'pitch': ['playing field', 'pitch'],
      'track': ['track'],
      'golf': ['golf course', 'golf_course', 'mini golf', 'miniature_golf'],
      'recreation': ['recreation ground', 'recreation_ground', 'ice rink', 'ice_rink', 'horse riding', 'horse_riding']
    };
    
    const matchingTypes = filterMap[activeFilter] || [];
    const matchesFilter = matchingTypes.some(type => venue.type.toLowerCase().includes(type));
    
    return matchesSearch && matchesFilter;
  })

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* Header */}
      <div className="bg-linear-to-r from-[#3D52A0] to-[#7091E6] pt-4 pb-3 sm:pt-6 sm:pb-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
              Discover Sports Facilities
            </h1>

            {/* Search Bar */}
              <div className="flex gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#8697C4]" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7091E6] text-sm sm:text-base text-[#1a1a2e]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Map Section */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="lg:sticky lg:top-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-75 sm:h-100 lg:h-175 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
                style={{ minHeight: '300px' }}
              >
                {accessToken ? (
                  <div className="w-full h-full">
                    <StadiumMap
                      accessToken={accessToken}
                      venues={filteredVenues}
                      selectedVenue={selectedVenue}
                      onVenueSelect={setSelectedVenue}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-[#EDE8F5] to-[#ADBBDA] flex items-center justify-center">
                    <div className="text-center p-4 sm:p-8">
                      <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-[#7091E6] mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-bold text-[#3D52A0] mb-2">
                        Map Loading...
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8697C4]">
                        Please ensure Mapbox token is configured
                      </p>
                    </div>
                  </div>
                )}

                {/* Map Legend Overlay */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/90 backdrop-blur-sm shadow-lg z-10 pointer-events-none">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#7091E6]" />
                    <span className="text-xs sm:text-sm font-medium text-[#1a1a2e]">
                      {filteredVenues.length} venues
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Venues List */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            {/* Filters */}
            <div className="flex overflow-x-auto gap-2 mb-3 sm:mb-4 pb-2 scrollbar-hide">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
                    activeFilter === filter.id
                      ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white shadow-lg'
                      : 'bg-white text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5] border border-[#EDE8F5]'
                  }`}
                >
                  <filter.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-[#8697C4]">
                {loading ? (
                  <span>Loading venues...</span>
                ) : (
                  <>
                    <span className="font-semibold text-[#1a1a2e]">{filteredVenues.length}</span> found nearby
                  </>
                )}
              </p>
            </div>

            {/* Venues List */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D52A0] mx-auto mb-4"></div>
                    <p className="text-[#8697C4]">Finding venues near you...</p>
                  </div>
                </div>
              ) : filteredVenues.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-[#8697C4] mx-auto mb-4" />
                  <p className="text-[#8697C4]">No venues found</p>
                </div>
              ) : (
                filteredVenues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedVenue(venue)}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white border hover:shadow-lg hover:border-[#7091E6] transition-all cursor-pointer group ${
                    selectedVenue?.id === venue.id ? 'border-[#7091E6] shadow-md' : 'border-[#EDE8F5]'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-[#EDE8F5] to-[#ADBBDA] flex items-center justify-center shrink-0">
                      <venue.typeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#7091E6]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-[#1a1a2e] group-hover:text-[#3D52A0] transition-colors mb-1">
                        {venue.name}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-[#8697C4] mb-1.5 sm:mb-2 line-clamp-2">
                        {venue.address}
                      </p>

                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#8697C4]">
                        <span>{venue.distance}</span>
                        <span>•</span>
                        <span className="truncate">{venue.type}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#ADBBDA] group-hover:text-[#7091E6] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </motion.div>
              )))}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedVenue(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full sm:h-auto max-w-none sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-white rounded-none sm:rounded-xl shadow-2xl my-0 sm:my-6 flex flex-col overflow-hidden"
              style={{ maxHeight: '100vh' }}
            >
              {/* Header Image */}
              <div className="relative h-32 sm:h-40 md:h-48 bg-linear-to-br from-[#3D52A0] to-[#7091E6] rounded-t-none sm:rounded-t-xl shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <selectedVenue.typeIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/30" />
                </div>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 flex gap-1.5 sm:gap-2 flex-wrap">
                  {selectedVenue.featured && (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm bg-linear-to-r from-yellow-400 to-orange-400 text-white font-bold">
                      Featured
                    </span>
                  )}
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm bg-white/20 text-white font-medium">
                    {selectedVenue.type}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 md:bottom-4 md:left-4 md:right-4">
                  <h2 className="font-display text-base sm:text-xl md:text-2xl font-bold text-white line-clamp-2">{selectedVenue.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 md:mt-2 text-xs sm:text-sm text-white/80">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{selectedVenue.distance}</span>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable Area */}
              <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin scrollbar-thumb-[#ADBBDA] scrollbar-track-[#EDE8F5] hover:scrollbar-thumb-[#7091E6]">
                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[#EDE8F5] min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[#3D52A0] mb-1">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Hours</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-[#1a1a2e] wrap-break-word">{selectedVenue.hours}</p>
                    <span className={`text-[10px] sm:text-xs ${selectedVenue.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {selectedVenue.isOpen ? 'Currently Open' : 'Currently Closed'}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[#EDE8F5] min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[#3D52A0] mb-1">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Location</span>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#1a1a2e] wrap-break-word">{selectedVenue.address}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#1a1a2e] mb-1.5 sm:mb-2">About</h3>
                  <p className="text-xs sm:text-sm text-[#8697C4] leading-relaxed wrap-break-word">{selectedVenue.description}</p>
                </div>

                {/* Sports */}
                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#1a1a2e] mb-2 sm:mb-3">Available Sports</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedVenue.sports.map((sport) => (
                      <span 
                        key={sport}
                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg sm:rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-medium text-xs sm:text-sm wrap-break-word"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#1a1a2e] mb-2 sm:mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedVenue.amenities.map((amenity) => (
                      <span 
                        key={amenity}
                        className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 rounded-lg sm:rounded-xl bg-[#EDE8F5] text-[#3D52A0] text-xs sm:text-sm wrap-break-word"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" /> 
                        <span className="wrap-break-word">{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <a 
                    href={`tel:${selectedVenue.phone}`}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/50 transition-colors min-w-0"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#3D52A0] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-[#8697C4]">Phone</p>
                      <p className="text-xs sm:text-sm font-medium text-[#1a1a2e] truncate">{selectedVenue.phone}</p>
                    </div>
                  </a>
                  <a 
                    href={`https://${selectedVenue.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/50 transition-colors min-w-0"
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#3D52A0] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-[#8697C4]">Website</p>
                      <p className="text-xs sm:text-sm font-medium text-[#1a1a2e] truncate">{selectedVenue.website}</p>
                    </div>
                  </a>
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:gap-3 min-w-0">
                  <motion.a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedVenue.coordinates[1]},${selectedVenue.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white text-xs sm:text-sm md:text-base font-semibold shadow-lg min-w-0"
                  >
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="hidden sm:inline truncate">Get Directions</span>
                    <span className="sm:hidden truncate">Directions</span>
                  </motion.a>
                  <motion.button
                    onClick={async () => {
                      const shareData = {
                        title: selectedVenue.name,
                        text: `Check out ${selectedVenue.name} - ${selectedVenue.type}`,
                        url: `https://www.google.com/maps/search/?api=1&query=${selectedVenue.coordinates[1]},${selectedVenue.coordinates[0]}`
                      };
                      
                      if (navigator.share) {
                        try {
                          await navigator.share(shareData);
                        } catch (err) {
                          if (err.name !== 'AbortError') {
                            console.error('Error sharing:', err);
                          }
                        }
                      } else {
                        // Fallback: copy to clipboard
                        try {
                          await navigator.clipboard.writeText(shareData.url);
                          alert('Link copied to clipboard!');
                        } catch (err) {
                          console.error('Error copying to clipboard:', err);
                        }
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-[#ADBBDA] text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors shrink-0"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}