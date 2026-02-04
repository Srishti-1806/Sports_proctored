"use client"

import { Pencil, MapPin, TrendingUp, Calendar, Video, Trophy, Award, Activity, CalendarDays, Target, Users2, Plus } from 'lucide-react'
import PerformanceBar from './PerformanceBar'
import StatItem from './StatItem'
import TrainingCard from './TrainingCard'
import VideoCard from './VideoCard'
import AchievementBadge from './AchievementBadge'
import TeamCard from './TeamCard'
import CertCard from './CertCard'
import EmptyState from './EmptyState'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function CoachProfile({ profile, openEdit, deleteItem, user }) {
  const { t } = useLanguage()
  return (
    <>
      {/* About Section */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <Pencil className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.about')}</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('about', { value: profile?.about || '' })} className="p-2 hover:bg-popover rounded-xl transition-colors">
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed">{profile?.about || (user ? t('profile.noBioYet') : t('profile.noCoachBio'))}</p>
      </div>

      {/* Athletic Stats */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.coachingProfile')}</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('athleticStats', { value: profile?.athleticStats || {} })} className="p-2 hover:bg-popover rounded-xl transition-colors">
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem icon={Activity} label={t('profile.primarySport')} value={profile?.athleticStats?.primarySport || 'N/A'} />
          <StatItem icon={CalendarDays} label={t('coaches.experience')} value={profile?.athleticStats?.age || 'N/A'} />
          <StatItem icon={Target} label={t('profile.specialty')} value={profile?.athleticStats?.height || 'N/A'} />
          <StatItem icon={Users2} label={t('profile.coachingLevel')} value={profile?.athleticStats?.weight || 'N/A'} />
        </div>
      </div>

      {/* Physical Stats */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.coachingEffectiveness')}</h2>
          </div>
          {user && (
              <button onClick={() => openEdit('physicalStats', { value: profile?.physicalStats || {} })} className="p-2 hover:bg-popover rounded-xl transition-colors">
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          <PerformanceBar label={t('profile.leadership')} value={profile?.physicalStats?.speed || 0} color="from-blue-400 to-cyan-500" />
          <PerformanceBar label={t('profile.communication')} value={profile?.physicalStats?.strength || 0} color="from-red-400 to-orange-500" />
          <PerformanceBar label={t('profile.strategy')} value={profile?.physicalStats?.endurance || 0} color="from-green-400 to-emerald-500" />
          <PerformanceBar label={t('profile.motivation')} value={profile?.physicalStats?.agility || 0} color="from-purple-400 to-pink-500" />
          <PerformanceBar label={t('profile.technicalKnowledge')} value={profile?.physicalStats?.flexibility || 0} color="from-amber-400 to-yellow-500" />
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <Award className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.certifications')}</h2>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit('certifications', { item: { name: '', issuer: '', year: '' } })} className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                <span>{t('profile.addCertification')}</span>
              </button>
              <button onClick={() => openEdit('certifications', { item: { name: '', issuer: '', year: '' } })} className="md:hidden p-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-lg shadow-md">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {profile?.certifications && profile.certifications.length > 0 ? (
          <div className="space-y-4">
            {profile.certifications.map((cert, index) => (
              <CertCard key={index} data={cert} onDelete={user ? () => deleteItem('certifications', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? t('profile.noCertifications') : t('profile.noCoachCertifications')} />
        )}
      </div>

      {/* Training Schedule */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <Calendar className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.trainingPrograms')}</h2>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit('trainingSchedule', { item: { name: '', duration: '', intensity: 'medium', frequency: '' } })} className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                <span>{t('profile.addProgram')}</span>
              </button>
              <button onClick={() => openEdit('trainingSchedule', { item: { name: '', duration: '', intensity: 'medium', frequency: '' } })} className="md:hidden p-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-lg shadow-md">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {profile?.trainingSchedule && profile.trainingSchedule.length > 0 ? (
          <div className="grid gap-4">
            {profile.trainingSchedule.map((training, index) => (
              <TrainingCard key={index} training={training} onEdit={user ? () => openEdit('trainingSchedule', { item: training, index }) : undefined} onDelete={user ? () => deleteItem('trainingSchedule', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? t('profile.noTrainingPrograms') : t('profile.noCoachTrainingPrograms')} />
        )}
      </div>

      {/* Video Highlights */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <Video className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.coachingHighlights')}</h2>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit('videoHighlights', { item: { title: '', url: '', description: '' } })} className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                <span>{t('profile.addVideo')}</span>
              </button>
              <button onClick={() => openEdit('videoHighlights', { item: { title: '', url: '', description: '' } })} className="md:hidden p-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-lg shadow-md">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {profile?.videoHighlights && profile.videoHighlights.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.videoHighlights.map((video, index) => (
              <VideoCard key={index} video={video} onEdit={user ? () => openEdit('videoHighlights', { item: video, index }) : undefined} onDelete={user ? () => deleteItem('videoHighlights', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? t('profile.noVideoHighlights') : t('profile.noCoachVideoHighlights')} />
        )}
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <Trophy className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.coachingAchievements')}</h2>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit('achievements', { item: { title: '', year: '' } })} className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                <span>{t('profile.addAchievement')}</span>
              </button>
              <button onClick={() => openEdit('achievements', { item: { title: '', year: '' } })} className="md:hidden p-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-lg shadow-md">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {profile?.achievements && profile.achievements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.achievements.map((achievement, index) => (
              <AchievementBadge key={index} data={achievement} onEdit={user ? () => openEdit('achievements', { item: achievement, index }) : undefined} onDelete={user ? () => deleteItem('achievements', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? t('profile.noAchievements') : t('profile.noCoachAchievements')} />
        )}
      </div>

      {/* Teams (Coaching History) */}
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-deep/10 rounded-xl">
              <Trophy className="w-5 h-5 text-primary-bright" />
            </div>
            <h2 className="text-2xl font-bold text-primary-bright">{t('profile.coachingHistory')}</h2>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit('teams', { item: { name: '', startYear: '', endYear: '' } })} className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                <span>{t('profile.addTeam')}</span>
              </button>
              <button onClick={() => openEdit('teams', { item: { name: '', startYear: '', endYear: '' } })} className="md:hidden p-2 bg-linear-to-br from-primary-deep to-primary-bright text-white rounded-lg shadow-md">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {profile?.teams && profile.teams.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.teams.map((team, index) => (
              <TeamCard key={index} team={team} onEdit={user ? () => openEdit('teams', { item: team, index }) : undefined} onDelete={user ? () => deleteItem('teams', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? t('profile.noCoachingHistory') : t('profile.noCoachCoachingHistory')} />
        )}
      </div>
    </>
  )
}
