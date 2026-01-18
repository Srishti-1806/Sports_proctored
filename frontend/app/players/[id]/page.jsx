'use client'

import { useState, use, useEffect } from 'react'
import { Loader2, Trophy, Target, Zap, Award, MapPin, Mail, TrendingUp, Dumbbell, Calendar, User as UserIcon, ArrowLeft, Users } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'
import { useAuth } from '../../../lib/context/AuthContext'
import PlayerProfile from '../../../components/profile/PlayerProfile'
import StatCard from '../../../components/profile/StatCard'
import FollowButton from '../../../components/FollowButton'
import FollowersModal from '../../../components/FollowersModal'

export default function PlayerProfilePage({ params }) {
  const unwrappedParams = use(params)
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [followersData, setFollowersData] = useState([])
  const [followingData, setFollowingData] = useState([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)

  useEffect(() => {
    fetchPlayerProfile()
  }, [unwrappedParams.id])

  const fetchPlayerProfile = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', unwrappedParams.id)
        .single()

      if (error) throw error

      if (!data) {
        setError('Player not found')
        return
      }

      // Transform Supabase data to match PlayerProfile component structure (same as profile/page.jsx)
      const transformedProfile = {
        id: data.id,
        fullName: data.full_name || 'Anonymous Player',
        email: data.email || '',
        role: data.role || 'player',
        about: data.about || '',
        location: data.location || '',
        position: data.position || '',
        profilePicture: data.profile_picture || data.avatar_url || '',
        coverPhoto: data.cover_photo || '',
        athleticStats: data.athletic_stats || { height: '', weight: '', age: '', primarySport: '' },
        performanceMetrics: data.performance_metrics || [],
        achievements: data.achievements || [],
        trainingSchedule: data.training_schedule || [],
        matchHistory: data.match_history || [],
        videoHighlights: data.video_highlights || [],
        certifications: data.certifications || [],
        teams: data.teams || [],
        physicalStats: data.physical_stats || { speed: 0, strength: 0, endurance: 0, agility: 0, flexibility: 0 },
        dietPlan: data.diet_plan || '',
        socialLinks: data.social_links || {},
        assessments: data.assessments || [],
        followers: data.followers || [],
        following: data.following || []
      }

      setProfile(transformedProfile)
      setFollowersCount(data.followers?.length || 0)
      setFollowingCount(data.following?.length || 0)
    } catch (err) {
      console.error('Error fetching player profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const supabase = createClient()

  const fetchFollowData = async (userIds, type) => {
    if (!userIds || userIds.length === 0) return []

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture, position, athletic_stats, role')
        .in('id', userIds)

      if (error) throw error
      return data || []
    } catch (e) {
      console.error(`Error fetching ${type}:`, e)
      return []
    }
  }

  const openFollowersModal = async () => {
    setShowFollowersModal(true)
    setLoadingFollowers(true)
    const data = await fetchFollowData(profile?.followers || [], 'followers')
    setFollowersData(data)
    setLoadingFollowers(false)
  }

  const openFollowingModal = async () => {
    setShowFollowingModal(true)
    setLoadingFollowers(true)
    const data = await fetchFollowData(profile?.following || [], 'following')
    setFollowingData(data)
    setLoadingFollowers(false)
  }

  const handleFollowChange = (isFollowing, newFollowersCount) => {
    setFollowersCount(newFollowersCount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-bright animate-spin mx-auto mb-4" />
          <p className="text-primary-muted">Loading player profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            Player Not Found
          </h3>
          <p className="text-primary-muted mb-4">
            {error || 'The player profile you\'re looking for doesn\'t exist.'}
          </p>
          <a
            href="/players"
            className="inline-block px-6 py-3 bg-linear-to-r from-primary-deep to-primary-bright text-primary-foreground rounded-xl hover:shadow-lg transition-all"
          >
            Back to Players
          </a>
        </div>
      </div>
    )
  }

  // Dummy functions for read-only view (no editing allowed on other player's profiles)
  const openEdit = () => {}
  const deleteItem = () => {}
  const isPlayer = profile.role === 'player'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Back Button */}
        <a
          href="/players"
          className="inline-flex items-center gap-2 text-primary-deep dark:text-primary-bright hover:text-primary-bright dark:hover:text-primary-light transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Players</span>
        </a>

        {/* Hero Section with Cover & Stats */}
        <div className="relative">
          <div className="h-48 md:h-64 rounded-3xl bg-linear-to-br from-primary-deep via-primary-light to-primary-bright relative overflow-hidden">
            {profile?.coverPhoto && (
              <img src={profile.coverPhoto} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary-foreground rounded-full"></div>
              <div className="absolute bottom-10 right-20 w-24 h-24 border-2 border-primary-foreground rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-primary-foreground rotate-45"></div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto">
              <StatCard icon={Trophy} label="Achievements" value={profile?.achievements?.length || 0} color="from-amber-400 to-orange-500" />
              <StatCard icon={Target} label={isPlayer ? "Matches" : "Programs"} value={isPlayer ? (profile?.matchHistory?.length || 0) : (profile?.teams?.length || 0)} color="from-blue-400 to-cyan-500" />
              <StatCard icon={Award} label="Score" value={profile?.assessments?.[0]?.score || '-'} color="from-purple-400 to-pink-500" />
              <StatCard icon={Zap} label="Training" value={profile?.trainingSchedule?.length || 0} color="from-green-400 to-emerald-500" />
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="mt-10">
            <div className="bg-card rounded-3xl shadow-xl border border-border p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center shadow-lg overflow-hidden">
                    {profile?.profilePicture ? (
                      <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-16 h-16 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                        {profile.fullName}
                      </h1>
                      <p className="text-xl text-primary-bright font-semibold mb-3">{profile?.position || 'Position not set'}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {profile?.location && (
                          <div className="flex items-center gap-1 text-sm text-primary-muted">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </div>
                        )}
                        <div className="px-3 py-1 rounded-full bg-linear-to-r from-primary-deep to-primary-bright text-primary-foreground text-xs font-bold uppercase tracking-wide">
                          {profile.role || 'player'}
                        </div>
                        {profile?.email && (
                          <div className="flex items-center gap-1 text-sm text-primary-muted">
                            <Mail className="w-4 h-4" />
                            {profile.email}
                          </div>
                        )}
                      </div>

                      {/* Followers/Following */}
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={openFollowersModal}
                          className="flex items-center gap-2 hover:text-primary-bright transition-colors"
                        >
                          <Users className="w-4 h-4 text-primary-muted" />
                          <span className="font-bold text-foreground">{followersCount}</span>
                          <span className="text-sm text-muted-foreground">Followers</span>
                        </button>
                        <button
                          onClick={openFollowingModal}
                          className="flex items-center gap-2 hover:text-primary-bright transition-colors"
                        >
                          <Users className="w-4 h-4 text-primary-muted" />
                          <span className="font-bold text-foreground">{followingCount}</span>
                          <span className="text-sm text-muted-foreground">Following</span>
                        </button>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <div className="flex items-center gap-3">
                      <FollowButton 
                        targetUserId={profile.id} 
                        targetUserName={profile.fullName}
                        onFollowChange={handleFollowChange}
                      />
                    </div>
                  </div>

                  {profile?.athleticStats && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {profile.athleticStats.height && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-primary-deep" />
                          </div>
                          <div>
                            <div className="text-xs text-primary-muted">{isPlayer ? 'Height' : 'Experience'}</div>
                            <div className="font-bold text-foreground">{profile.athleticStats.height}</div>
                          </div>
                        </div>
                      )}
                      {profile.athleticStats.weight && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                            <Dumbbell className="w-4 h-4 text-primary-deep" />
                          </div>
                          <div>
                            <div className="text-xs text-primary-muted">{isPlayer ? 'Weight' : 'Level'}</div>
                            <div className="font-bold text-foreground">{profile.athleticStats.weight}</div>
                          </div>
                        </div>
                      )}
                      {profile.athleticStats.age && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-primary-deep" />
                          </div>
                          <div>
                            <div className="text-xs text-primary-muted">Age</div>
                            <div className="font-bold text-foreground">{profile.athleticStats.age}</div>
                          </div>
                        </div>
                      )}
                      {profile.athleticStats.primarySport && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-primary-deep" />
                          </div>
                          <div>
                            <div className="text-xs text-primary-muted">Sport</div>
                            <div className="font-bold text-foreground">{profile.athleticStats.primarySport}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Profile (without Proctored Test section) */}
        <PlayerProfile 
          profile={profile} 
          openEdit={openEdit} 
          deleteItem={deleteItem}
          user={null} // Read-only view, no editing
          hideProctorTest={true} // Hide the proctored test section
        />

        {/* Followers/Following Modals */}
        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          users={followersData}
          type="followers"
          loading={loadingFollowers}
        />
        <FollowersModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          users={followingData}
          type="following"
          loading={loadingFollowers}
        />
      </div>
    </div>
  )
}