"use client"

import { Pencil, MapPin, Plus, TrendingUp, Calendar, Video, Trophy, Award, Activity, CalendarDays, Target, Users2 } from 'lucide-react'
import PerformanceBar from './PerformanceBar'
import StatItem from './StatItem'
import TrainingCard from './TrainingCard'
import VideoCard from './VideoCard'
import AchievementBadge from './AchievementBadge'
import TeamCard from './TeamCard'
import CertCard from './CertCard'
import EmptyState from './EmptyState'

export default function CoachProfile({ profile, openEdit, deleteItem, user }) {
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
            <h2 className="text-2xl font-bold text-[#3D52A0]">Coaching Profile</h2>
          </div>
          <button onClick={() => openEdit('athleticStats', { value: profile?.athleticStats || {} })} className="p-2 hover:bg-[#EDE8F5] rounded-xl transition-colors">
            <Pencil className="w-5 h-5 text-[#8697C4]" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem icon={Activity} label="Primary Sport" value={profile?.athleticStats?.primarySport || 'N/A'} />
          <StatItem icon={CalendarDays} label="Experience" value={profile?.athleticStats?.age || 'N/A'} />
          <StatItem icon={Target} label="Specialty" value={profile?.athleticStats?.height || 'N/A'} />
          <StatItem icon={Users2} label="Coaching Level" value={profile?.athleticStats?.weight || 'N/A'} />
        </div>
      </div>

      {/* Physical Stats */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Coaching Effectiveness</h2>
          </div>
          <button onClick={() => openEdit('physicalStats', { value: profile?.physicalStats || {} })} className="p-2 hover:bg-[#EDE8F5] rounded-xl transition-colors">
            <Pencil className="w-5 h-5 text-[#8697C4]" />
          </button>
        </div>
        <div className="space-y-4">
          <PerformanceBar label="Leadership" value={profile?.physicalStats?.speed || 0} color="from-blue-400 to-cyan-500" />
          <PerformanceBar label="Communication" value={profile?.physicalStats?.strength || 0} color="from-red-400 to-orange-500" />
          <PerformanceBar label="Strategy" value={profile?.physicalStats?.endurance || 0} color="from-green-400 to-emerald-500" />
          <PerformanceBar label="Motivation" value={profile?.physicalStats?.agility || 0} color="from-purple-400 to-pink-500" />
          <PerformanceBar label="Technical Knowledge" value={profile?.physicalStats?.flexibility || 0} color="from-amber-400 to-yellow-500" />
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Award className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Certifications</h2>
          </div>
          <button onClick={() => openEdit('certifications', { item: { name: '', issuer: '', year: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>
        {profile?.certifications && profile.certifications.length > 0 ? (
          <div className="space-y-4">
            {profile.certifications.map((cert, index) => (
              <CertCard key={index} data={cert} onDelete={() => deleteItem('certifications', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No certifications added yet" />
        )}
      </div>

      {/* Training Schedule */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Calendar className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Training Programs</h2>
          </div>
          <button onClick={() => openEdit('trainingSchedule', { item: { name: '', duration: '', intensity: 'medium', frequency: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Program</span>
          </button>
        </div>
        {profile?.trainingSchedule && profile.trainingSchedule.length > 0 ? (
          <div className="grid gap-4">
            {profile.trainingSchedule.map((training, index) => (
              <TrainingCard key={index} training={training} onEdit={() => openEdit('trainingSchedule', { item: training, index })} onDelete={() => deleteItem('trainingSchedule', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No training programs set" />
        )}
      </div>

      {/* Video Highlights */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Video className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Coaching Highlights</h2>
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
            <h2 className="text-2xl font-bold text-[#3D52A0]">Coaching Achievements</h2>
          </div>
          <button onClick={() => openEdit('achievements', { item: { title: '', year: '' } })} className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#3D52A0] to-[#7091E6] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        </div>
        {profile?.achievements && profile.achievements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.achievements.map((achievement, index) => (
              <AchievementBadge key={index} achievement={achievement} onEdit={() => openEdit('achievements', { item: achievement, index })} onDelete={() => deleteItem('achievements', index)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No achievements yet" />
        )}
      </div>

      {/* Teams (Coaching History) */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EDE8F5]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-[#7091E6]/20 to-[#3D52A0]/10 rounded-xl">
              <Trophy className="w-5 h-5 text-[#3D52A0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3D52A0]">Coaching History</h2>
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
          <EmptyState message="No coaching history added yet" />
        )}
      </div>
    </>
  )
}
