"use client"

import { useEffect, useState } from 'react'
import { Pencil, MapPin, Trophy, Award, Target, Camera, Mail, User as UserIcon, Zap, TrendingUp, Activity, Calendar, Video, Heart, Dumbbell, BarChart3, Shield, Users } from 'lucide-react'
import { useAuth } from '../../lib/context/AuthContext'
import { useToast } from '../../components/ToastProvider'
import StatCard from '../../components/profile/StatCard'
import PerformanceBar from '../../components/profile/PerformanceBar'
import EditModal from '../../components/profile/EditModal'
import SportsSection from '../../components/profile/SportsSection'
import MatchCard from '../../components/profile/MatchCard'
import TrainingCard from '../../components/profile/TrainingCard'
import VideoCard from '../../components/profile/VideoCard'
import AchievementBadge from '../../components/profile/AchievementBadge'
import TeamCard from '../../components/profile/TeamCard'
import CertCard from '../../components/profile/CertCard'
import StatRow from '../../components/profile/StatRow'
import EmptyState from '../../components/profile/EmptyState'

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
          // Convert snake_case from DB to camelCase for frontend
          setProfile({
            id: profiles.id,
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
          // initialize empty sports profile
          setProfile({
            id: user.id,
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
        setProfile({
          id: user.id,
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
      if (section === 'about' || section === 'location' || section === 'position' || section === 'dietPlan') {
        updatedProfile[section] = data.value
      } else if (section === 'athleticStats' || section === 'physicalStats' || section === 'socialLinks') {
        updatedProfile[section] = data.value
      } else if (['achievements', 'trainingSchedule', 'matchHistory', 'videoHighlights', 'certifications', 'teams', 'performanceMetrics'].includes(section)) {
        if (data.index !== undefined) {
          updatedProfile[section][data.index] = data.item
        } else {
          updatedProfile[section] = [...(updatedProfile[section] || []), data.item]
        }
      }

      // Convert camelCase to snake_case for database
      const dbProfile = {
        id: user.id,
        about: updatedProfile.about,
        location: updatedProfile.location,
        position: updatedProfile.position,
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
      
      // Convert camelCase to snake_case for database
      const dbProfile = {
        id: user.id,
        about: updatedProfile.about,
        location: updatedProfile.location,
        position: updatedProfile.position,
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
      // Upload to Supabase Storage with consistent name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/cover_photo.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      // Update profile in database
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
      // Upload to Supabase Storage with consistent name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/profile_picture.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      // Update profile in database
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
    <div className="max-w-7xl mx-auto p-8 text-center text-[#8697C4]">Please sign in to view your profile.</div>
  )

  if (loading) return (
    <div className="max-w-7xl mx-auto p-8 text-center text-[#8697C4]">Loading profile...</div>
  )

  const isPlayer = user.user_metadata?.role === 'player'

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Hero Section with Cover & Stats */}
      <div className="relative">
        <div className="h-48 md:h-64 rounded-3xl bg-linear-to-br from-[#3D52A0] via-[#5B7CC9] to-[#7091E6] relative overflow-hidden">
          {profile?.coverPhoto && (
            <img 
              src={profile.coverPhoto} 
              alt="Cover" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-10 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-white rotate-45"></div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
            id="cover-upload"
            disabled={uploadingCover}
          />
          <label htmlFor="cover-upload" className="absolute top-6 right-6 p-3 rounded-xl bg-black/50 backdrop-blur-sm hover:bg-black/30 transition-colors cursor-pointer">
            {uploadingCover ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </label>
          
          {/* Floating Stats Cards */}
          <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto">
            <StatCard icon={Trophy} label="Achievements" value={profile?.achievements?.length || 0} color="from-amber-400 to-orange-500" />
            <StatCard icon={Target} label="Matches" value={profile?.matchHistory?.length || 0} color="from-blue-400 to-cyan-500" />
            <StatCard icon={Award} label="Score" value={profile?.assessments?.[0]?.score || '-'} color="from-purple-400 to-pink-500" />
            <StatCard icon={Zap} label="Training" value={profile?.trainingSchedule?.length || 0} color="from-green-400 to-emerald-500" />
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="mt-10">
          <div className="bg-white rounded-3xl shadow-xl border border-[#EDE8F5] p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center shadow-lg overflow-hidden">
                  {profile?.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-white" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  id="profile-upload"
                  disabled={uploadingProfile}
                />
                <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white shadow-lg border-2 border-white cursor-pointer hover:bg-gray-50 transition-colors">
                  {uploadingProfile ? (
                    <div className="w-4 h-4 border-2 border-[#3D52A0] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-[#3D52A0]" />
                  )}
                </label>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-2">
                      {user.user_metadata?.first_name || 'Unknown'} {user.user_metadata?.last_name || ''}
                    </h1>
                    <p className="text-xl text-[#7091E6] font-semibold mb-3">{profile?.position || 'Add your position'}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {profile?.location && (
                        <div className="flex items-center gap-1 text-sm text-[#8697C4]">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </div>
                      )}
                      <div className="px-3 py-1 rounded-full bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white text-xs font-bold uppercase tracking-wide">
                        {user.user_metadata?.role || 'player'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#8697C4]">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit('header', { position: profile?.position, location: profile?.location })}
                    className="p-3 rounded-xl hover:bg-[#EDE8F5] transition-colors"
                  >
                    <Pencil className="w-5 h-5 text-[#8697C4]" />
                  </button>
                </div>

                {/* Quick Athletic Stats */}
                {profile?.athleticStats && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {profile.athleticStats.height && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-[#3D52A0]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#8697C4]">Height</div>
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
                          <div className="text-xs text-[#8697C4]">Weight</div>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <SportsSection
            title="About"
            icon={UserIcon}
            onEdit={() => openEdit('about', { value: profile?.about })}
          >
            <p className="text-[#1a1a2e] whitespace-pre-wrap">
              {profile?.about || 'Tell us about your athletic journey, achievements, and goals...'}
            </p>
          </SportsSection>

          {/* Physical Performance Metrics */}
          <SportsSection
            title="Physical Performance"
            icon={Activity}
            onEdit={() => openEdit('physicalStats', { value: profile?.physicalStats })}
          >
            <div className="space-y-3">
              <PerformanceBar label="Speed" value={profile?.physicalStats?.speed || 0} icon={Zap} color="blue" />
              <PerformanceBar label="Strength" value={profile?.physicalStats?.strength || 0} icon={Dumbbell} color="red" />
              <PerformanceBar label="Endurance" value={profile?.physicalStats?.endurance || 0} icon={Heart} color="green" />
              <PerformanceBar label="Agility" value={profile?.physicalStats?.agility || 0} icon={Target} color="purple" />
              <PerformanceBar label="Flexibility" value={profile?.physicalStats?.flexibility || 0} icon={Activity} color="orange" />
            </div>
          </SportsSection>

          {/* Match History */}
          {isPlayer && (
            <SportsSection
              title="Match History"
              icon={Trophy}
              onEdit={() => openEdit('matchHistory', { item: {} })}
              addButton
              addLabel="Add Match"
            >
              {profile?.matchHistory?.length > 0 ? (
                <div className="space-y-3">
                  {profile.matchHistory.map((match, i) => (
                    <MatchCard
                      key={i}
                      data={match}
                      onEdit={() => openEdit('matchHistory', { item: match, index: i })}
                      onDelete={() => deleteItem('matchHistory', i)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState text="No matches recorded yet" />
              )}
            </SportsSection>
          )}

          {/* Training Schedule */}
          <SportsSection
            title="Training Schedule"
            icon={Calendar}
            onEdit={() => openEdit('trainingSchedule', { item: {} })}
            addButton
            addLabel="Add Session"
          >
            {profile?.trainingSchedule?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.trainingSchedule.map((session, i) => (
                  <TrainingCard
                    key={i}
                    data={session}
                    onEdit={() => openEdit('trainingSchedule', { item: session, index: i })}
                    onDelete={() => deleteItem('trainingSchedule', i)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No training sessions scheduled" />
            )}
          </SportsSection>

          {/* Video Highlights */}
          <SportsSection
            title="Video Highlights"
            icon={Video}
            onEdit={() => openEdit('videoHighlights', { item: {} })}
            addButton
            addLabel="Add Video"
          >
            {profile?.videoHighlights?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.videoHighlights.map((video, i) => (
                  <VideoCard
                    key={i}
                    data={video}
                    onEdit={() => openEdit('videoHighlights', { item: video, index: i })}
                    onDelete={() => deleteItem('videoHighlights', i)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No video highlights added yet" />
            )}
          </SportsSection>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Athletic Stats Card */}
          <SportsSection
            title="Athletic Stats"
            icon={BarChart3}
            onEdit={() => openEdit('athleticStats', { value: profile?.athleticStats })}
            compact
          >
            <div className="space-y-3">
              <StatRow label="Height" value={profile?.athleticStats?.height || 'Not set'} />
              <StatRow label="Weight" value={profile?.athleticStats?.weight || 'Not set'} />
              <StatRow label="Age" value={profile?.athleticStats?.age || 'Not set'} />
              <StatRow label="Primary Sport" value={profile?.athleticStats?.primarySport || 'Not set'} />
            </div>
          </SportsSection>

          {/* Achievements */}
          <SportsSection
            title="Achievements"
            icon={Award}
            onEdit={() => openEdit('achievements', { item: {} })}
            addButton
            compact
          >
            {profile?.achievements?.length > 0 ? (
              <div className="space-y-2">
                {profile.achievements.map((achievement, i) => (
                  <AchievementBadge
                    key={i}
                    data={achievement}
                    onDelete={() => deleteItem('achievements', i)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No achievements yet" small />
            )}
          </SportsSection>

          {/* Teams/Clubs */}
          <SportsSection
            title={isPlayer ? "Teams" : "Coaching History"}
            icon={Users}
            onEdit={() => openEdit('teams', { item: {} })}
            addButton
            compact
          >
            {profile?.teams?.length > 0 ? (
              <div className="space-y-2">
                {profile.teams.map((team, i) => (
                  <TeamCard
                    key={i}
                    data={team}
                    onEdit={() => openEdit('teams', { item: team, index: i })}
                    onDelete={() => deleteItem('teams', i)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No teams added yet" small />
            )}
          </SportsSection>

          {/* Certifications (for coaches) */}
          {!isPlayer && (
            <SportsSection
              title="Certifications"
              icon={Shield}
              onEdit={() => openEdit('certifications', { item: {} })}
              addButton
              compact
            >
              {profile?.certifications?.length > 0 ? (
                <div className="space-y-2">
                  {profile.certifications.map((cert, i) => (
                    <CertCard
                      key={i}
                      data={cert}
                      onDelete={() => deleteItem('certifications', i)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState text="No certifications added" small />
              )}
            </SportsSection>
          )}

          {/* Proctored Assessments */}
          <SportsSection
            title="Assessments"
            icon={Target}
            onEdit={() => {}}
            addButton
            addLabel="Take Test"
            compact
          >
            {profile?.assessments?.length > 0 ? (
              <div className="space-y-2">
                {profile.assessments.map((test, i) => (
                  <div key={i} className="p-3 rounded-xl bg-linear-to-r from-[#3D52A0]/10 to-[#7091E6]/10 border border-[#7091E6]/20">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-2xl text-[#3D52A0]">{test.score}</div>
                      <div className="text-xs text-[#8697C4]">{new Date(test.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Take your first assessment" small />
            )}
          </SportsSection>
        </div>
      </div>

      {/* Edit Modals */}
      <EditModal
        isOpen={editingSection === 'header'}
        onClose={closeEdit}
        title="Edit Profile Header"
        sectionData={sectionData}
        onSave={async (data) => {
          if (!user) return
          try {
            const updatedProfile = { ...profile, position: data.position, location: data.location }
            
            const dbProfile = {
              id: user.id,
              about: updatedProfile.about,
              location: updatedProfile.location,
              position: updatedProfile.position,
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
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Position/Title</label>
            <input
              type="text"
              value={sectionData.position || ''}
              onChange={(e) => setSectionData({ ...sectionData, position: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none"
              placeholder="e.g., Professional Athlete, Point Guard, Head Coach"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={sectionData.location || ''}
              onChange={(e) => setSectionData({ ...sectionData, location: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none"
              placeholder="e.g., Mumbai, India"
            />
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={editingSection === 'about'}
        onClose={closeEdit}
        title="About You"
        sectionData={sectionData}
        onSave={(data) => saveSection('about', data)}
      >
        <textarea
          value={sectionData.value || ''}
          onChange={(e) => setSectionData({ ...sectionData, value: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none"
          placeholder="Share your athletic journey, goals, and what makes you unique..."
        />
      </EditModal>

      <EditModal
        isOpen={editingSection === 'athleticStats'}
        onClose={closeEdit}
        title="Athletic Stats"
        sectionData={sectionData}
        onSave={(data) => saveSection('athleticStats', data)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Height</label>
              <input
                type="text"
                value={sectionData.value?.height || ''}
                onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, height: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
                placeholder="e.g., 6'2&quot;"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight</label>
              <input
                type="text"
                value={sectionData.value?.weight || ''}
                onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, weight: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
                placeholder="e.g., 180 lbs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <input
                type="text"
                value={sectionData.value?.age || ''}
                onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, age: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
                placeholder="e.g., 24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Sport</label>
              <input
                type="text"
                value={sectionData.value?.primarySport || ''}
                onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, primarySport: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
                placeholder="e.g., Basketball"
              />
            </div>
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={editingSection === 'physicalStats'}
        onClose={closeEdit}
        sectionData={sectionData}
        title="Physical Performance"
        onSave={(data) => saveSection('physicalStats', data)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Speed (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sectionData.value?.speed || 0}
              onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, speed: parseInt(e.target.value) } })}
              className="w-full"
            />
            <div className="text-right text-sm font-bold text-[#3D52A0]">{sectionData.value?.speed || 0}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Strength (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sectionData.value?.strength || 0}
              onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, strength: parseInt(e.target.value) } })}
              className="w-full"
            />
            <div className="text-right text-sm font-bold text-[#3D52A0]">{sectionData.value?.strength || 0}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Endurance (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sectionData.value?.endurance || 0}
              onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, endurance: parseInt(e.target.value) } })}
              className="w-full"
            />
            <div className="text-right text-sm font-bold text-[#3D52A0]">{sectionData.value?.endurance || 0}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Agility (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sectionData.value?.agility || 0}
              onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, agility: parseInt(e.target.value) } })}
              className="w-full"
            />
            <div className="text-right text-sm font-bold text-[#3D52A0]">{sectionData.value?.agility || 0}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Flexibility (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sectionData.value?.flexibility || 0}
              onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, flexibility: parseInt(e.target.value) } })}
              className="w-full"
            />
            <div className="text-right text-sm font-bold text-[#3D52A0]">{sectionData.value?.flexibility || 0}</div>
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={editingSection === 'matchHistory'}
        onClose={closeEdit}
        sectionData={sectionData}
        title={sectionData.index !== undefined ? "Edit Match" : "Add Match"}
        onSave={(data) => saveSection('matchHistory', data)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Opponent</label>
            <input
              type="text"
              value={sectionData.item?.opponent || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, opponent: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Result</label>
              <select
                value={sectionData.item?.result || 'win'}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, result: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              >
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="draw">Draw</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Score</label>
              <input
                type="text"
                value={sectionData.item?.score || ''}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, score: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
                placeholder="e.g., 3-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={sectionData.item?.date || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, date: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Performance</label>
            <textarea
              value={sectionData.item?.performance || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, performance: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              placeholder="Goals, assists, key plays..."
            />
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={editingSection === 'trainingSchedule'}
        sectionData={sectionData}
        onClose={closeEdit}
        title={sectionData.index !== undefined ? "Edit Training" : "Add Training"}
        onSave={(data) => saveSection('trainingSchedule', data)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Exercise Name</label>
            <input
              type="text"
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                value={sectionData.item?.duration || ''}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, duration: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
                placeholder="e.g., 45 min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Intensity</label>
              <select
                value={sectionData.item?.intensity || 'medium'}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, intensity: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Day/Frequency</label>
            <input
              type="text"
              value={sectionData.item?.frequency || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, frequency: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              placeholder="e.g., Monday, Wednesday, Friday"
            />
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={editingSection === 'videoHighlights'}
        sectionData={sectionData}
        onClose={closeEdit}
        title={sectionData.index !== undefined ? "Edit Video" : "Add Video"}
        onSave={(data) => saveSection('videoHighlights', data)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Video Title</label>
            <input
              type="text"
              value={sectionData.item?.title || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, title: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <input
              type="text"
              value={sectionData.item?.url || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, url: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              placeholder="YouTube, Vimeo, or direct link"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={sectionData.item?.description || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, description: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
        </div>
      </EditModal>

      <EditModal
        sectionData={sectionData}
        isOpen={editingSection === 'achievements'}
        onClose={closeEdit}
        title="Add Achievement"
        onSave={(data) => saveSection('achievements', data)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Achievement Title</label>
            <input
              type="text"
              value={sectionData.item?.title || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, title: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              placeholder="e.g., State Champion 2023"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <input
              type="text"
              value={sectionData.item?.year || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, year: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              placeholder="2023"
            />
          </div>
        </div>
      </EditModal>

      <EditModal
        sectionData={sectionData}
        isOpen={editingSection === 'teams'}
        onClose={closeEdit}
        title={sectionData.index !== undefined ? "Edit Team" : "Add Team"}
        onSave={(data) => saveSection('teams', data)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Team Name</label>
            <input
              type="text"
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Year</label>
              <input
                type="text"
                value={sectionData.item?.startYear || ''}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, startYear: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Year</label>
              <input
                type="text"
                value={sectionData.item?.endYear || ''}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, endYear: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
                placeholder="Present"
              />
            </div>
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={editingSection === 'certifications'}
        onClose={closeEdit}
        title="Add Certification"
        sectionData={sectionData}
        onSave={(data) => saveSection('certifications', data)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Certification Name</label>
            <input
              type="text"
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Issuing Organization</label>
            <input
              type="text"
              value={sectionData.item?.issuer || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, issuer: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <input
              type="text"
              value={sectionData.item?.year || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, year: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] outline-none"
            />
          </div>
        </div>
      </EditModal>
    </div>
  )
}