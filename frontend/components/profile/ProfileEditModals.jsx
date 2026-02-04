import EditModal from './EditModal'
import { useLanguage } from '@/lib/context/LanguageContext'

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
    const { t } = useLanguage()

    return (
      <>
        {/* Header Edit */}
        <EditModal
          isOpen={editingSection === 'header'}
          onClose={closeEdit}
          title={t('profile.editHeader')}
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
              <label className="block text-sm font-medium mb-2">{t('profile.positionTitle')}</label>
              <input
                type="text"
                value={sectionData.position || ''}
                onChange={(e) => setSectionData({ ...sectionData, position: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none"
                placeholder={t('profile.positionPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('profile.location')}</label>
              <input
                type="text"
                value={sectionData.location || ''}
                onChange={(e) => setSectionData({ ...sectionData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none"
                placeholder={t('profile.locationPlaceholder')}
              />
            </div>
          </div>
        </EditModal>

        {/* About Edit */}
        <EditModal
          isOpen={editingSection === 'about'}
          onClose={closeEdit}
          title={t('profile.aboutYou')}
          sectionData={sectionData}
          onSave={(data) => saveSection('about', data)}
        >
          <textarea
            value={sectionData.value || ''}
            onChange={(e) => setSectionData({ ...sectionData, value: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none"
            placeholder={t('profile.aboutPlaceholder')}
          />
        </EditModal>

        {/* Athletic Stats Edit */}
        <EditModal
          isOpen={editingSection === 'athleticStats'}
          onClose={closeEdit}
          title={user?.user_metadata?.role === 'player' ? t('profile.athleticStats') : t('profile.coachingProfile')}
          sectionData={sectionData}
          onSave={(data) => saveSection('athleticStats', data)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {user?.user_metadata?.role === 'player' ? t('profile.height') : t('profile.specialty')}
                </label>
                <input
                  type="text"
                  value={sectionData.value?.height || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, height: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder={user?.user_metadata?.role === 'player' ? t('profile.heightPlaceholder') : t('profile.specialtyPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {user?.user_metadata?.role === 'player' ? t('profile.weight') : t('profile.coachingLevel')}
                </label>
                <input
                  type="text"
                  value={sectionData.value?.weight || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, weight: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder={user?.user_metadata?.role === 'player' ? t('profile.weightPlaceholder') : t('profile.levelPlaceholder')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {user?.user_metadata?.role === 'player' ? t('profile.age') : t('profile.experienceYears')}
                </label>
                <input
                  type="text"
                  value={sectionData.value?.age || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, age: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder={user?.user_metadata?.role === 'player' ? t('profile.agePlaceholder') : t('profile.experiencePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('profile.primarySport')}</label>
                <input
                  type="text"
                  value={sectionData.value?.primarySport || ''}
                  onChange={(e) => setSectionData({ ...sectionData, value: { ...sectionData.value, primarySport: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
                  placeholder={t('profile.sportPlaceholder')}
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
          title={user?.user_metadata?.role === 'player' ? t('profile.physicalPerformance') : t('profile.coachingEffectiveness')}
          onSave={(data) => saveSection('physicalStats', data)}
        >
          <div className="space-y-4">
            {user?.user_metadata?.role === 'player' ? (
              [
                { key: 'speed', label: t('profile.speed') },
                { key: 'strength', label: t('profile.strength') },
                { key: 'endurance', label: t('profile.endurance') },
                { key: 'agility', label: t('profile.agility') },
                { key: 'flexibility', label: t('profile.flexibility') }
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
            ) : (
              [
                { key: 'speed', label: t('profile.leadership') },
                { key: 'strength', label: t('profile.communication') },
                { key: 'endurance', label: t('profile.strategy') },
                { key: 'agility', label: t('profile.motivation') },
                { key: 'flexibility', label: t('profile.technicalKnowledge') }
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
          title={sectionData.index !== undefined ? t('profile.editMatch') : t('profile.addMatch')}
          onSave={(data) => saveSection('matchHistory', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('profile.opponent')}
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
                <option value="win">{t('profile.win')}</option>
                <option value="loss">{t('profile.loss')}</option>
                <option value="draw">{t('profile.draw')}</option>
              </select>
              <input
                type="text"
                placeholder={t('profile.scorePlaceholder')}
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
              placeholder={t('profile.performancePlaceholder')}
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
              ? (sectionData.index !== undefined ? t('profile.editTraining') : t('profile.addTraining'))
              : (sectionData.index !== undefined ? t('profile.editProgram') : t('profile.addProgram'))
          }
          onSave={(data) => saveSection('trainingSchedule', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder={user?.user_metadata?.role === 'player' ? t('profile.exerciseName') : t('profile.programName')}
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={user?.user_metadata?.role === 'player' ? t('profile.durationPlayerPlaceholder') : t('profile.durationCoachPlaceholder')}
                value={sectionData.item?.duration || ''}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, duration: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              />
              <select
                value={sectionData.item?.intensity || 'medium'}
                onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, intensity: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
              >
                <option value="low">{user?.user_metadata?.role === 'player' ? t('profile.low') : t('profile.beginner')}</option>
                <option value="medium">{user?.user_metadata?.role === 'player' ? t('profile.medium') : t('profile.intermediate')}</option>
                <option value="high">{user?.user_metadata?.role === 'player' ? t('profile.high') : t('profile.advanced')}</option>
              </select>
            </div>
            <input
              type="text"
              placeholder={user?.user_metadata?.role === 'player' ? t('profile.frequencyPlayerPlaceholder') : t('profile.frequencyCoachPlaceholder')}
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
          title={sectionData.index !== undefined ? t('profile.editVideo') : t('profile.addVideo')}
          onSave={(data) => saveSection('videoHighlights', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('profile.videoTitle')}
              value={sectionData.item?.title || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, title: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder={t('profile.videoUrl')}
              value={sectionData.item?.url || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, url: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <textarea
              placeholder={t('profile.description')}
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
          title={sectionData.index !== undefined ? t('profile.editAchievement') : t('profile.addAchievement')}
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
              placeholder={t('profile.achievementTitlePlaceholder')}
              value={sectionData.item?.title || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, title: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder={t('profile.eventName')}
              value={sectionData.item?.event || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, event: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder={t('profile.year')}
              value={sectionData.item?.year || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                setSectionData({ ...sectionData, item: { ...sectionData.item, year: value } })
              }}
              maxLength="4"
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div>
              <label className="block text-sm font-medium mb-2">{t('profile.achievementPhotoOptional')}</label>
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
                    {sectionData.achievementFile ? sectionData.achievementFile.name : t('profile.uploadAchievementPhoto')}
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
          title={sectionData.index !== undefined ? t('profile.editTeam') : t('profile.addTeam')}
          onSave={(data) => saveSection('teams', data)}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('profile.teamName')}
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t('profile.startYear')}
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
                placeholder={t('profile.endYearPresent')}
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
          title={sectionData.index !== undefined ? t('profile.editCertification') : t('profile.addCertification')}
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
              placeholder={t('profile.certificationName')}
              value={sectionData.item?.name || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, name: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder={t('profile.issuingOrganization')}
              value={sectionData.item?.issuer || ''}
              onChange={(e) => setSectionData({ ...sectionData, item: { ...sectionData.item, issuer: e.target.value } })}
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <input
              type="text"
              placeholder={t('profile.year')}
              value={sectionData.item?.year || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                setSectionData({ ...sectionData, item: { ...sectionData.item, year: value } })
              }}
              maxLength="4"
              className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary-bright outline-none"
            />
            <div>
              <label className="block text-sm font-medium mb-2">{t('profile.certificateImageOptional')}</label>
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
                    {sectionData.certificateFile ? sectionData.certificateFile.name : t('profile.uploadCertificateImage')}
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
