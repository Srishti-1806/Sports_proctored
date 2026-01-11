import EditModal from './EditModal'

export default function ProfileEditModals({ 
  editingSection, 
  sectionData, 
  setSectionData, 
  closeEdit, 
  saveSection, 
  user, 
  profile, 
  setProfile,
  supabase,
  toast,
}) {
    return (
      <>
        {/* Header Edit */}
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
                cover_photo: updatedProfile.coverPhoto,
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
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none"
                placeholder="e.g., Professional Athlete, Point Guard, Head Coach"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={sectionData.location || ''}
                onChange={(e) => setSectionData({ ...sectionData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none"
                placeholder="e.g., Mumbai, India"
              />
            </div>
          </div>
        </EditModal>

        {/* About Edit */}
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
            className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none"
            placeholder="Share your athletic journey, goals, and what makes you unique..."
          />
        </EditModal>

        {/* Athletic Stats Edit */}
        <EditModal
          isOpen={editingSection === 'athleticStats'}
          onClose={closeEdit}
          title={user?.user_metadata?.role === 'player' ? "Athletic Stats" : "Coaching Profile"}
          sectionData={sectionData}
          onSave={(data) => saveSection('athleticStats', data)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {user?.user_metadata?.role === 'player' ? 'Height' : 'Specialty'}
                </label>
                <input
                  type="text"
                  value={sectionData.value?.height || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, height: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder={user?.user_metadata?.role === 'player' ? "e.g., 6'2\"" : "e.g., Strength Training"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {user?.user_metadata?.role === 'player' ? 'Weight' : 'Coaching Level'}
                </label>
                <input
                  type="text"
                  value={sectionData.value?.weight || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, weight: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder={user?.user_metadata?.role === 'player' ? "e.g., 180 lbs" : "e.g., Advanced"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {user?.user_metadata?.role === 'player' ? 'Age' : 'Experience (years)'}
                </label>
                <input
                  type="text"
                  value={sectionData.value?.age || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, age: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder={user?.user_metadata?.role === 'player' ? "e.g., 24" : "e.g., 10 years"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Primary Sport</label>
                <input
                  type="text"
                  value={sectionData.value?.primarySport || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, primarySport: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder="e.g., Basketball"
                />
              </div>
            </div>
          </div>
        </EditModal>

        {/* Physical Stats Edit */}
        <EditModal
          isOpen={editingSection === 'physicalStats'}
          onClose={closeEdit}
          sectionData={sectionData}
          title={user?.user_metadata?.role === 'player' ? "Physical Performance" : "Coaching Effectiveness"}
          onSave={(data) => saveSection('physicalStats', data)}
        >
          <div className="space-y-4">
            {user?.user_metadata?.role === 'player' ? (
              ['speed', 'strength', 'endurance', 'agility', 'flexibility'].map(stat => (
                <div key={stat}>
                  <label className="block text-sm font-medium mb-2 capitalize">{stat} (0-100)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sectionData.value?.[stat] || 0}
                    onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, [stat]: parseInt(e.target.value) } })}
                    className="w-full"
                  />
                  <div className="text-right text-sm font-bold text-primary-bright">{sectionData.value?.[stat] || 0}</div>
                </div>
              ))
            ) : (
              [
                { key: 'speed', label: 'Leadership' },
                { key: 'strength', label: 'Communication' },
                { key: 'endurance', label: 'Strategy' },
                { key: 'agility', label: 'Motivation' },
                { key: 'flexibility', label: 'Technical Knowledge' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2">{label} (0-100)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sectionData.value?.[key] || 0}
                    onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, [key]: parseInt(e.target.value) } })}
                    className="w-full"
                  />
                  <div className="text-right text-sm font-bold text-primary-bright">{sectionData.value?.[key] || 0}</div>
                </div>
              ))
            )}
          </div>
        </EditModal>

        {/* Match History Edit */}
        <EditModal
          isOpen={editingSection === 'matchHistory'}
          onClose={closeEdit}
          sectionData={sectionData}
          title={sectionData.index !== undefined ? "Edit Match" : "Add Match"}
          onSave={(data) => saveSection('matchHistory', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Opponent"
              value={sectionData.item?.opponent || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, opponent: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={sectionData.item?.result || 'win'}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, result: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              >
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="draw">Draw</option>
              </select>
              <input
                type="text"
                placeholder="Score (e.g., 3-2)"
                value={sectionData.item?.score || ''}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, score: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              />
            </div>
            <input
              type="date"
              value={sectionData.item?.date || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, date: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <textarea
              placeholder="Your performance details..."
              value={sectionData.item?.performance || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, performance: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
          </div>
        </EditModal>

        {/* Training Schedule Edit */}
        <EditModal
          isOpen={editingSection === 'trainingSchedule'}
          sectionData={sectionData}
          onClose={closeEdit}
          title={
            user?.user_metadata?.role === 'player' 
              ? (sectionData.index !== undefined ? "Edit Training" : "Add Training")
              : (sectionData.index !== undefined ? "Edit Program" : "Add Program")
          }
          onSave={(data) => saveSection('trainingSchedule', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder={user?.user_metadata?.role === 'player' ? "Exercise Name" : "Program Name"}
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={user?.user_metadata?.role === 'player' ? "Duration (e.g., 45 min)" : "Duration (e.g., 8 weeks)"}
                value={sectionData.item?.duration || ''}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, duration: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              />
              <select
                value={sectionData.item?.intensity || 'medium'}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, intensity: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              >
                <option value="low">{user?.user_metadata?.role === 'player' ? 'Low' : 'Beginner'}</option>
                <option value="medium">{user?.user_metadata?.role === 'player' ? 'Medium' : 'Intermediate'}</option>
                <option value="high">{user?.user_metadata?.role === 'player' ? 'High' : 'Advanced'}</option>
              </select>
            </div>
            <input
              type="text"
              placeholder={user?.user_metadata?.role === 'player' ? "Day/Frequency (e.g., Mon, Wed, Fri)" : "Schedule (e.g., 3x per week)"}
              value={sectionData.item?.frequency || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, frequency: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
          </div>
        </EditModal>

        {/* Video Highlights Edit */}
        <EditModal
          isOpen={editingSection === 'videoHighlights'}
          sectionData={sectionData}
          onClose={closeEdit}
          title={sectionData.index !== undefined ? "Edit Video" : "Add Video"}
          onSave={(data) => saveSection('videoHighlights', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Video Title"
              value={sectionData.item?.title || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, title: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder="Video URL (YouTube, Vimeo, etc.)"
              value={sectionData.item?.url || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, url: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <textarea
              placeholder="Description"
              value={sectionData.item?.description || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, description: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
          </div>
        </EditModal>

        {/* Achievements Edit */}
        <EditModal
          sectionData={sectionData}
          isOpen={editingSection === 'achievements'}
          onClose={closeEdit}
          title="Add Achievement"
          onSave={async (data) => {
            let updatedData = { ...data }
            if (data.achievementFile && user) {
              try {
                const fileExt = data.achievementFile.name.split('.').pop()
                const fileName = `${user.id}/achievements/${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                  .from('profile-images')
                  .upload(fileName, data.achievementFile)
                if (uploadError) throw uploadError
                const { data: urlData } = supabase.storage
                  .from('profile-images')
                  .getPublicUrl(fileName)
                updatedData.item = { ...updatedData.item, achievementImage: urlData.publicUrl }
                delete updatedData.achievementFile
              } catch (e) {
                console.error('Error uploading achievement:', e)
                toast?.show('Failed to upload achievement image')
                return
              }
            }
            saveSection('achievements', updatedData)
          }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Achievement Title (e.g., State Champion 2023)"
              value={sectionData.item?.title || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, title: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder="Event/Competition Name"
              value={sectionData.item?.event || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, event: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder="Year"
              value={sectionData.item?.year || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                setSectionData({ ...sectionData, item: { ...sectionData.item, year: value } })
              }}
              maxLength="4"
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div>
              <label className="block text-sm font-medium mb-2">Achievement Photo (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="achievement-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSectionData({ ...sectionData, achievementFile: file })
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="achievement-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary-bright bg-primary-soft/30 hover:bg-primary-soft/50 cursor-pointer transition-colors group"
                >
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary-bright">
                    {sectionData.achievementFile ? sectionData.achievementFile.name : 'Upload Achievement Photo'}
                  </span>
                </label>
              </div>
              {(sectionData.item?.achievementImage || sectionData.achievementFile) && (
                <div className="mt-3">
                  <img 
                    src={sectionData.achievementFile ? URL.createObjectURL(sectionData.achievementFile) : sectionData.item.achievementImage} 
                    alt="Achievement Preview" 
                    className="w-full h-40 object-cover rounded-xl border border-border"
                  />
                </div>
              )}
            </div>
          </div>
        </EditModal>

        {/* Teams Edit */}
        <EditModal
          sectionData={sectionData}
          isOpen={editingSection === 'teams'}
          onClose={closeEdit}
          title={sectionData.index !== undefined ? "Edit Team" : "Add Team"}
          onSave={(data) => saveSection('teams', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Team Name"
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Start Year"
                value={sectionData.item?.startYear ?? sectionData.item?.start_year ?? ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setSectionData({ ...sectionData, item: { ...sectionData.item, startYear: value, start_year: value } })
                }}
                maxLength="4"
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              />
              <input
                type="text"
                placeholder="End Year (Present)"
                value={sectionData.item?.endYear ?? sectionData.item?.end_year ?? ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setSectionData({ ...sectionData, item: { ...sectionData.item, endYear: value, end_year: value } })
                }}
                maxLength="4"
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              />
            </div>
          </div>
        </EditModal>

        {/* Certifications Edit */}
        <EditModal
          isOpen={editingSection === 'certifications'}
          onClose={closeEdit}
          title="Add Certification"
          sectionData={sectionData}
          onSave={async (data) => {
            let updatedData = { ...data }
            if (data.certificateFile && user) {
              try {
                const fileExt = data.certificateFile.name.split('.').pop()
                const fileName = `${user.id}/certificates/${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                  .from('profile-images')
                  .upload(fileName, data.certificateFile)
                if (uploadError) throw uploadError
                const { data: urlData } = supabase.storage
                  .from('profile-images')
                  .getPublicUrl(fileName)
                updatedData.item = { ...updatedData.item, certificateImage: urlData.publicUrl }
                delete updatedData.certificateFile
              } catch (e) {
                console.error('Error uploading certificate:', e)
                toast?.show('Failed to upload certificate image')
                return
              }
            }
            saveSection('certifications', updatedData)
          }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Certification Name"
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder="Issuing Organization"
              value={sectionData.item?.issuer || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, issuer: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder="Year"
              value={sectionData.item?.year || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                setSectionData({ ...sectionData, item: { ...sectionData.item, year: value } })
              }}
              maxLength="4"
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div>
              <label className="block text-sm font-medium mb-2">Certificate Image (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="cert-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSectionData({ ...sectionData, certificateFile: file })
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="cert-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary-bright bg-primary-soft/30 hover:bg-primary-soft/50 cursor-pointer transition-colors group"
                >
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary-bright">
                    {sectionData.certificateFile ? sectionData.certificateFile.name : 'Upload Certificate Image'}
                  </span>
                </label>
              </div>
              {(sectionData.item?.certificateImage || sectionData.certificateFile) && (
                <div className="mt-3">
                  <img 
                    src={sectionData.certificateFile ? URL.createObjectURL(sectionData.certificateFile) : sectionData.item.certificateImage} 
                    alt="Certificate Preview" 
                    className="w-full h-40 object-cover rounded-xl border border-border" 
                  />
                </div>
              )}
            </div>
          </div>
        </EditModal>
      </>
    )
  }
