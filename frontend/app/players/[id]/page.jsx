'use client'

import { useState, use } from 'react'
import { 
  BarChart3,
  Gauge,
  Star,
  Trophy,
  Activity
} from 'lucide-react'

// Import all components
import CoverPhoto from '../../../components/players/profile/CoverPhoto'
import ProfileHeader from '../../../components/players/profile/ProfileHeader'
import AssessmentScoreCard from '../../../components/players/profile/AssessmentScoreCard'
import ScoreBreakdown from '../../../components/players/profile/ScoreBreakdown'
import TabsNavigation from '../../../components/players/profile/TabsNavigation'
import OverviewTab from '../../../components/players/profile/OverviewTab'
import AssessmentsTab from '../../../components/players/profile/AssessmentsTab'
import RecommendationsTab from '../../../components/players/profile/RecommendationsTab'
import AchievementsTab from '../../../components/players/profile/AchievementsTab'
import TrainingTab from '../../../components/players/profile/TrainingTab'
import ProfileSidebar from '../../../components/players/profile/ProfileSidebar'
import { getPlayerData } from '../../../components/players/profile/playersDatabase'

export default function PlayerProfilePage({ params }) {
  const unwrappedParams = use(params)
  const [activeTab, setActiveTab] = useState('overview')
  const [isFollowing, setIsFollowing] = useState(false)

  const player = getPlayerData(unwrappedParams.id)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'assessments', label: 'Assessments', icon: Gauge },
    { id: 'recommendations', label: 'Recommendations', icon: Star },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'training', label: 'Training', icon: Activity }
  ]

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <CoverPhoto />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader 
          player={player} 
          isFollowing={isFollowing} 
          setIsFollowing={setIsFollowing} 
        />
        
        <AssessmentScoreCard assessmentScores={player.assessmentScores} />
        
        <ScoreBreakdown breakdown={player.assessmentScores.breakdown} />
        
        <TabsNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid lg:grid-cols-3 gap-8 pb-20">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <OverviewTab player={player} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'assessments' && (
              <AssessmentsTab assessmentScores={player.assessmentScores} />
            )}
            {activeTab === 'recommendations' && (
              <RecommendationsTab coachRecommendations={player.coachRecommendations} />
            )}
            {activeTab === 'achievements' && (
              <AchievementsTab achievements={player.achievements} />
            )}
            {activeTab === 'training' && (
              <TrainingTab trainingHistory={player.trainingHistory} />
            )}
          </div>

          <ProfileSidebar player={player} />
        </div>
      </div>
    </div>
  )
}
