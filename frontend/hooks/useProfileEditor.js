import { useState } from 'react'

export function useProfileEditor(profile, setProfile, supabase, user, toast) {
  const [editingSection, setEditingSection] = useState(null)
  const [sectionData, setSectionData] = useState({})

  const openEdit = (section, data) => {
    setEditingSection(section)
    setSectionData(data || {})
  }

  const closeEdit = () => {
    setEditingSection(null)
    setSectionData({})
  }

  const convertToDbFormat = (profile) => ({
    id: user.id,
    about: profile.about,
    location: profile.location,
    position: profile.position,
    cover_photo: profile.coverPhoto,
    profile_picture: profile.profilePicture,
    athletic_stats: profile.athleticStats,
    physical_stats: profile.physicalStats,
    achievements: profile.achievements,
    training_schedule: profile.trainingSchedule,
    match_history: profile.matchHistory,
    video_highlights: profile.videoHighlights,
    certifications: profile.certifications,
    teams: profile.teams,
    performance_metrics: profile.performanceMetrics,
    diet_plan: profile.dietPlan,
    social_links: profile.socialLinks,
    assessments: profile.assessments
  })

  const saveSection = async (section, data) => {
    if (!user) return
    try {
      let updatedProfile = { ...profile }

      if (section === 'about') {
        updatedProfile.about = data.value
      } else if (section === 'athleticStats' || section === 'physicalStats') {
        updatedProfile[section] = data.value
      } else if (data.index !== undefined) {
        // Editing existing item
        updatedProfile[section] = [...profile[section]]
        updatedProfile[section][data.index] = data.item
      } else {
        // Adding new item
        updatedProfile[section] = [...(profile[section] || []), data.item]
      }

      const dbProfile = convertToDbFormat(updatedProfile)
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
      updatedProfile[section] = profile[section].filter((_, i) => i !== index)

      const dbProfile = convertToDbFormat(updatedProfile)
      const { error } = await supabase.from('profiles').upsert(dbProfile)
      if (error) throw error

      setProfile(updatedProfile)
      toast?.show('Item deleted successfully')
    } catch (e) {
      console.error('Error deleting item:', e)
      toast?.show('Failed to delete item')
    }
  }

  return {
    editingSection,
    sectionData,
    setSectionData,
    openEdit,
    closeEdit,
    saveSection,
    deleteItem
  }
}
