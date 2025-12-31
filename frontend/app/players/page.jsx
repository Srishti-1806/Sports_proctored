'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import PlayersHeader from '../../components/players/PlayersHeader'
import SearchAndFilters from '../../components/players/SearchAndFilters'
import ResultsCount from '../../components/players/ResultsCount'
import PlayersGrid from '../../components/players/PlayersGrid'
import EmptyState from '../../components/players/EmptyState'
import { createClient } from '../../lib/supabase/client'

export default function PlayersPage() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState('All Sports')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'player')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform the data to match expected format
      const transformedPlayers = (data || []).map(player => {
        // Calculate overall score from assessments or physical stats
        const overallScore = player.assessments?.[0]?.overall_score || 
          (player.physical_stats ? 
            Math.round((player.physical_stats.speed + player.physical_stats.strength + 
                       player.physical_stats.endurance + player.physical_stats.agility + 
                       player.physical_stats.flexibility) / 5) : 0)
        
        return {
          id: player.id,
          name: player.full_name || 'Anonymous Player',
          sport: player.sport || player.athletic_stats?.primarySport || 'Unknown',
          position: player.position || 'N/A',
          location: player.location || 'Unknown',
          age: player.athletic_stats?.age || 'N/A',
          overallScore: overallScore,
          matchCount: player.match_history?.length || 0,
          improvement: player.performance_metrics?.improvement || '+0%',
          image: player.profile_picture || player.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.full_name || 'Player')}&background=7091E6&color=fff&size=400`,
          status: overallScore >= 80 ? 'Elite Performer' : 'Active',
          achievements: player.achievements?.length || 0,
          trainingHours: player.training_schedule?.length ? `${player.training_schedule.length * 2}+` : '0+',
          about: player.about,
          physical_stats: player.physical_stats,
          assessments: player.assessments,
          matchHistory: player.match_history || []
        }
      })

      setPlayers(transformedPlayers)
    } catch (err) {
      console.error('Error fetching players:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSport = selectedSport === 'All Sports' || player.sport === selectedSport
    return matchesSearch && matchesSport
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbff] pt-24 pb-12">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <PlayersHeader />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#7091E6] animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafbff] pt-24 pb-12">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <PlayersHeader />
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">
              Error loading players
            </h3>
            <p className="text-[#8697C4] mb-4">{error}</p>
            <button
              onClick={fetchPlayers}
              className="px-6 py-3 bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafbff] pt-24 pb-12">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        
        <PlayersHeader />

        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
        />

        <ResultsCount count={filteredPlayers.length} />

        {filteredPlayers.length > 0 ? (
          <PlayersGrid players={filteredPlayers} />
        ) : (
          <EmptyState />
        )}

      </div>
    </div>
  )
}
