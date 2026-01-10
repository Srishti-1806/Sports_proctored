"use client"

import { useState, useEffect } from 'react'
import { Bell, Calendar, CheckCircle, Bookmark } from 'lucide-react'
import EventHeader from '@/components/sportsevents/EventHeader'
import EventSidebar from '@/components/sportsevents/EventSidebar'
import EventCard from '@/components/sportsevents/EventCard'
import EventDetailModal from '@/components/sportsevents/EventDetailModal'
import ProtectedRoute from '@/lib/components/ProtectedRoute'

// initial state values inlined; removed unused globals

export default function SportsEventsPage() {

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSport, setActiveSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [sportCategories, setSportCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // removed unused initialMatches effect

  const filters = [
    { id: 'all', label: 'All Events', icon: Bell },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'registered', label: 'Registered', icon: CheckCircle },
    { id: 'saved', label: 'Saved', icon: Bookmark }
  ]
  

  // Fetch additional matches if user changes filters
  useEffect(() => {
    const fetchEvents = async () => {
      // Build a flexible proxy call - the `path` query param defines the RapidAPI endpoint path after /v1/
      // We'll request calendar/categories for today's date and timezone for India by default.
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`

      try {
        setLoading(true)
        // Use integer timezone (API expects int) and request cricket (sport_id=62) by default
        const url = `/api/os-sports/india-events?timezone=5&date=${dateStr}&country=India`
        const response = await fetch(url)
        const data = await response.json()

        const matches = Array.isArray(data.events) ? data.events : []

        if (matches.length === 0) {
          setError('No events found for India')
          setEvents([])
        } else {
          const transformedEvents = matches.map((match) => ({
            id: match.id,
            title: match.title,
            sport: match.sport,
            date: match.date ? new Date(match.date).toLocaleDateString() : dateStr,
            time: match.time ? new Date(match.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
            location: match.location || 'Venue TBD',
            description: '',
            image: '/api/placeholder/400/320',
            organizer: '',
            raw: match.raw || {}
          }))

            // compute sport categories from returned events
            const sportsSet = new Map()
            transformedEvents.forEach((ev) => {
              const name = ev.sport || 'Various'
              if (!sportsSet.has(name)) {
                sportsSet.set(name, { id: sportsSet.size + 1, label: name, color: 'bg-blue-500' })
              }
            })
            setSportCategories(Array.from(sportsSet.values()))

          setEvents(transformedEvents)
          setError(null)
          console.debug('[SportsEventsPage] loaded events:', transformedEvents.length)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [activeSport, activeFilter])

  const filteredEvents = events.filter(event => {
    // Filter by status (registered, saved, etc.)
    if (activeFilter === 'registered') return event.isRegistered
    if (activeFilter === 'saved') return event.isSaved
    if (activeFilter === 'upcoming') return true
    return true
  }).filter(event => {
    // Filter by selected sport
    if (!activeSport || activeSport === 'all') return true
    return (event.sport || '').toLowerCase() === (activeSport || '').toLowerCase()
  }).filter(event => {
    // Filter by search query
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.location.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <ProtectedRoute>
    <div className="min-h-screen pb-10 bg-[var(--color-background)]">
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
                <h2 className="font-display text-lg sm:text-xl font-bold text-black md:text-white">
                  {activeFilter === 'all' ? 'All Events' : 
                   activeFilter === 'upcoming' ? 'Upcoming Events' :
                   activeFilter === 'registered' ? 'Your Registered Events' : 
                   'Saved Events'}
                  <span className="ml-2 text-[var(--color-primary-light)] font-normal text-sm sm:text-base">({filteredEvents.length})</span>
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--color-primary-deep)] border-r-transparent"></div>
                  <p className="mt-4 text-[var(--color-primary-muted)]">Loading events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white rounded-lg hover:shadow-lg"
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
                  {filteredEvents.map((event, idx) => (
                    <EventCard
                      key={event.id ?? event.raw?.event_id ?? `${event.title || 'event'}-${idx}`}
                      event={event}
                      index={idx}
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
    </ProtectedRoute>
  )
}

