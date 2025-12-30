'use client'

import { useState } from 'react'
import PlayersHeader from '../../components/players/PlayersHeader'
import SearchAndFilters from '../../components/players/SearchAndFilters'
import ResultsCount from '../../components/players/ResultsCount'
import PlayersGrid from '../../components/players/PlayersGrid'
import EmptyState from '../../components/players/EmptyState'
import { playersData } from '../../components/players/playersData'

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState('All Sports')

  const filteredPlayers = playersData.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSport = selectedSport === 'All Sports' || player.sport === selectedSport
    return matchesSearch && matchesSport
  })

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
