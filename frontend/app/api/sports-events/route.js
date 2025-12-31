import { NextResponse } from 'next/server';

// TheSportsDB API endpoints
const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

// Comprehensive league coverage for better data
const LEAGUE_IDS = {
  basketball: ['4387', '4478', '4625'],
  football: ['4328', '4480', '4481', '4391', '4335'],
  cricket: ['4413', '4420'],
  tennis: ['4397', '4398'],
  athletics: ['4441'],
  kabaddi: ['4536'],
  badminton: ['4612'],
  all: [] // Will fetch from all sports
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport') || 'all';
    const limit = searchParams.get('limit') || '100';

    let allEvents = [];
    const currentYear = new Date().getFullYear();
    const seasons = [
      `${currentYear}-${currentYear + 1}`,
      `${currentYear - 1}-${currentYear}`,
      `${currentYear}`
    ];

    // Determine which leagues to fetch
    const leaguesToFetch = sport === 'all' 
      ? Object.entries(LEAGUE_IDS)
          .filter(([key]) => key !== 'all')
          .flatMap(([sportName, leagueIds]) => 
            leagueIds.map(id => ({ sportName, leagueId: id }))
          )
      : (LEAGUE_IDS[sport] || []).map(id => ({ sportName: sport, leagueId: id }));

    // Fetch from multiple sources
    for (const { sportName, leagueId } of leaguesToFetch) {
      if (!leagueId) continue;

      // Try multiple seasons and endpoints
      for (const season of seasons) {
        try {
          const endpoints = [
            `${API_BASE}/eventsnextleague.php?id=${leagueId}`,
            `${API_BASE}/eventspastleague.php?id=${leagueId}`,
            `${API_BASE}/eventsseason.php?id=${leagueId}&s=${season}`,
          ];

          for (const endpoint of endpoints) {
            try {
              const response = await fetch(endpoint, { 
                next: { revalidate: 1800 } // 30 min cache
              });

              if (response.ok) {
                const data = await response.json();
                if (data.events && data.events.length > 0) {
                  const transformedEvents = data.events
                    .filter(event => event.dateEvent) // Only events with dates
                    .map((event, index) => ({
                      id: `${event.idEvent}-${sportName}-${leagueId}-${season}-${index}`,
                      originalId: event.idEvent,
                      title: event.strEvent || `${event.strHomeTeam} vs ${event.strAwayTeam}`,
                      description: event.strDescriptionEN || `${event.strSport} - ${event.strHomeTeam} vs ${event.strAwayTeam || 'TBD'}`,
                      date: formatDate(event.dateEvent, event.strTime),
                      rawDate: event.dateEvent,
                      time: event.strTime || event.strTimeLocal || 'TBD',
                      location: event.strVenue || event.strCity || event.strCountry || 'TBD',
                      address: [event.strVenue, event.strCity, event.strCountry].filter(Boolean).join(', ') || 'TBD',
                      sport: event.strSport || sportName,
                      sportColor: getSportColor(sportName),
                      type: getEventType(event.strLeague),
                      participants: Math.floor(Math.random() * 200) + 50,
                      maxParticipants: Math.floor(Math.random() * 100) + 300,
                      fee: 'Free - $50',
                      isRegistered: false,
                      isSaved: false,
                      isNew: isWithinDays(event.dateEvent, 14),
                      prizes: ['To be announced'],
                      requirements: ['Valid ID', 'Registration required'],
                      organizer: event.strLeague || 'TBD',
                      homeTeam: event.strHomeTeam,
                      awayTeam: event.strAwayTeam,
                      thumbnail: event.strThumb || event.strSquare || event.strPoster,
                      venue: event.strVenue,
                      league: event.strLeague,
                      season: event.strSeason,
                      country: event.strCountry
                    }));
                  allEvents.push(...transformedEvents);
                }
              }
            } catch (err) {
              // Continue to next endpoint
              continue;
            }
          }
        } catch (err) {
          console.error(`Error fetching ${sportName} (${leagueId}) events:`, err);
        }
      }
    }

    // Remove duplicates
    const uniqueEvents = [];
    const seenIds = new Set();
    
    for (const event of allEvents) {
      const uniqueKey = `${event.originalId}`;
      if (!seenIds.has(uniqueKey)) {
        seenIds.add(uniqueKey);
        uniqueEvents.push(event);
      }
    }

    // Filter for future and recent past events only
    const now = new Date();
    const twoMonthsAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
    const filteredEvents = uniqueEvents.filter(event => {
      if (!event.rawDate) return false;
      const eventDate = new Date(event.rawDate);
      return eventDate >= twoMonthsAgo;
    });

    // Sort by date (upcoming first)
    filteredEvents.sort((a, b) => {
      const dateA = new Date(a.rawDate || a.date);
      const dateB = new Date(b.rawDate || b.date);
      return dateA - dateB;
    });

    // Limit results
    const limitedEvents = filteredEvents.slice(0, parseInt(limit));

    return NextResponse.json({
      success: true,
      count: limitedEvents.length,
      events: limitedEvents
    });

  } catch (error) {
    console.error('Error fetching sports events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sports events' },
      { status: 500 }
    );
  }
}

// Helper functions
function formatDate(dateStr, timeStr) {
  if (!dateStr) return 'TBD';
  
  const date = new Date(dateStr);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getSportColor(sport) {
  const colors = {
    basketball: 'bg-orange-500',
    football: 'bg-green-500',
    cricket: 'bg-blue-500',
    tennis: 'bg-yellow-500',
    swimming: 'bg-blue-400',
    athletics: 'bg-red-500',
    fitness: 'bg-purple-500',
    kabaddi: 'bg-pink-500',
    badminton: 'bg-teal-500'
  };
  return colors[sport] || 'bg-gray-500';
}

function getEventType(league) {
  if (!league) return 'Event';
  const leagueLower = league.toLowerCase();
  if (leagueLower.includes('championship') || leagueLower.includes('cup')) return 'Tournament';
  if (leagueLower.includes('league')) return 'League';
  if (leagueLower.includes('qualifier')) return 'Qualifier';
  return 'Match';
}

function isWithinDays(dateStr, days) {
  if (!dateStr) return false;
  const eventDate = new Date(dateStr);
  const now = new Date();
  const diffTime = eventDate - now;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}
