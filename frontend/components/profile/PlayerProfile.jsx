"use client"

import { useState } from 'react'
import { Pencil, TrendingUp, Calendar, Video, Trophy, Ruler, Weight, Cake, Activity, ArrowRight, Eye, Plus } from 'lucide-react'
import PerformanceBar from './PerformanceBar'
import StatItem from './StatItem'
import MatchCard from './MatchCard'
import TrainingCard from './TrainingCard'
import VideoCard from './VideoCard'
import AchievementBadge from './AchievementBadge'
import TeamCard from './TeamCard'
import EmptyState from './EmptyState'
import ProctorTestModal from './ProctorTestModal'

export default function PlayerProfile({ profile, openEdit, deleteItem, user, hideProctorTest = false }) {
  const [showTestModal, setShowTestModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Proctored Test Section - Full Width (only show if not hidden and user is viewing their own profile) */}
      {!hideProctorTest && user && (
        <>
          <div className="relative bg-linear-to-br from-[var(--color-primary-deep)] via-[var(--color-primary)] to-[var(--color-primary-bright)] rounded-3xl p-8 shadow-xl overflow-hidden group">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-popover)]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-primary-light)]/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-popover)]/20 backdrop-blur-sm flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  Proctored Skills Test
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-200 text-sm">AI-Powered Assessment</span>
                </div>
              </div>
            </div>
            
            <p className="text-white/90 text-base sm:text-lg mb-2 leading-relaxed">
              Unlock your true potential with our comprehensive assessment
            </p>
            <p className="text-[var(--color-muted-foreground,#ADBBDA)] text-sm sm:text-base">
              Get certified scores • Stand out to coaches • Boost your career • Track your progress
            </p>
          </div>

          <button
            onClick={() => setShowTestModal(true)}
            className="flex items-center gap-3 px-6 sm:px-8 py-4 bg-[var(--color-card)] text-[var(--color-primary-bright)] rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all group/btn whitespace-nowrap border border-[var(--color-border)]"
          >
            <span>Start Test</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Decorative Stats */}
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          <div className="bg-[var(--color-popover)]/10 backdrop-blur-sm rounded-xl p-3 border border-[var(--color-border)]/20">
            <div className="text-2xl font-bold text-white">45min</div>
            <div className="text-xs text-[var(--color-muted-foreground,#8697C4)]">Duration</div>
          </div>
          <div className="bg-[var(--color-popover)]/10 backdrop-blur-sm rounded-xl p-3 border border-[var(--color-border)]/20">
            <div className="text-2xl font-bold text-white">10+</div>
            <div className="text-xs text-[var(--color-muted-foreground,#8697C4)]">Skills Tested</div>
          </div>
          <div className="bg-[var(--color-popover)]/10 backdrop-blur-sm rounded-xl p-3 border border-[var(--color-border)]/20">
            <div className="text-2xl font-bold text-white">Instant</div>
            <div className="text-xs text-[var(--color-muted-foreground,#8697C4)]">Results</div>
          </div>
        </div>
      </div>

      {/* Proctor Test Modal */}
      <ProctorTestModal isOpen={showTestModal} onClose={() => setShowTestModal(false)} />
        </>
      )}
        
      {/* Row 1: About & Athletic Profile */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* About Section */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
          <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-[var(--color-primary-light)]/20 to-[var(--color-primary-deep)]/10 rounded-xl">
                <Pencil className="w-5 h-5 text-[var(--color-primary-bright)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">About</h2> 
            </div>
            {user && (
              <button onClick={() => openEdit('about', { value: profile?.about || '' })} className="p-2 hover:bg-[var(--color-primary-soft)] rounded-xl transition-colors">
                <Pencil className="w-5 h-5 text-[var(--color-muted-foreground)]" />
              </button>
            )}
          </div>
          <p className="text-[var(--color-muted-foreground)] leading-relaxed">{profile?.about || (user ? 'No bio yet. Add one to tell your story!' : "This user hasn't added a bio yet.")}</p>
        </div>

        {/* Athletic Stats */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-[var(--color-primary-light)]/20 to-[var(--color-primary-deep)]/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[var(--color-primary-bright)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">Athletic Profile</h2>
            </div>
            {user && (
              <button onClick={() => openEdit('athleticStats', { value: profile?.athleticStats || {} })} className="p-2 hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)] rounded-xl transition-colors">
                <Pencil className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-6">
            <StatItem icon={Ruler} label="Height" value={profile?.athleticStats?.height || 'N/A'} />
            <StatItem icon={Weight} label="Weight" value={profile?.athleticStats?.weight || 'N/A'} />
            <StatItem icon={Cake} label="Age" value={profile?.athleticStats?.age || 'N/A'} />
            <StatItem icon={Activity} label="Primary Sport" value={profile?.athleticStats?.primarySport || 'N/A'} />
          </div>
        </div>
      </div>

      {/* Row 2: Physical Performance & Match History */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Physical Stats */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[var(--color-primary-bright)]/20 to-[var(--color-primary-bright)]/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary-bright)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">Physical Performance</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('physicalStats', { value: profile?.physicalStats || {} })} className="p-2 hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)] rounded-xl transition-colors">
              <Pencil className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          <PerformanceBar label="Speed" value={profile?.physicalStats?.speed || 0} color="from-blue-400 to-cyan-500" />
          <PerformanceBar label="Strength" value={profile?.physicalStats?.strength || 0} color="from-red-400 to-orange-500" />
          <PerformanceBar label="Endurance" value={profile?.physicalStats?.endurance || 0} color="from-green-400 to-emerald-500" />
          <PerformanceBar label="Agility" value={profile?.physicalStats?.agility || 0} color="from-purple-400 to-pink-500" />
          <PerformanceBar label="Flexibility" value={profile?.physicalStats?.flexibility || 0} color="from-amber-400 to-yellow-500" />
        </div>
        </div>

        {/* Match History */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[var(--color-primary-light)]/20 to-[var(--color-primary-deep)]/10 rounded-xl">
              <Trophy className="w-5 h-5 text-[var(--color-primary-bright)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">Match History</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('matchHistory', { item: {} })} className="p-2 hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)] rounded-xl transition-colors">
              <Plus className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>
          )}
        </div>
        {profile?.matchHistory && profile.matchHistory.length > 0 ? (
          <div className="grid gap-4">
            {profile.matchHistory.map((match, index) => (
              <MatchCard
                key={index}
                data={match}
                onEdit={user ? () => openEdit('matchHistory', { item: match, index }) : undefined}
                onDelete={user ? () => deleteItem('matchHistory', index) : undefined}
                showControls={!!user}
              />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? 'No matches recorded yet' : "This user hasn't added any matches yet."} />
        )}
        </div>
      </div>

      {/* Row 3: Training Schedule & Video Highlights */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Training Schedule */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[var(--color-primary-bright)]/20 to-[var(--color-primary-bright)]/10 rounded-xl">
              <Calendar className="w-5 h-5 text-[var(--color-primary-bright)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">Training Schedule</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('trainingSchedule', { item: {} })} className="p-2 hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)] rounded-xl transition-colors">
              <Plus className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>
          )}
        </div>
        {profile?.trainingSchedule && profile.trainingSchedule.length > 0 ? (
          <div className="grid gap-4">
            {profile.trainingSchedule.map((training, index) => (
              <TrainingCard key={index} training={training} onEdit={user ? () => openEdit('trainingSchedule', { item: training, index }) : undefined} onDelete={user ? () => deleteItem('trainingSchedule', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? 'No training schedule set' : "This user hasn't added a training schedule yet."} />
        )}
        </div>

        {/* Video Highlights */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[var(--color-primary-bright)]/20 to-[var(--color-primary-bright)]/10 rounded-xl">
              <Video className="w-5 h-5 text-[var(--color-primary-bright)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">Video Highlights</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('videoHighlights', { item: {} })} className="p-2 hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)] rounded-xl transition-colors">
              <Plus className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>
          )}
        </div>
        {profile?.videoHighlights && profile.videoHighlights.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.videoHighlights.map((video, index) => (
              <VideoCard key={index} video={video} onEdit={user ? () => openEdit('videoHighlights', { item: video, index }) : undefined} onDelete={user ? () => deleteItem('videoHighlights', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? 'No video highlights yet' : "This user hasn't added any video highlights yet."} />
        )}
        </div>
      </div>

      {/* Row 4: Achievements & Teams */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[var(--color-primary-bright)]/20 to-[var(--color-primary-bright)]/10 rounded-xl">
              <Trophy className="w-5 h-5 text-[var(--color-primary-bright)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">Achievements & Awards</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('achievements', { item: {} })} className="p-2 hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)] rounded-xl transition-colors">
              <Plus className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>
          )}
        </div>
        {profile?.achievements && profile.achievements.length > 0 ? (
          <div className="space-y-4">
            {profile.achievements.map((achievement, index) => (
              <AchievementBadge key={index} data={achievement} onEdit={user ? () => openEdit('achievements', { item: achievement, index }) : undefined} onDelete={user ? () => deleteItem('achievements', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? 'No achievements yet' : "This user hasn't added any achievements yet."} />
        )}
        </div>

        {/* Teams */}
        <div className="bg-[var(--color-card)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[var(--color-primary-bright)]/20 to-[var(--color-primary-bright)]/10 rounded-xl">
              <Trophy className="w-5 h-5 text-[var(--color-primary-bright)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary-bright)]">Teams</h2>
          </div>
          {user && (
            <button onClick={() => openEdit('teams', { item: {} })} className="p-2 hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)] rounded-xl transition-colors">
              <Plus className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>
          )}
        </div>
        {profile?.teams && profile.teams.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.teams.map((team, index) => (
              <TeamCard key={index} team={team} onEdit={user ? () => openEdit('teams', { item: team, index }) : undefined} onDelete={user ? () => deleteItem('teams', index) : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState message={user ? 'No teams added yet' : "This user hasn't added any teams yet."} />
        )}
        </div>
      </div>
    </div>
  )
}
