'use client'

import { useState } from 'react'
import { Bell, Calendar, CheckCircle, Bookmark } from 'lucide-react'
import EventHeader from '@/components/sportsevents/EventHeader'
import EventSidebar from '@/components/sportsevents/EventSidebar'
import StatsBar from '@/components/sportsevents/StatsBar'
import EventCard from '@/components/sportsevents/EventCard'
import EventDetailModal from '@/components/sportsevents/EventDetailModal'

export default function SportsEventsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSport, setActiveSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const filters = [
    { id: 'all', label: 'All Events', icon: Bell },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'registered', label: 'Registered', icon: CheckCircle },
    { id: 'saved', label: 'Saved', icon: Bookmark }
  ]

  const sportCategories = [
    { id: 'basketball', label: 'Basketball', color: 'bg-orange-500' },
    { id: 'football', label: 'Football', color: 'bg-green-500' },
    { id: 'tennis', label: 'Tennis', color: 'bg-yellow-500' },
    { id: 'swimming', label: 'Swimming', color: 'bg-blue-500' },
    { id: 'athletics', label: 'Athletics', color: 'bg-red-500' },
    { id: 'fitness', label: 'Fitness', color: 'bg-purple-500' }
  ]

  const events = [
    {
      id: 1,
      title: 'Regional Basketball Championship',
      description: 'Annual regional basketball tournament featuring top teams from the Southeast. Open to all skill levels with separate brackets for amateur and professional players.',
      date: 'Jan 15, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'Miami Sports Arena',
      address: '1234 Sports Blvd, Miami, FL 33101',
      sport: 'Basketball',
      sportColor: 'bg-orange-500',
      type: 'Tournament',
      participants: 256,
      maxParticipants: 300,
      fee: '$50',
      isRegistered: true,
      isSaved: false,
      isNew: true,
      prizes: ['$5,000 First Place', '$2,500 Second Place', '$1,000 Third Place'],
      requirements: ['Age 18+', 'Valid ID', 'Sports gear'],
      organizer: 'Southeast Sports League'
    },
    {
      id: 2,
      title: 'Elite Coaching Masterclass',
      description: 'Learn from Olympic coaches in this intensive 3-day masterclass. Topics include performance optimization, mental conditioning, and advanced training techniques.',
      date: 'Jan 20-22, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Olympic Training Center',
      address: '789 Champion Way, Los Angeles, CA 90001',
      sport: 'Athletics',
      sportColor: 'bg-red-500',
      type: 'Workshop',
      participants: 45,
      maxParticipants: 50,
      fee: '$299',
      isRegistered: false,
      isSaved: true,
      isNew: true,
      prizes: ['Certificate of Completion', 'Exclusive Resources'],
      requirements: ['Coaching license preferred', 'Sports background'],
      organizer: 'Olympic Committee'
    },
    {
      id: 3,
      title: 'City Marathon 2025',
      description: 'Join thousands of runners in the annual city marathon. Routes available for 5K, 10K, half marathon, and full marathon distances.',
      date: 'Feb 1, 2025',
      time: '6:00 AM - 2:00 PM',
      location: 'Downtown Start Line',
      address: 'City Hall Plaza, New York, NY 10007',
      sport: 'Athletics',
      sportColor: 'bg-red-500',
      type: 'Race',
      participants: 8500,
      maxParticipants: 10000,
      fee: '$75-150',
      isRegistered: false,
      isSaved: false,
      isNew: false,
      prizes: ['Finisher Medal', 'Age Group Awards'],
      requirements: ['Medical clearance', 'Minimum age 16'],
      organizer: 'NYC Sports Foundation'
    },
    {
      id: 4,
      title: 'Tennis Open Qualifier',
      description: 'Qualifier tournament for the State Open Championship. Top 8 players will advance to the main draw.',
      date: 'Jan 28, 2025',
      time: '8:00 AM - 5:00 PM',
      location: 'Riverside Tennis Club',
      address: '456 Court Lane, Austin, TX 78701',
      sport: 'Tennis',
      sportColor: 'bg-yellow-500',
      type: 'Tournament',
      participants: 48,
      maxParticipants: 64,
      fee: '$35',
      isRegistered: true,
      isSaved: false,
      isNew: false,
      prizes: ['Advancement to State Open', 'Prize money'],
      requirements: ['UTR rating 4.0+', 'Valid membership'],
      organizer: 'Texas Tennis Association'
    },
    {
      id: 5,
      title: 'Strength & Conditioning Summit',
      description: 'Industry-leading conference on strength and conditioning science. Features research presentations, hands-on workshops, and networking opportunities.',
      date: 'Feb 10-12, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Sports Science Center',
      address: '321 Fitness Blvd, Denver, CO 80202',
      sport: 'Fitness',
      sportColor: 'bg-purple-500',
      type: 'Conference',
      participants: 320,
      maxParticipants: 400,
      fee: '$199',
      isRegistered: false,
      isSaved: true,
      isNew: false,
      prizes: ['CEU Credits', 'Certification opportunities'],
      requirements: ['Fitness professional preferred'],
      organizer: 'NSCA'
    },
    {
      id: 6,
      title: 'Youth Football Camp',
      description: 'Week-long football development camp for aspiring young athletes. Professional coaches will teach fundamentals, advanced techniques, and game strategy.',
      date: 'Feb 17-21, 2025',
      time: '8:00 AM - 12:00 PM',
      location: 'State University Stadium',
      address: '100 University Dr, Columbus, OH 43201',
      sport: 'Football',
      sportColor: 'bg-green-500',
      type: 'Camp',
      participants: 120,
      maxParticipants: 150,
      fee: '$250',
      isRegistered: false,
      isSaved: false,
      isNew: true,
      prizes: ['Camp MVP Award', 'Scholarship opportunities'],
      requirements: ['Ages 10-17', 'Physical clearance'],
      organizer: 'State Football Academy'
    },
  ]

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
            {/* Stats Banner */}
            <StatsBar />

            {/* Events List */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#1a1a2e]">
                  {activeFilter === 'all' ? 'All Events' : 
                   activeFilter === 'upcoming' ? 'Upcoming Events' :
                   activeFilter === 'registered' ? 'Your Registered Events' : 
                   'Saved Events'}
                  <span className="ml-2 text-[#8697C4] font-normal text-sm sm:text-base">({filteredEvents.length})</span>
                </h2>
              </div>

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

