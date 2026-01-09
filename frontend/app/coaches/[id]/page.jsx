'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Loader2, Camera } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'
import CoachProfile from '../../../components/profile/CoachProfile'

export default function CoachProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        assessments: Array.isArray(data.assessments) ? data.assessments : []
      }

      setProfile(transformedProfile)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbff] pt-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#7091E6] animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#fafbff] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Coach not found</h2>
            <p className="text-[#8697C4] mb-6">{error || 'The coach profile you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={() => router.push('/coaches')}
              className="px-6 py-3 bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Back to Coaches
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafbff] pt-5 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/coaches')}
          className="mb-6 flex items-center gap-2 text-[#8697C4] hover:text-[#3D52A0] transition-colors"
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
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] overflow-hidden">
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
          <div className="flex-1 bg-white rounded-3xl p-6 shadow-xl border border-[#EDE8F5]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-2">
                  {profile.name}
                </h1>
                <p className="text-xl text-[#7091E6] font-semibold mb-3">{profile.position || 'Coach'}</p>
                <div className="flex flex-wrap items-center gap-3">
                  {profile.location && (
                    <div className="flex items-center gap-1 text-sm text-[#8697C4]">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  <div className="px-3 py-1 rounded-full bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white text-xs font-bold uppercase tracking-wide">
                    coach
                  </div>
                </div>
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
      </div>
    </div>
  )
}
