'use client'

import { useState, useEffect } from 'react'
import { Bell, Calendar, CheckCircle, Bookmark } from 'lucide-react'
import EventHeader from '@/components/sportsevents/EventHeader'
import EventSidebar from '@/components/sportsevents/EventSidebar'
import EventCard from '@/components/sportsevents/EventCard'
import EventDetailModal from '@/components/sportsevents/EventDetailModal'

export default function SportsEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSport, setActiveSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filters = [
    { id: 'all', label: 'All Events', icon: Bell },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'registered', label: 'Registered', icon: CheckCircle },
    { id: 'saved', label: 'Saved', icon: Bookmark }
  ]

  const sportCategories = [
    { id: 'cricket', label: 'Cricket', color: 'bg-blue-500' },
    { id: 'football', label: 'Football', color: 'bg-green-500' },
    { id: 'kabaddi', label: 'Kabaddi', color: 'bg-pink-500' },
    { id: 'basketball', label: 'Basketball', color: 'bg-orange-500' },
    { id: 'badminton', label: 'Badminton', color: 'bg-teal-500' },
    { id: 'tennis', label: 'Tennis', color: 'bg-yellow-500' },
    { id: 'athletics', label: 'Athletics', color: 'bg-red-500' }
  ]

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/sports-events?sport=${activeSport}&limit=50`)
        const data = await response.json()
        
        if (data.success) {
          setEvents(data.events)
        } else {
          setError('Failed to load events')
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [activeSport])

  const filteredEvents = events.filter(event => {
    // Filter by status (registered, saved, etc.)
    if (activeFilter === 'registered') return event.isRegistered
    if (activeFilter === 'saved') return event.isSaved
    if (activeFilter === 'upcoming') return true
    return true
  }).filter(event => {
    // Filter by sport category
    if (activeSport !== 'all' && event.sport.toLowerCase() !== activeSport.toLowerCase()) {
      return false
    }
    return true
  }).filter(event => {
    // Filter by search query
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.sport.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen pb-10 bg-[#fafbff]">
      {/* Header */}
      <EventHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-12 sm:-mt-14 md:-mt-16">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <EventSidebar
              filters={filters}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sportCategories={sportCategories}
              activeSport={activeSport}
              setActiveSport={setActiveSport}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* Events List */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                  {activeFilter === 'all' ? 'All Events' : 
                   activeFilter === 'upcoming' ? 'Upcoming Events' :
                   activeFilter === 'registered' ? 'Your Registered Events' : 
                   'Saved Events'}
                  <span className="ml-2 text-[#aebadd] font-normal text-sm sm:text-base">({filteredEvents.length})</span>
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4f46e5] border-r-transparent"></div>
                  <p className="mt-4 text-[#8697C4]">Loading events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca]"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#8697C4]">No events found</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4">
                  {filteredEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}

