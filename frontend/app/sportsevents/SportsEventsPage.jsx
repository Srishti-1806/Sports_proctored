"use client"

import { useState, useEffect } from 'react'
import { Bell, Calendar, CheckCircle, Bookmark } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import EventHeader from '@/components/sportsevents/EventHeader'
import EventSidebar from '@/components/sportsevents/EventSidebar'
import EventCard from '@/components/sportsevents/EventCard'
import EventDetailModal from '@/components/sportsevents/EventDetailModal'
import ProtectedRoute from '@/lib/components/ProtectedRoute'
import { useToast } from '@/components/ToastProvider'

// initial state values inlined; removed unused globals
import sportsEvents from '@/components/sports_events.json'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function SportsEventsPage() {
  const { t } = useLanguage()
  const { user, supabase } = useAuth()
  const toast = useToast()

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSport, setActiveSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [sportCategories, setSportCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const filters = [
    { id: 'all', labelKey: 'events.allEvents', icon: Bell },
    { id: 'upcoming', labelKey: 'events.upcomingFilter', icon: Calendar },
    { id: 'registered', labelKey: 'events.registered', icon: CheckCircle },
    { id: 'saved', labelKey: 'events.saved', icon: Bookmark }
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

        // If API returned no events, fall back to our bundled `sports_events.json`
        const source = matches.length > 0 ? matches : sportsEvents

        // fetch saved event ids from Supabase profile when user is available
        let savedIds = []
        try {
          if (user && supabase) {
            const { data: profile, error: profileErr } = await supabase.from('profiles').select('saved_events').eq('id', user.id).single()
            if (!profileErr && profile && Array.isArray(profile.saved_events)) {
              savedIds = profile.saved_events
            }
          }
        } catch (e) {
          console.error('Failed to load saved events from profile', e)
        }

        const transformedEvents = source.map((match) => {
          const startRaw = match.start_date || match.date_start || match.date || null
          const startTs = startRaw ? Date.parse(startRaw) : null
          return {
            id: match.id ?? match.event_id ?? `${match.event_name || match.title}`,
            title: match.title || match.event_name || match.eventName || 'Event',
            sport: match.sport || match.sport_name || 'Various',
            date: startRaw ? new Date(startRaw).toLocaleDateString() : dateStr,
            start_ts: startTs,
            time: match.time ? new Date(match.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
            location: match.venue || match.location || 'Venue TBD',
            description: match.details || match.description || '',
            image: '/api/placeholder/400/320',
            organizer: '',
            raw: match,
            isSaved: savedIds.includes(match.id ?? match.event_id ?? `${match.event_name || match.title}`)
          }
        })

        // compute sport categories from returned or fallback events
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
      } catch (err) {
        console.error('Error fetching events:', err)
        // On fetch error, use bundled `sports_events.json` so page remains useful
        let savedIds = []
        try {
          if (user && supabase) {
            const { data: profile, error: profileErr } = await supabase.from('profiles').select('saved_events').eq('id', user.id).single()
            if (!profileErr && profile && Array.isArray(profile.saved_events)) {
              savedIds = profile.saved_events
            }
          }
        } catch (e) {
          console.error('Failed to load saved events from profile', e)
        }

        const transformedFallback = sportsEvents.map((match) => {
          const startRaw = match.start_date || match.date_start || match.date || null
          const startTs = startRaw ? Date.parse(startRaw) : null
          return ({
            id: match.id ?? `${match.event_name}`,
            title: match.event_name,
            sport: match.sport || 'Various',
            date: startRaw ? new Date(startRaw).toLocaleDateString() : dateStr,
            start_ts: startTs,
            time: 'TBD',
            location: match.venue || 'Venue TBD',
            description: match.details || '',
            image: '/api/placeholder/400/320',
            organizer: '',
            raw: match,
            isSaved: savedIds.includes(match.id ?? `${match.event_name}`)
          })
        })

        const sportsSet = new Map()
        transformedFallback.forEach((ev) => {
          const name = ev.sport || 'Various'
          if (!sportsSet.has(name)) {
            sportsSet.set(name, { id: sportsSet.size + 1, label: name, color: 'bg-blue-500' })
          }
        })
        setSportCategories(Array.from(sportsSet.values()))

        setEvents(transformedFallback)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [activeSport, activeFilter, user, supabase])

  // Toggle save state for an event and persist to Supabase profile
  const toggleSave = async (id) => {
    // optimistic UI update
    const nextEvents = events.map((ev) => ev.id === id ? { ...ev, isSaved: !ev.isSaved } : ev)
    setEvents(nextEvents)
    setSelectedEvent((prev) => (prev && prev.id === id ? { ...prev, isSaved: !prev.isSaved } : prev))

    if (!user || !supabase) {
      // revert optimistic update
      setEvents((prev) => prev.map((ev) => ev.id === id ? { ...ev, isSaved: !ev.isSaved } : ev))
      setSelectedEvent((prev) => (prev && prev.id === id ? { ...prev, isSaved: !prev.isSaved } : prev))
      toast?.show('Please sign in to save events')
      return
    }

    try {
      // compute new saved IDs from the updated events state
      const savedIds = nextEvents.filter(e => e.isSaved).map(e => e.id)

      const dbProfile = { id: user.id, saved_events: savedIds }
      const { data, error } = await supabase.from('profiles').upsert(dbProfile)
      if (error) {
        // log detailed supabase error
        console.error('Supabase upsert error:', JSON.stringify(error))
        throw error
      }
      toast?.show('Event saved')
    } catch (e) {
      // ensure error details are visible in console
      try { console.error('Failed to persist saved events to Supabase', e, e?.message ?? JSON.stringify(e)) } catch (_) { console.error('Failed to persist saved events to Supabase', e) }
      // revert optimistic update
      setEvents((prev) => prev.map((ev) => ev.id === id ? { ...ev, isSaved: !ev.isSaved } : ev))
      setSelectedEvent((prev) => (prev && prev.id === id ? { ...prev, isSaved: !prev.isSaved } : prev))
      toast?.show('Failed to save event')
    }
  }

  const filteredEvents = events.filter(event => {
    // Filter by status (registered, saved, etc.)
    if (activeFilter === 'registered') return event.isRegistered
    if (activeFilter === 'saved') return event.isSaved
    if (activeFilter === 'upcoming') {
      // Use numeric timestamp when available to compare reliably
      const startTs = event.start_ts ?? (event.raw?.start_date ? Date.parse(event.raw.start_date) : null)
      if (!startTs || isNaN(startTs)) return false
      const today = new Date()
      today.setHours(0,0,0,0)
      const startDate = new Date(startTs)
      startDate.setHours(0,0,0,0)
      return startDate >= today
    }
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
    <div className="min-h-screen pb-10 bg-background overflow-x-hidden">
      {/* Header */}
      <EventHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenFilters={() => setShowMobileFilters(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
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
                  {activeFilter === 'all' ? t('events.allEventsHeading') : 
                   activeFilter === 'upcoming' ? t('events.upcomingEventsHeading') :
                   activeFilter === 'registered' ? t('events.registeredEventsHeading') : 
                   t('events.savedEventsHeading')}
                  <span className="ml-2 text-primary-light font-normal text-sm sm:text-base">({filteredEvents.length})</span>
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-deep border-r-transparent"></div>
                  <p className="mt-4 text-primary-muted">{t('common.loadingEvents')}</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-linear-to-r from-primary-deep to-primary-bright text-white rounded-lg hover:shadow-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#8697C4]">No events found</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
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
        onToggleSave={toggleSave}
      />

      {/* Mobile slide-over filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-1000">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm p-4">
            <div className="h-full overflow-auto p-2 bg-card rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-primary-muted">Close</button>
              </div>
              <EventSidebar
                filters={filters}
                activeFilter={activeFilter}
                setActiveFilter={(id) => { setActiveFilter(id); setShowMobileFilters(false) }}
                sportCategories={sportCategories}
                activeSport={activeSport}
                setActiveSport={(s) => { setActiveSport(s); setShowMobileFilters(false) }}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}

