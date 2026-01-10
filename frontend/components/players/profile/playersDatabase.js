import { 
  Zap,
  Dumbbell,
  Activity,
  Target,
  BarChart3,
  Shield,
  Trophy,
  Medal,
  Star,
  Award
} from 'lucide-react'

export const playersDatabase = {
  '1': {
    id: '1',
    name: 'Alex Rivera',
    sport: 'Basketball',
    position: 'Point Guard',
    location: 'Mumbai, Maharashtra',
    age: 22,
    height: "6'2\"",
    weight: '185 lbs',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
    bio: 'Dedicated basketball player with a passion for excellence. Currently training to reach professional level. Focused on improving court vision and defensive capabilities. Training with elite coaches and consistently improving performance metrics.',
    assessmentScores: {
      overall: 87.5,
      breakdown: primary-deep to-primary-bright' },
        { name: 'Mental Toughness', score: 86, icon: Shield, color: 'from-amber-500 to-yellow-400' },
      ],
      lastAssessment: 'Dec 15, 2024',
      nextAssessment: 'Jan 15, 2025',
      improvement: '+5.2%'
    },
    coachRecommendations: [
      {
        coach: { name: 'Michael Thompson', title: 'Elite Performance Coach', avatar: 'MT' },
        recommendation: 'Alex shows exceptional court vision and leadership qualities. His dedication to improvement is remarkable. With focused training on defensive positioning, he has the potential to compete at the professional level.',
        date: 'Dec 20, 2024',
        skills: ['Leadership', 'Court Vision', 'Work Ethic']
      },
      {
        coach: { name: 'Sarah Chen', title: 'Strength & Conditioning Specialist', avatar: 'SC' },
        recommendation: 'Incredible athlete with outstanding work ethic. His speed and agility scores are elite-level. Continuing to build core strength will enhance his overall game significantly.',
        date: 'Dec 10, 2024',
        skills: ['Speed', 'Agility', 'Dedication']
      }
    ],
    achievements: [
      { title: 'MVP - State Championship', year: '2024', icon: Trophy },
      { title: 'All-Conference First Team', year: '2024', icon: Medal },
      { title: 'Top 50 Prospect - West', year: '2024', icon: Star },
      { title: '1000+ Career Points', year: '2023', icon: Target }
    ],
    stats: [
      { label: 'Games Played', value: '156' },
      { label: 'Points/Game', value: '23.4' },
      { label: 'Assists/Game', value: '7.8' },
      { label: 'Training Hours', value: '2,400+' }
    ],
    trainingHistory: [
      { date: 'Dec 28', type: 'Speed Training', duration: '2h 15m', intensity: 'High' },
      { date: 'Dec 27', type: 'Skill Development', duration: '3h', intensity: 'Medium' },
      { date: 'Dec 26', type: 'Strength Training', duration: '1h 45m', intensity: 'High' },
      { date: 'Dec 25', type: 'Rest Day', duration: '-', intensity: 'Recovery' },
      { date: 'Dec 24', type: 'Game Simulation', duration: '2h 30m', intensity: 'High' }
    ],
    performanceStats: {
      currentRank: 127,
      trainingStreak: 23,
      weeklyHours: 18.5
    }
  },
  '2': {
    id: '2',
    name: 'Priya Deshmukh',
    sport: 'Badminton',
    position: 'Singles',
    location: 'Bangalore, Karnataka',
    age: 19,
    height: "5'6\"",
    weight: '130 lbs',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'Elite badminton player with exceptional footwork and strategic gameplay. State champion with national ambitions. Specialized in singles play with aggressive net game and powerful smashes.',
    assessmentScores: {
      overall: 91.2,
      breakdown: primary-deep to-primary-bright' },
        { name: 'Mental Toughness', score: 90, icon: Shield, color: 'from-amber-500 to-yellow-400' },
      ],
      lastAssessment: 'Dec 18, 2024',
      nextAssessment: 'Jan 18, 2025',
      improvement: '+8.1%'
    },
    coachRecommendations: [
      {
        coach: { name: 'Priya Sharma', title: 'Badminton Champion & Coach', avatar: 'PS' },
        recommendation: 'Outstanding footwork and court coverage. Her aggressive net play is exceptional. With continued focus on endurance training, she has strong potential for national team selection.',
        date: 'Dec 22, 2024',
        skills: ['Footwork', 'Net Play', 'Strategy']
      }
    ],
    achievements: [
      { title: 'State Singles Champion', year: '2024', icon: Trophy },
      { title: 'National U-21 Bronze', year: '2024', icon: Medal },
      { title: 'Junior Player of the Year', year: '2023', icon: Star },
      { title: 'Regional Champion', year: '2023', icon: Award }
    ],
    stats: [
      { label: 'Matches Played', value: '203' },
      { label: 'Win Rate', value: '78%' },
      { label: 'Smash Speed', value: '320 km/h' },
      { label: 'Training Hours', value: '3,200+' }
    ],
    trainingHistory: [
      { date: 'Dec 28', type: 'Court Drills', duration: '3h', intensity: 'High' },
      { date: 'Dec 27', type: 'Footwork Training', duration: '2h 30m', intensity: 'High' },
      { date: 'Dec 26', type: 'Match Play', duration: '2h', intensity: 'Medium' },
      { date: 'Dec 25', type: 'Recovery', duration: '1h', intensity: 'Recovery' },
      { date: 'Dec 24', type: 'Strength & Conditioning', duration: '2h', intensity: 'High' }
    ],
    performanceStats: {
      currentRank: 89,
      trainingStreak: 31,
      weeklyHours: 22.3
    }
  },
  '3': {
    id: '3',
    name: 'Rohan Mehta',
    sport: 'Football',
    position: 'Striker',
    location: 'Delhi, NCR',
    age: 24,
    height: "5'11\"",
    weight: '170 lbs',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bio: 'Dynamic striker with exceptional goal-scoring ability. Former youth academy player with professional aspirations. Known for pace, positioning, and clinical finishing in the box.',
    assessmentScores: {
      overall: 85.8,
      breakdown: primary-deep to-primary-bright' },
        { name: 'Mental Toughness', score: 85, icon: Shield, color: 'from-amber-500 to-yellow-400' },
      ],
      lastAssessment: 'Dec 12, 2024',
      nextAssessment: 'Jan 12, 2025',
      improvement: '+6.3%'
    },
    coachRecommendations: [
      {
        coach: { name: 'Arjun Mehta', title: 'Football Tactical Analyst', avatar: 'AM' },
        recommendation: 'Excellent positioning and finishing ability. His off-the-ball movement is exceptional. With improved link-up play and physicality, he can compete at the professional level.',
        date: 'Dec 19, 2024',
        skills: ['Finishing', 'Positioning', 'Pace']
      }
    ],
    achievements: [
      { title: 'Top Scorer - Regional League', year: '2024', icon: Trophy },
      { title: 'Golden Boot Winner', year: '2024', icon: Medal },
      { title: 'Youth Academy Graduate', year: '2023', icon: Award },
      { title: '50+ Career Goals', year: '2023', icon: Target }
    ],
    stats: [
      { label: 'Matches Played', value: '187' },
      { label: 'Goals', value: '67' },
      { label: 'Assists', value: '23' },
      { label: 'Training Hours', value: '2,800+' }
    ],
    trainingHistory: [
      { date: 'Dec 28', type: 'Finishing Practice', duration: '2h', intensity: 'High' },
      { date: 'Dec 27', type: 'Tactical Training', duration: '2h 30m', intensity: 'Medium' },
      { date: 'Dec 26', type: 'Strength Training', duration: '1h 45m', intensity: 'High' },
      { date: 'Dec 25', type: 'Rest Day', duration: '-', intensity: 'Recovery' },
      { date: 'Dec 24', type: 'Match Play', duration: '90m', intensity: 'High' }
    ],
    performanceStats: {
      currentRank: 156,
      trainingStreak: 19,
      weeklyHours: 17.2
    }
  },
  '4': {
    id: '4',
    name: 'Ananya Iyer',
    sport: 'Athletics',
    position: '100m Sprint',
    location: 'Hyderabad, Telangana',
    age: 21,
    height: "5'7\"",
    weight: '125 lbs',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'Elite sprinter with explosive speed and perfect technique. National medalist with Olympic aspirations. Focused on improving starting blocks and race strategy for international competitions.',
    assessmentScores: {
      overall: 89.4,
      breakdown: [
        { name: 'Speed & Agility', score: 96, icon: Zap, color: 'from-blue-500 to-cyan-400' },
        { name: 'Strength', score: 86, icon: Dumbbell, color: 'from-red-500 to-orange-400' },
        { name: 'Endurance', score: 85, icon: Activity, color: 'from-green-500 to-emerald-400' },
        { name: 'Technique', score: 92, icon: Target, color: 'from-purple-500 to-pink-400' },
        { name: 'Game IQ', score: 88, icon: BarChart3, color: 'from-[#3D52A0] to-[#7091E6]' },
        { name: 'Mental Toughness', score: 89, icon: Shield, color: 'from-amber-500 to-yellow-400' },
      ],
      lastAssessment: 'Dec 20, 2024',
      nextAssessment: 'Jan 20, 2025',
      improvement: '+7.5%'
    },
    coachRecommendations: [
      {
        coach: { name: 'Ananya Reddy', title: 'Athletics & Sprinting Coach', avatar: 'AR' },
        recommendation: 'World-class explosive speed with excellent technique. Her starting blocks work is exceptional. With continued strength training and race strategy refinement, she has international medal potential.',
        date: 'Dec 23, 2024',
        skills: ['Explosive Speed', 'Technique', 'Race Strategy']
      }
    ],
    achievements: [
      { title: 'National 100m Gold', year: '2024', icon: Trophy },
      { title: 'State Record Holder', year: '2024', icon: Medal },
      { title: 'Asian Games Qualifier', year: '2024', icon: Star },
      { title: 'Sub-12 Second 100m', year: '2023', icon: Target }
    ],
    stats: [
      { label: 'Races Completed', value: '142' },
      { label: 'Personal Best', value: '11.84s' },
      { label: 'Win Rate', value: '72%' },
      { label: 'Training Hours', value: '3,000+' }
    ],
    trainingHistory: [
      { date: 'Dec 28', type: 'Sprint Training', duration: '2h 30m', intensity: 'High' },
      { date: 'Dec 27', type: 'Block Starts', duration: '2h', intensity: 'High' },
      { date: 'Dec 26', type: 'Strength Training', duration: '2h', intensity: 'High' },
      { date: 'Dec 25', type: 'Active Recovery', duration: '1h', intensity: 'Recovery' },
      { date: 'Dec 24', type: 'Speed Endurance', duration: '2h 15m', intensity: 'High' }
    ],
    performanceStats: {
      currentRank: 73,
      trainingStreak: 27,
      weeklyHours: 20.8
    }
  },
  '5': {
    id: '5',
    name: 'Kabir Singh',
    sport: 'Tennis',
    position: 'Singles',
    location: 'Pune, Maharashtra',
    age: 20,
    height: "6'0\"",
    weight: '165 lbs',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Promising tennis player with powerful serves and strong baseline game. Junior circuit veteran with professional circuit ambitions. Known for mental toughness and clutch performances in tight matches.',
    assessmentScores: {
      overall: 88.1,
      breakdown: primary-deep to-primary-bright' },
        { name: 'Mental Toughness', score: 88, icon: Shield, color: 'from-amber-500 to-yellow-400' },
      ],
      lastAssessment: 'Dec 16, 2024',
      nextAssessment: 'Jan 16, 2025',
      improvement: '+6.8%'
    },
    coachRecommendations: [
      {
        coach: { name: 'Vikram Singh', title: 'Tennis Performance Coach', avatar: 'VS' },
        recommendation: 'Excellent serve and powerful groundstrokes. His mental game during crucial points is impressive. With improved net play and tactical variety, he has strong potential for ATP circuit success.',
        date: 'Dec 21, 2024',
        skills: ['Serve', 'Mental Game', 'Baseline Play']
      }
    ],
    achievements: [
      { title: 'ITF Junior Champion', year: '2024', icon: Trophy },
      { title: 'National U-21 Finalist', year: '2024', icon: Medal },
      { title: 'Top 10 Junior Ranking', year: '2023', icon: Star },
      { title: 'State Champion', year: '2023', icon: Award }
    ],
    stats: [
      { label: 'Matches Played', value: '178' },
      { label: 'Win Rate', value: '69%' },
      { label: 'Ace Count', value: '450+' },
      { label: 'Training Hours', value: '2,600+' }
    ],
    trainingHistory: [
      { date: 'Dec 28', type: 'Serve Practice', duration: '2h', intensity: 'High' },
      { date: 'Dec 27', type: 'Match Play', duration: '3h', intensity: 'High' },
      { date: 'Dec 26', type: 'Fitness Training', duration: '2h', intensity: 'Medium' },
      { date: 'Dec 25', type: 'Rest Day', duration: '-', intensity: 'Recovery' },
      { date: 'Dec 24', type: 'Tactical Training', duration: '2h 30m', intensity: 'Medium' }
    ],
    performanceStats: {
      currentRank: 142,
      trainingStreak: 21,
      weeklyHours: 19.5
    }
  },
  '6': {
    id: '6',
    name: 'Diya Patel',
    sport: 'Swimming',
    position: 'Freestyle',
    location: 'Chennai, Tamil Nadu',
    age: 18,
    height: "5'5\"",
    weight: '120 lbs',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    bio: 'Young swimming prodigy with exceptional freestyle technique. Multiple national records holder with international competition experience. Focused on Olympic qualification and breaking Asian records.',
    assessmentScores: {
      overall: 90.3,
      breakdown: primary-deep to-primary-bright' },
        { name: 'Mental Toughness', score: 88, icon: Shield, color: 'from-amber-500 to-yellow-400' },
      ],
      lastAssessment: 'Dec 22, 2024',
      nextAssessment: 'Jan 22, 2025',
      improvement: '+9.2%'
    },
    coachRecommendations: [
      {
        coach: { name: 'Meera Patel', title: 'Swimming Elite Coach', avatar: 'MP' },
        recommendation: 'Exceptional freestyle technique with powerful underwater kicks. Her race pace management is remarkable for her age. With continued training, she has strong potential for Olympic qualification.',
        date: 'Dec 24, 2024',
        skills: ['Freestyle', 'Underwater Kicks', 'Race Pace']
      }
    ],
    achievements: [
      { title: 'National 100m Free Gold', year: '2024', icon: Trophy },
      { title: 'National Record Holder', year: '2024', icon: Medal },
      { title: 'Youth Olympic Qualifier', year: '2024', icon: Star },
      { title: 'Triple Gold - Nationals', year: '2023', icon: Award }
    ],
    stats: [
      { label: 'Races Completed', value: '165' },
      { label: '100m Free PB', value: '55.23s' },
      { label: 'Win Rate', value: '81%' },
      { label: 'Training Hours', value: '3,400+' }
    ],
    trainingHistory: [
      { date: 'Dec 28', type: 'Endurance Swimming', duration: '3h', intensity: 'High' },
      { date: 'Dec 27', type: 'Sprint Training', duration: '2h 30m', intensity: 'High' },
      { date: 'Dec 26', type: 'Technique Work', duration: '2h', intensity: 'Medium' },
      { date: 'Dec 25', type: 'Recovery Swim', duration: '1h', intensity: 'Recovery' },
      { date: 'Dec 24', type: 'Race Pace Training', duration: '2h 30m', intensity: 'High' }
    ],
    performanceStats: {
      currentRank: 68,
      trainingStreak: 34,
      weeklyHours: 23.7
    }
  }
}

export const getPlayerData = (id) => {
  return playersDatabase[id] || playersDatabase['1']
}
