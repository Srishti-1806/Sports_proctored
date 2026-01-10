"use client"

import { useEffect, useState } from 'react'
import { Camera, Trophy, Award, Target, Zap, User as UserIcon, Pencil, MapPin, Mail, TrendingUp, Dumbbell, Calendar } from 'lucide-react'
import { useAuth } from '../../lib/context/AuthContext'
import { useToast } from '../../components/ToastProvider'
import StatCard from '../../components/profile/StatCard'
import ProfileEditModals from '../../components/profile/ProfileEditModals'
import PlayerProfile from '../../components/profile/PlayerProfile'
import CoachProfile from '../../components/profile/CoachProfile'

export default function ProfilePage() {
  const { user, supabase } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [sectionData, setSectionData] = useState({})
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingProfile, setUploadingProfile] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const { data: profiles, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profiles && !error) {
          setProfile({
            id: profiles.id,
            fullName: profiles.full_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`,
            about: profiles.about || '',
            location: profiles.location || '',
            position: profiles.position || '',
            profilePicture: profiles.profile_picture || '',
            coverPhoto: profiles.cover_photo || '',
            athleticStats: profiles.athletic_stats || { height: '', weight: '', age: '', primarySport: '' },
            performanceMetrics: profiles.performance_metrics || [],
            achievements: profiles.achievements || [],
            trainingSchedule: profiles.training_schedule || [],
            matchHistory: profiles.match_history || [],
            videoHighlights: profiles.video_highlights || [],
            certifications: profiles.certifications || [],
            teams: profiles.teams || [],
            physicalStats: profiles.physical_stats || { speed: 0, strength: 0, endurance: 0, agility: 0, flexibility: 0 },
            dietPlan: profiles.diet_plan || '',
            socialLinks: profiles.social_links || {},
            assessments: profiles.assessments || []
          })
        } else {
          setProfile({
            id: user.id,
            fullName: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`,
            about: '',
            location: '',
            position: '',
            profilePicture: '',
            coverPhoto: '',
            athleticStats: { height: '', weight: '', age: '', primarySport: '' },
            performanceMetrics: [],
            achievements: [],
            trainingSchedule: [],
            matchHistory: [],
            videoHighlights: [],
            certifications: [],
            teams: [],
            physicalStats: { speed: 0, strength: 0, endurance: 0, agility: 0, flexibility: 0 },
            dietPlan: '',
            socialLinks: {},
            assessments: []
          })
        }
      } catch (e) {
        console.error('Error fetching profile:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, supabase])

  const openEdit = (section, data = {}) => {
    setEditingSection(section)
    setSectionData(data)
  }

  const closeEdit = () => {
    setEditingSection(null)
    setSectionData({})
  }

  const saveSection = async (section, data) => {
    if (!user) return
    try {
      let updatedProfile = { ...profile }
      if (section === 'about' || section === 'location' || section === 'position') {
        updatedProfile[section] = data.value
      } else if (section === 'athleticStats' || section === 'physicalStats') {
        updatedProfile[section] = data.value
      } else if (['achievements', 'trainingSchedule', 'matchHistory', 'videoHighlights', 'certifications', 'teams'].includes(section)) {
        if (data.index !== undefined) {
          updatedProfile[section][data.index] = data.item
        } else {
          updatedProfile[section] = [...(updatedProfile[section] || []), data.item]
        }
      }

      const dbProfile = {
        id: user.id,
        about: updatedProfile.about,
        location: updatedProfile.location,
        position: updatedProfile.position,
        profile_picture: updatedProfile.profilePicture,
        cover_photo: updatedProfile.coverPhoto,
        athletic_stats: updatedProfile.athleticStats,
        physical_stats: updatedProfile.physicalStats,
        achievements: updatedProfile.achievements,
        training_schedule: updatedProfile.trainingSchedule,
        match_history: updatedProfile.matchHistory,
        video_highlights: updatedProfile.videoHighlights,
        certifications: updatedProfile.certifications,
        teams: updatedProfile.teams,
        performance_metrics: updatedProfile.performanceMetrics,
        diet_plan: updatedProfile.dietPlan,
        social_links: updatedProfile.socialLinks,
        assessments: updatedProfile.assessments
      }

      const { error } = await supabase.from('profiles').upsert(dbProfile)
      if (error) throw error
      
      setProfile(updatedProfile)
      closeEdit()
      toast?.show('Profile updated successfully')
    } catch (e) {
      console.error('Error saving profile:', e)
      toast?.show('Failed to update profile')
    }
  }

  const deleteItem = async (section, index) => {
    if (!user) return
    try {
      const updatedProfile = { ...profile }
      updatedProfile[section].splice(index, 1)
      
      const dbProfile = {
        id: user.id,
        about: updatedProfile.about,
        location: updatedProfile.location,
        position: updatedProfile.position,
        profile_picture: updatedProfile.profilePicture,
        cover_photo: updatedProfile.coverPhoto,
        athletic_stats: updatedProfile.athleticStats,
        physical_stats: updatedProfile.physicalStats,
        achievements: updatedProfile.achievements,
        training_schedule: updatedProfile.trainingSchedule,
        match_history: updatedProfile.matchHistory,
        video_highlights: updatedProfile.videoHighlights,
        certifications: updatedProfile.certifications,
        teams: updatedProfile.teams,
        performance_metrics: updatedProfile.performanceMetrics,
        diet_plan: updatedProfile.dietPlan,
        social_links: updatedProfile.socialLinks,
        assessments: updatedProfile.assessments
      }
      
      const { error } = await supabase.from('profiles').upsert(dbProfile)
      if (error) throw error
      
      setProfile(updatedProfile)
      toast?.show('Item deleted')
    } catch (e) {
      console.error('Error deleting item:', e)
      toast?.show('Failed to delete item')
    }
  }

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploadingCover(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/cover_photo.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      const updatedProfile = { ...profile, coverPhoto: publicUrl }
      const dbProfile = {
        id: user.id,
        about: updatedProfile.about,
        location: updatedProfile.location,
        position: updatedProfile.position,
        cover_photo: publicUrl,
        profile_picture: updatedProfile.profilePicture,
        athletic_stats: updatedProfile.athleticStats,
        physical_stats: updatedProfile.physicalStats,
        achievements: updatedProfile.achievements,
        training_schedule: updatedProfile.trainingSchedule,
        match_history: updatedProfile.matchHistory,
        video_highlights: updatedProfile.videoHighlights,
        certifications: updatedProfile.certifications,
        teams: updatedProfile.teams,
        performance_metrics: updatedProfile.performanceMetrics,
        diet_plan: updatedProfile.dietPlan,
        social_links: updatedProfile.socialLinks,
        assessments: updatedProfile.assessments
      }

      const { error } = await supabase.from('profiles').upsert(dbProfile)
      if (error) throw error

      setProfile(updatedProfile)
      toast?.show('Cover photo updated successfully')
    } catch (e) {
      console.error('Error uploading cover photo:', e)
      toast?.show('Failed to upload cover photo')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploadingProfile(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/profile_picture.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      const updatedProfile = { ...profile, profilePicture: publicUrl }
      const dbProfile = {
        id: user.id,
        about: updatedProfile.about,
        location: updatedProfile.location,
        position: updatedProfile.position,
        cover_photo: updatedProfile.coverPhoto,
        profile_picture: publicUrl,
        athletic_stats: updatedProfile.athleticStats,
        physical_stats: updatedProfile.physicalStats,
        achievements: updatedProfile.achievements,
        training_schedule: updatedProfile.trainingSchedule,
        match_history: updatedProfile.matchHistory,
        video_highlights: updatedProfile.videoHighlights,
        certifications: updatedProfile.certifications,
        teams: updatedProfile.teams,
        performance_metrics: updatedProfile.performanceMetrics,
        diet_plan: updatedProfile.dietPlan,
        social_links: updatedProfile.socialLinks,
        assessments: updatedProfile.assessments
      }

      const { error } = await supabase.from('profiles').upsert(dbProfile)
      if (error) throw error

      setProfile(updatedProfile)
      toast?.show('Profile picture updated successfully')
    } catch (e) {
      console.error('Error uploading profile picture:', e)
      toast?.show('Failed to upload profile picture')
    } finally {
      setUploadingProfile(false)
    }
  }

  if (!user) return (
    <div className="max-w-7xl mx-auto p-8 text-center text-primary-muted">Please sign in to view your profile.</div>
  )

  if (loading) return (
    <div className="max-w-7xl mx-auto p-8 text-center text-primary-muted">Loading profile...</div>
  )

  const isPlayer = user.user_metadata?.role === 'player'

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Hero Section with Cover & Stats */}
      <div className="relative">
        <div className="h-48 md:h-64 rounded-3xl bg-linear-to-br from-primary-deep via-primary-deep to-primary-bright relative overflow-hidden">
          {profile?.coverPhoto && (
            <img src={profile.coverPhoto} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-10 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-white rotate-45"></div>
          </div>
          <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" id="cover-upload" disabled={uploadingCover} />
          <label htmlFor="cover-upload" className="absolute top-6 right-6 p-3 rounded-xl bg-black/50 backdrop-blur-sm hover:bg-black/30 transition-colors cursor-pointer">
            {uploadingCover ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </label>
          
          {isPlayer && (
            <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto">
              <StatCard icon={Trophy} label="Achievements" value={profile?.achievements?.length || 0} color="from-amber-400 to-orange-500" />
              <StatCard icon={Target} label="Matches" value={profile?.matchHistory?.length || 0} color="from-blue-400 to-cyan-500" />
              <StatCard icon={Award} label="Score" value={profile?.assessments?.[0]?.score || '-'} color="from-purple-400 to-pink-500" />
              <StatCard icon={Zap} label="Training" value={profile?.trainingSchedule?.length || 0} color="from-green-400 to-emerald-500" />
            </div>
          )}
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
                <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" id="profile-upload" disabled={uploadingProfile} />
                <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-card shadow-lg border-2 border-border cursor-pointer hover:bg-primary-soft transition-colors">
                  {uploadingProfile ? (
                    <div className="w-4 h-4 border-2 border-primary-deep border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-primary" />
                  )}
                </label>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {user.user_metadata?.first_name || 'Unknown'} {user.user_metadata?.last_name || ''}
                    </h1>
                    <p className="text-xl text-primary-bright font-semibold mb-3">{profile?.position || 'Add your position'}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {profile?.location && (
                        <div className="flex items-center gap-1 text-sm text-primary-muted">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </div>
                      )}
                      <div className="px-3 py-1 rounded-full bg-linear-to-r from-primary-deep to-primary-bright text-white text-xs font-bold uppercase tracking-wide">
                        {user.user_metadata?.role || 'player'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-primary-muted">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => openEdit('header', { position: profile?.position, location: profile?.location })} className="p-3 rounded-xl hover:bg-primary-soft transition-colors">
                    <Pencil className="w-5 h-5 text-primary-muted" />
                  </button>
                </div>

                {profile?.athleticStats && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {profile.athleticStats.height && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-[#3D52A0]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#8697C4]">{isPlayer ? 'Height' : 'Experience'}</div>
                          <div className="font-bold text-[#1a1a2e]">{profile.athleticStats.height}</div>
                        </div>
                      </div>
                    )}
                    {profile.athleticStats.weight && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
                          <Dumbbell className="w-4 h-4 text-[#3D52A0]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#8697C4]">{isPlayer ? 'Weight' : 'Level'}</div>
                          <div className="font-bold text-[#1a1a2e]">{profile.athleticStats.weight}</div>
                        </div>
                      </div>
                    )}
                    {profile.athleticStats.age && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-[#3D52A0]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#8697C4]">Age</div>
                          <div className="font-bold text-[#1a1a2e]">{profile.athleticStats.age}</div>
                        </div>
                      </div>
                    )}
                    {profile.athleticStats.primarySport && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-[#3D52A0]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#8697C4]">Sport</div>
                          <div className="font-bold text-[#1a1a2e]">{profile.athleticStats.primarySport}</div>
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

      {/* Role-based Profile Content */}
      {isPlayer ? (
        <PlayerProfile profile={profile} openEdit={openEdit} deleteItem={deleteItem} user={user} />
      ) : (
        <CoachProfile profile={profile} openEdit={openEdit} deleteItem={deleteItem} user={user} />
      )}

      {/* Edit Modals */}
      <ProfileEditModals
        editingSection={editingSection}
        sectionData={sectionData}
        setSectionData={setSectionData}
        closeEdit={closeEdit}
        saveSection={saveSection}
        user={user}
        profile={profile}
        setProfile={setProfile}
        supabase={supabase}
        toast={toast}
      />
    </div>
  )
}
