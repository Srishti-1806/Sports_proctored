"use client"

import { useState, useEffect } from 'react'
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
  const [latestProctor, setLatestProctor] = useState(null)
  const [loadingProctor, setLoadingProctor] = useState(false)
  const [proctorError, setProctorError] = useState(null)

  useEffect(() => {
    async function fetchLatest() {
      if (!profile || !profile.fullName) return
      setLoadingProctor(true)
      setProctorError(null)
      try {
        const res = await fetch(`/api/proctor-scores?name=${encodeURIComponent(profile.fullName)}`)
        const data = await res.json()
        if (res.ok && data.found) {
          setLatestProctor(data.score)
        } else {
          setLatestProctor(null)
          // If the name-specific lookup didn't find anything, try fetching recent scores
          // and match by name case-insensitively to handle formatting differences.
          try {
            const listRes = await fetch(`/api/proctor-scores?limit=500`)
            const listData = await listRes.json()
            if (listRes.ok && Array.isArray(listData.scores)) {
              const target = String(profile.fullName).toLowerCase().trim()
              const match = listData.scores.find(s => String(s.name || '').toLowerCase().trim() === target)
              if (match) {
                setLatestProctor({ id: match.id, name: match.name, score: match.score })
                return
              }
            }
          } catch (innerErr) {
            console.error('Fallback fetch error', innerErr)
          }
          if (!res.ok) setProctorError(data.error || 'Failed to fetch')
        }
      } catch (err) {
        console.error(err)
        setProctorError('Failed to fetch latest proctor score')
      } finally {
        setLoadingProctor(false)
      }
    }

    fetchLatest()
  }, [profile?.fullName])

  return (
    <div className="space-y-8">
      {/* Proctored Test Section - Full Width (only show if not hidden and user is viewing their own profile) */}
      {!hideProctorTest && user && (
        <>
          <div className="relative bg-card bg-linear-to-br from-primary-bright via-primary-soft to-primary-bright/50 dark:from-primary-deep dark:via-black/20 dark:to-primary-bright rounded-3xl p-8 shadow-xl overflow-hidden group">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-popover/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-light/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center dark:bg-linear-to-br dark:from-primary-bright/20 dark:to-primary-deep/10">
                    <Eye className="w-6 h-6 text-primary-bright" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-1">
                      Proctored Skills Test
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-200 text-sm">AI-Powered Assessment</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground dark:text-white/90 text-base sm:text-lg mb-2 leading-relaxed">
                  Unlock your true potential with our comprehensive assessment
                </p>
                <p className="text-muted-foreground dark:text-white/75 text-sm sm:text-base">
                  Get certified scores • Stand out to coaches • Boost your career • Track your progress
                </p>
              </div>

              {/* Start Test button and stats grouped so button sits above stats */}
              <div className="flex flex-col items-center md:items-end gap-4">
                <div className="mt-2 md:mt-0">
                  <button
                    onClick={() => setShowTestModal(true)}
                    className="flex items-center gap-3 px-6 sm:px-8 py-3 bg-primary-bright/10 text-primary-bright dark:bg-linear-to-br dark:from-primary-deep dark:to-primary-bright dark:text-white rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all group/btn whitespace-nowrap"
                  >
                    <span>Start Test</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="relative mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-popover/10 backdrop-blur-sm rounded-xl p-3 border border-border/20">
                    <div className="text-2xl font-bold text-foreground dark:text-white">10 min</div>
                    <div className="text-xs text-primary-muted dark:text-white/70">Duration</div>
                  </div>
                  <div className="bg-popover/10 backdrop-blur-sm rounded-xl p-3 border border-border/20">
                    <div className="text-2xl font-bold text-foreground dark:text-white">15</div>
                    <div className="text-xs text-primary-muted dark:text-white/70">Skills Tested</div>
                  </div>
                  <div className="bg-popover/10 backdrop-blur-sm rounded-xl p-3 border border-border/20">
                    <div className="text-2xl font-bold text-foreground dark:text-white">Instant</div>
                    <div className="text-xs text-primary-muted dark:text-white/70">Results</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proctor Test Modal */}
            <ProctorTestModal isOpen={showTestModal} onClose={() => setShowTestModal(false)} />
          </div>
        </>
      )}
      {/* Latest Proctor Score Section */}
      <div className="bg-card rounded-3xl p-6 shadow-xl border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Proctor Test Assessment</h3>
        </div>
        {loadingProctor ? (
          <div className="text-sm text-primary-muted">Loading latest result...</div>
        ) : proctorError ? (
          <div className="text-sm text-destructive">{proctorError}</div>
        ) : latestProctor ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center text-white font-bold">
              {latestProctor.score}
            </div>
            <div>
              <div className="text-sm text-primary-muted">Test</div>
              <div className="font-semibold text-foreground">{latestProctor.name}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-primary-muted">No proctor test results found for this player.</div>
        )}
      </div>

          {/* Row 1: About & Athletic Profile */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* About Section */}
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-light/20 to-primary-deep/10 rounded-xl">
                    <Pencil className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">About</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('about', { value: profile?.about || '' })} className="p-2 hover:bg-primary-soft rounded-xl transition-colors">
                    <Pencil className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">{profile?.about || (user ? 'No bio yet. Add one to tell your story!' : "This user hasn't added a bio yet.")}</p>
            </div>

            {/* Athletic Stats */}
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-light/20 to-primary-deep/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">Athletic Profile</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('athleticStats', { value: profile?.athleticStats || {} })} className="p-2 hover:bg-primary-soft dark:hover:bg-popover rounded-xl transition-colors">
                    <Pencil className="w-5 h-5 text-muted-foreground" />
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
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-bright/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">Physical Performance</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('physicalStats', { value: profile?.physicalStats || {} })} className="p-2 hover:bg-primary-soft dark:hover:bg-popover rounded-xl transition-colors">
                    <Pencil className="w-5 h-5 text-muted-foreground" />
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
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-light/20 to-primary-deep/10 rounded-xl">
                    <Trophy className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">Match History</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('matchHistory', { item: {} })} className="p-2 hover:bg-primary-soft dark:hover:bg-popover rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground" />
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
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-bright/10 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">Training Schedule</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('trainingSchedule', { item: {} })} className="p-2 hover:bg-primary-soft dark:hover:bg-popover rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground" />
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
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-bright/10 rounded-xl">
                    <Video className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">Video Highlights</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('videoHighlights', { item: {} })} className="p-2 hover:bg-primary-soft dark:hover:bg-popover rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground" />
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
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-bright/10 rounded-xl">
                    <Trophy className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">Achievements & Awards</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('achievements', { item: {} })} className="p-2 hover:bg-primary-soft dark:hover:bg-popover rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground" />
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
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-primary-bright/20 to-primary-bright/10 rounded-xl">
                    <Trophy className="w-5 h-5 text-primary-bright" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-bright">Teams</h2>
                </div>
                {user && (
                  <button onClick={() => openEdit('teams', { item: {} })} className="p-2 hover:bg-primary-soft dark:hover:bg-popover rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground" />
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
