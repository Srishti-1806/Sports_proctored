"use client"

import { Pencil, MapPin, Plus, TrendingUp, Calendar, Video, Trophy, Ruler, Weight, Cake, Activity } from 'lucide-react'
import PerformanceBar from './PerformanceBar'
import StatItem from './StatItem'
import MatchCard from './MatchCard'
import TrainingCard from './TrainingCard'
import VideoCard from './VideoCard'
import AchievementBadge from './AchievementBadge'
import TeamCard from './TeamCard'
import EmptyState from './EmptyState'

export default function PlayerProfile({ profile, openEdit, deleteItem, user }) {
  return (
    <>
      {/* About Section */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Pencil className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">About</h2>
          </div>
          <button onClick={() => openEdit('about', { value: profile?.about || '' })} className="p-2 hover:bg-[#EDE8F5] rounded-xl transition-colors">
            <Pencil className="w-5 h-5 text-[#8697C4]" />
          </button>
        </div>
        <p className="text-[#8697C4] leading-relaxed">{profile?.about || 'No bio yet. Add one to tell your story!'}</p>
      </div>

      {/* Athletic Stats */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Athletic Profile</h2>
          </div>
          <button onClick={() => openEdit('athleticStats', { value: profile?.athleticStats || {} })} className="p-2 hover:bg-[#EDE8F5] rounded-xl transition-colors">
            <Pencil className="w-5 h-5 text-[#8697C4]" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem icon={Ruler} label="Height" value={profile?.athleticStats?.height || 'N/A'} />
          <StatItem icon={Weight} label="Weight" value={profile?.athleticStats?.weight || 'N/A'} />
          <StatItem icon={Cake} label="Age" value={profile?.athleticStats?.age || 'N/A'} />
          <StatItem icon={Activity} label="Primary Sport" value={profile?.athleticStats?.primarySport || 'N/A'} />
        </div>
      </div>

      {/* Physical Stats */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Physical Performance</h2>
          </div>
          <button onClick={() => openEdit('physicalStats', { value: profile?.physicalStats || {} })} className="p-2 hover:bg-[#EDE8F5] rounded-xl transition-colors">
            <Pencil className="w-5 h-5 text-[#8697C4]" />
          </button>
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
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Trophy className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Match History</h2>
          </div>
          <button onClick={() => openEdit('matchHistory', { item: { opponent: '', result: 'win', score: '', date: '', performance: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Match</span>
          </button>
        </div>
        {profile?.matchHistory && profile.matchHistory.length > 0 ? (
          <div className="grid gap-4">
            {profile.matchHistory.map((match, index) => (
              <MatchCard key={index} match={match} onEdit={() => openEdit('matchHistory', { item: match, index })} onDelete={() => deleteItem('matchHistory', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No matches recorded yet" />
        )}
      </div>

      {/* Training Schedule */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Calendar className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Training Schedule</h2>
          </div>
          <button onClick={() => openEdit('trainingSchedule', { item: { name: '', duration: '', intensity: 'medium', frequency: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Training</span>
          </button>
        </div>
        {profile?.trainingSchedule && profile.trainingSchedule.length > 0 ? (
          <div className="grid gap-4">
            {profile.trainingSchedule.map((training, index) => (
              <TrainingCard key={index} training={training} onEdit={() => openEdit('trainingSchedule', { item: training, index })} onDelete={() => deleteItem('trainingSchedule', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No training schedule set" />
        )}
      </div>

      {/* Video Highlights */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Video className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Video Highlights</h2>
          </div>
          <button onClick={() => openEdit('videoHighlights', { item: { title: '', url: '', description: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
          </button>
        </div>
        {profile?.videoHighlights && profile.videoHighlights.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.videoHighlights.map((video, index) => (
              <VideoCard key={index} video={video} onEdit={() => openEdit('videoHighlights', { item: video, index })} onDelete={() => deleteItem('videoHighlights', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No video highlights yet" />
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Trophy className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Achievements & Awards</h2>
          </div>
          <button onClick={() => openEdit('achievements', { item: { title: '', year: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        </div>
        {profile?.achievements && profile.achievements.length > 0 ? (
          <div className="space-y-4">
            {profile.achievements.map((achievement, index) => (
              <AchievementBadge key={index} data={achievement} onEdit={() => openEdit('achievements', { item: achievement, index })} onDelete={() => deleteItem('achievements', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No achievements yet" />
        )}
      </div>

      {/* Teams */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Trophy className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Teams</h2>
          </div>
          <button onClick={() => openEdit('teams', { item: { name: '', startYear: '', endYear: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Team</span>
          </button>
        </div>
        {profile?.teams && profile.teams.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.teams.map((team, index) => (
              <TeamCard key={index} team={team} onEdit={() => openEdit('teams', { item: team, index })} onDelete={() => deleteItem('teams', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No teams added yet" />
        )}
      </div>
    </>
  )
}
