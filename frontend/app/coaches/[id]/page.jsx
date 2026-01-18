'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Loader2, Camera, Users } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'
import { useAuth } from '../../../lib/context/AuthContext'
import CoachProfile from '../../../components/profile/CoachProfile'
import FollowButton from '../../../components/FollowButton'
import FollowersModal from '../../../components/FollowersModal'

export default function CoachProfilePage() {
  const params = useParams()
  const router = useRouter()
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
    if (params.id) {
      fetchCoachProfile()
    }
  }, [params.id])

  const fetchCoachProfile = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .eq('role', 'coach')
        .single()

      if (error) throw error
      if (!data) throw new Error('Coach not found')

      // Transform database fields to match profile component structure
      const transformedProfile = {
        id: data.id,
        name: data.full_name || 'Coach',
        about: data.about || '',
        location: data.location || '',
        position: data.position || '',
        profilePicture: data.profile_picture || data.avatar_url || '',
        coverPhoto: data.cover_photo || '',
        
        athleticStats: {
          height: data.athletic_stats?.height || 'N/A',
          weight: data.athletic_stats?.weight || 'N/A',
          age: data.athletic_stats?.age || data.athletic_stats?.experience || 'N/A',
          primarySport: data.athletic_stats?.primarySport || 'N/A'
        },
        
        performanceMetrics: data.performance_metrics || {},
        
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
        
        trainingSchedule: Array.isArray(data.training_schedule) 
          ? data.training_schedule 
          : [],
        
        videoHighlights: Array.isArray(data.video_highlights) 
          ? data.video_highlights 
          : [],
        
        certifications: Array.isArray(data.certifications) 
          ? data.certifications 
          : [],
        
        teams: Array.isArray(data.teams) ? data.teams : [],
        
        physicalStats: {
          speed: data.physical_stats?.speed || 0,
          strength: data.physical_stats?.strength || 0,
          endurance: data.physical_stats?.endurance || 0,
          agility: data.physical_stats?.agility || 0,
          flexibility: data.physical_stats?.flexibility || 0
        },
        
        dietPlan: data.diet_plan || '',
        socialLinks: data.social_links || {},
        assessments: Array.isArray(data.assessments) ? data.assessments : [],
        followers: data.followers || [],
        following: data.following || []
      }

      setProfile(transformedProfile)
      setFollowersCount(data.followers?.length || 0)
      setFollowingCount(data.following?.length || 0)
    } catch (err) {
      console.error('Error fetching coach profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Stub functions for read-only mode
  const openEdit = () => {}
  const deleteItem = () => {}

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
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-bright animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Coach not found</h2>
            <p className="text-primary-muted mb-6">{error || 'The coach profile you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={() => router.push('/coaches')}
              className="px-6 py-3 bg-linear-to-r from-primary-deep to-primary-bright text-white rounded-xl hover:shadow-lg transition-all"
            >
              Back to Coaches
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-5 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/coaches')}
          className="mb-6 flex items-center gap-2 text-primary-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Coaches</span>
        </motion.button>

        {/* Cover Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-3xl overflow-hidden mb-8 bg-linear-to-br from-[#3D52A0] to-[#7091E6]"
        >
          {profile.coverPhoto ? (
            <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-16 h-16 text-white/30" />
            </div>
          )}
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8 -mt-20 relative z-10"
        >
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-card p-2 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-linear-to-br from-primary-deep to-primary-bright overflow-hidden">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.about?.split(' ')[0]?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 bg-card rounded-3xl p-6 shadow-xl border border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {profile.name}
                </h1>
                <p className="text-xl text-primary-bright font-semibold mb-3">{profile.position || 'Coach'}</p>
                <div className="flex flex-wrap items-center gap-3">
                  {profile.location && (
                    <div className="flex items-center gap-1 text-sm text-primary-muted">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  <div className="px-3 py-1 rounded-full bg-linear-to-r from-primary-deep to-primary-bright text-white text-xs font-bold uppercase tracking-wide">
                    coach
                  </div>
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
              <div className="flex gap-3">
                <FollowButton 
                  targetUserId={profile.id} 
                  targetUserName={profile.name}
                  onFollowChange={handleFollowChange}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Content - Pass user={null} for read-only mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <CoachProfile 
            profile={profile} 
            openEdit={openEdit} 
            deleteItem={deleteItem} 
            user={null}
          />
        </motion.div>

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
