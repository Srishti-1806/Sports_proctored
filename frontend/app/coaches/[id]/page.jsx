'use client'

import { useState, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin, 
  Mail, 
  Phone,
  Star,
  Award,
  Users,
  Calendar,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  BookOpen,
  Trophy,
  Target,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  Medal,
  TrendingUp,
  Activity
} from 'lucide-react'

// Mock data - in real app, this would come from API based on id
const coachesDatabase = {
  '1': {
    id: '1',
    name: 'Rajesh Kumar',
    title: 'Cricket Performance Coach',
    sport: 'Cricket',
    location: 'Mumbai, Maharashtra',
    experience: '12+ years',
    rating: 4.9,
    reviews: 324,
    athletes: 450,
    successRate: '96%',
    price: '₹2,500-4,000/session',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    verified: true,
    bio: 'Former Indian national cricket team strength coach with over 12 years of experience. Specialized in batting technique, mental conditioning, and youth development. Helped 100+ players reach state and national levels.',
    specializations: ['Batting Technique', 'Mental Conditioning', 'Youth Development', 'Fitness Training', 'Match Strategy', 'Injury Prevention'],
    certifications: [
      {
        title: 'BCCI Level 3 Coach',
        issuer: 'Board of Control for Cricket in India',
        year: '2018',
        verified: true
      },
      {
        title: 'Sports Psychology Certification',
        issuer: 'National Institute of Sports',
        year: '2019',
        verified: true
      },
      {
        title: 'Strength & Conditioning Specialist',
        issuer: 'Indian Association of Sports Sciences',
        year: '2017',
        verified: true
      }
    ],
    achievements: [
      {
        title: 'State Championship Winner',
        year: '2023',
        description: 'Coached Maharashtra U-19 team to Cooch Behar Trophy victory'
      },
      {
        title: 'Best Coach Award',
        year: '2022',
        description: 'Maharashtra Cricket Association Coach of the Year'
      },
      {
        title: 'National Camp Coach',
        year: '2021',
        description: 'Selected as coach for BCCI U-16 National Camp'
      }
    ],
    reviewsList: [
      {
        id: 1,
        name: 'Aditya Verma',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Outstanding coach! My batting technique improved drastically in just 3 months.',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        name: 'Priya Deshmukh',
        rating: 5,
        date: '1 month ago',
        comment: 'Best investment in my cricket career. His focus on mental conditioning helped me perform consistently.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      }
    ],
    stats: [
      { label: 'Success Rate', value: '96%', IconComponent: TrendingUp },
      { label: 'Total Athletes', value: '450+', IconComponent: Users },
      { label: 'Experience', value: '12 Years', IconComponent: Award },
      { label: 'Sessions', value: '3,200+', IconComponent: Activity }
    ]
  },
  '2': {
    id: '2',
    name: 'Priya Sharma',
    title: 'Badminton Champion & Coach',
    sport: 'Badminton',
    location: 'Bangalore, Karnataka',
    experience: '8+ years',
    rating: 4.8,
    reviews: 198,
    athletes: 280,
    successRate: '94%',
    price: '₹2,000-3,500/session',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    verified: true,
    bio: 'Former national badminton player with 8+ years of coaching experience. Specialized in singles strategy, footwork, and competition preparation. Trained multiple state-level champions.',
    specializations: ['Singles Strategy', 'Footwork', 'Competition Prep', 'Smash Technique', 'Mental Toughness', 'Youth Training'],
    certifications: [
      {
        title: 'BAI Certified Coach',
        issuer: 'Badminton Association of India',
        year: '2019',
        verified: true
      },
      {
        title: 'Sports Performance Specialist',
        issuer: 'National Sports Academy',
        year: '2020',
        verified: true
      }
    ],
    achievements: [
      {
        title: 'National Championships Bronze',
        year: '2022',
        description: 'Student won bronze medal at National Junior Championships'
      },
      {
        title: 'State Coach of the Year',
        year: '2023',
        description: 'Karnataka Badminton Association Recognition'
      }
    ],
    reviewsList: [
      {
        id: 1,
        name: 'Sneha Reddy',
        rating: 5,
        date: '1 week ago',
        comment: 'Amazing coach! My footwork and court coverage improved tremendously under her guidance.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        name: 'Karthik M',
        rating: 4,
        date: '3 weeks ago',
        comment: 'Great technical knowledge and very patient. Really helped me with my singles game.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
      }
    ],
    stats: [
      { label: 'Success Rate', value: '94%', IconComponent: TrendingUp },
      { label: 'Total Athletes', value: '280+', IconComponent: Users },
      { label: 'Experience', value: '8 Years', IconComponent: Award },
      { label: 'Sessions', value: '1,800+', IconComponent: Activity }
    ]
  },
  '3': {
    id: '3',
    name: 'Arjun Mehta',
    title: 'Football Tactical Analyst',
    sport: 'Football',
    location: 'Delhi, NCR',
    experience: '15+ years',
    rating: 4.9,
    reviews: 412,
    athletes: 620,
    successRate: '97%',
    price: '₹3,000-5,000/session',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    verified: true,
    bio: 'UEFA licensed coach with 15+ years of experience. Specialized in tactical analysis, set pieces, and team strategy. Worked with ISL teams and developed numerous professional players.',
    specializations: ['Tactical Analysis', 'Set Pieces', 'Team Strategy', 'Formation Design', 'Video Analysis', 'Position Training'],
    certifications: [
      {
        title: 'UEFA B License',
        issuer: 'Union of European Football Associations',
        year: '2017',
        verified: true
      },
      {
        title: 'AIFF Pro License',
        issuer: 'All India Football Federation',
        year: '2018',
        verified: true
      },
      {
        title: 'Sports Analytics Certificate',
        issuer: 'MIT Sports Lab',
        year: '2020',
        verified: true
      }
    ],
    achievements: [
      {
        title: 'I-League Champions',
        year: '2022',
        description: 'Assistant coach for championship-winning team'
      },
      {
        title: 'Best Tactical Coach',
        year: '2023',
        description: 'AIFF Grassroots Football Awards'
      }
    ],
    reviewsList: [
      {
        id: 1,
        name: 'Rohit Singh',
        rating: 5,
        date: '2 days ago',
        comment: 'His tactical understanding is exceptional. Completely changed how I read the game.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        name: 'Deepak Kumar',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Best football coach in Delhi! Video analysis sessions are incredibly detailed.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      }
    ],
    stats: [
      { label: 'Success Rate', value: '97%', IconComponent: TrendingUp },
      { label: 'Total Athletes', value: '620+', IconComponent: Users },
      { label: 'Experience', value: '15 Years', IconComponent: Award },
      { label: 'Sessions', value: '4,500+', IconComponent: Activity }
    ]
  },
  '4': {
    id: '4',
    name: 'Ananya Reddy',
    title: 'Athletics & Sprinting Coach',
    sport: 'Athletics',
    location: 'Hyderabad, Telangana',
    experience: '10+ years',
    rating: 4.7,
    reviews: 156,
    athletes: 340,
    successRate: '93%',
    price: '₹2,200-3,800/session',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    verified: true,
    bio: 'Former national sprint athlete with 10+ years of coaching experience. Specialized in sprint technique, strength training, and race strategy. Coached several national medalists.',
    specializations: ['Sprint Technique', 'Strength Training', 'Race Strategy', 'Starting Blocks', 'Biomechanics', 'Competition Prep'],
    certifications: [
      {
        title: 'AFI Level 2 Coach',
        issuer: 'Athletics Federation of India',
        year: '2018',
        verified: true
      },
      {
        title: 'NSCA Certified',
        issuer: 'National Strength and Conditioning Association',
        year: '2019',
        verified: true
      }
    ],
    achievements: [
      {
        title: 'National Gold Medalist',
        year: '2023',
        description: 'Student won gold in 100m at National Junior Athletics'
      },
      {
        title: 'Best Sprint Coach',
        year: '2022',
        description: 'Telangana Athletics Association Award'
      }
    ],
    reviewsList: [
      {
        id: 1,
        name: 'Vishnu Prasad',
        rating: 5,
        date: '5 days ago',
        comment: 'Cut 0.3 seconds off my 100m time in just 2 months! Her technique coaching is world-class.',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        name: 'Lakshmi Iyer',
        rating: 4,
        date: '2 weeks ago',
        comment: 'Great strength training program. Very knowledgeable about biomechanics.',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop'
      }
    ],
    stats: [
      { label: 'Success Rate', value: '93%', IconComponent: TrendingUp },
      { label: 'Total Athletes', value: '340+', IconComponent: Users },
      { label: 'Experience', value: '10 Years', IconComponent: Award },
      { label: 'Sessions', value: '2,400+', IconComponent: Activity }
    ]
  },
  '5': {
    id: '5',
    name: 'Vikram Singh',
    title: 'Tennis Performance Coach',
    sport: 'Tennis',
    location: 'Pune, Maharashtra',
    experience: '18+ years',
    rating: 4.9,
    reviews: 267,
    athletes: 380,
    successRate: '95%',
    price: '₹2,800-4,500/session',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    verified: true,
    bio: 'ITF certified coach with 18+ years of experience. Specialized in serve mechanics, match psychology, and junior development. Trained multiple national and international players.',
    specializations: ['Serve Mechanics', 'Match Psychology', 'Junior Development', 'Volley Technique', 'Tournament Prep', 'Fitness Training'],
    certifications: [
      {
        title: 'ITF Level 3 Coach',
        issuer: 'International Tennis Federation',
        year: '2016',
        verified: true
      },
      {
        title: 'AITA Master Coach',
        issuer: 'All India Tennis Association',
        year: '2017',
        verified: true
      },
      {
        title: 'Sports Psychology Diploma',
        issuer: 'NSNIS Patiala',
        year: '2019',
        verified: true
      }
    ],
    achievements: [
      {
        title: 'ITF Junior Champion',
        year: '2023',
        description: 'Student won ITF Junior Circuit tournament'
      },
      {
        title: 'National Coach Award',
        year: '2022',
        description: 'AITA Excellence in Coaching Award'
      }
    ],
    reviewsList: [
      {
        id: 1,
        name: 'Aarav Kapoor',
        rating: 5,
        date: '1 week ago',
        comment: 'Transformed my serve completely. His technical knowledge is outstanding!',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        name: 'Sia Malhotra',
        rating: 5,
        date: '3 weeks ago',
        comment: 'Excellent with junior players. Very patient and encouraging.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
      }
    ],
    stats: [
      { label: 'Success Rate', value: '95%', IconComponent: TrendingUp },
      { label: 'Total Athletes', value: '380+', IconComponent: Users },
      { label: 'Experience', value: '18 Years', IconComponent: Award },
      { label: 'Sessions', value: '3,800+', IconComponent: Activity }
    ]
  },
  '6': {
    id: '6',
    name: 'Meera Patel',
    title: 'Swimming Elite Coach',
    sport: 'Swimming',
    location: 'Chennai, Tamil Nadu',
    experience: '11+ years',
    rating: 4.8,
    reviews: 203,
    athletes: 290,
    successRate: '94%',
    price: '₹2,400-3,600/session',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    verified: true,
    bio: 'Former state swimming champion with 11+ years of coaching experience. Specialized in freestyle, endurance training, and competition preparation. Developed multiple national-level swimmers.',
    specializations: ['Freestyle', 'Endurance Training', 'Competition Prep', 'Butterfly Stroke', 'Breathing Technique', 'Race Pace'],
    certifications: [
      {
        title: 'ASCA Level 4 Coach',
        issuer: 'American Swimming Coaches Association',
        year: '2018',
        verified: true
      },
      {
        title: 'Swimming Federation Certified',
        issuer: 'Swimming Federation of India',
        year: '2017',
        verified: true
      }
    ],
    achievements: [
      {
        title: 'National Championships',
        year: '2023',
        description: 'Coached team to 3 gold medals at nationals'
      },
      {
        title: 'Best Coach Award',
        year: '2022',
        description: 'Tamil Nadu Swimming Association'
      }
    ],
    reviewsList: [
      {
        id: 1,
        name: 'Arjun Nair',
        rating: 5,
        date: '4 days ago',
        comment: 'My freestyle technique improved dramatically. She has an eye for detail!',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        name: 'Divya Krishnan',
        rating: 4,
        date: '1 month ago',
        comment: 'Great endurance training program. Very supportive and motivating coach.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
      }
    ],
    stats: [
      { label: 'Success Rate', value: '94%', IconComponent: TrendingUp },
      { label: 'Total Athletes', value: '290+', IconComponent: Users },
      { label: 'Experience', value: '11 Years', IconComponent: Award },
      { label: 'Sessions', value: '2,600+', IconComponent: Activity }
    ]
  }
}

const getCoachData = (id) => {
  return coachesDatabase[id] || coachesDatabase['1']
}

export default function CoachDetailPage({ params }) {
  const unwrappedParams = use(params)
  const [activeTab, setActiveTab] = useState('about')
  const [isFollowing, setIsFollowing] = useState(false)
  
  const coach = getCoachData(unwrappedParams.id)

  return (
    <div className="min-h-screen bg-[#fafbff] pt-24 pb-12">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link href="/coaches">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#8697C4] hover:text-[#3D52A0] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to coaches
          </motion.button>
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 border border-[#EDE8F5] mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img 
                  src={coach.image} 
                  alt={coach.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {coach.verified && (
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-linear-to-br from-[#3D52A0] to-[#7091E6] rounded-full flex items-center justify-center">
                  <Medal className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div>
                  <h1 className="font-display text-4xl font-bold text-[#1a1a2e] mb-2">
                    {coach.name}
                  </h1>
                  <p className="text-xl text-[#8697C4] mb-3">{coach.title}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-[#1a1a2e]">{coach.rating}</span>
                      <span className="text-[#8697C4]">({coach.reviews} reviews)</span>
                    </div>
                    <span className="text-[#8697C4]">•</span>
                    <div className="flex items-center gap-1 text-[#8697C4]">
                      <MapPin className="w-4 h-4" />
                      {coach.location}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 lg:mt-0">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-xl border transition-colors ${
                      isFollowing
                        ? 'border-[#7091E6] bg-[#7091E6] text-white'
                        : 'border-[#EDE8F5] hover:border-[#7091E6] text-[#8697C4]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFollowing ? 'fill-white' : ''}`} />
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-[#EDE8F5] hover:border-[#7091E6] text-[#8697C4] transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-2 mb-4">
                {coach.specializations.map((spec, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#EDE8F5] text-[#3D52A0] text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold hover:shadow-lg hover:shadow-[#7091E6]/30 transition-shadow">
                  Book Session
                </button>
                <button className="flex-1 px-6 py-3 rounded-xl border-2 border-[#3D52A0] text-[#3D52A0] font-semibold hover:bg-[#3D52A0] hover:text-white transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {coach.stats.map((stat, idx) => {
            const IconComponent = stat.IconComponent
            return (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-[#EDE8F5]">
              <div className="w-10 h-10 rounded-xl bg-[#EDE8F5] flex items-center justify-center mb-3">
                <IconComponent className="w-5 h-5 text-[#3D52A0]" />
              </div>
              <div className="font-display text-2xl font-bold text-[#1a1a2e] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#8697C4]">{stat.label}</div>
            </div>
          )})}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[32px] border border-[#EDE8F5] overflow-hidden"
        >
          <div className="border-b border-[#EDE8F5]">
            <div className="flex overflow-x-auto">
              {['about', 'certifications', 'achievements', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-[#3D52A0] border-b-2 border-[#3D52A0]'
                      : 'text-[#8697C4] hover:text-[#3D52A0]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-3">About</h3>
                  <p className="text-[#8697C4] leading-relaxed">{coach.bio}</p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-3">Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#7091E6]" />
                      <div>
                        <div className="text-sm text-[#8697C4]">Experience</div>
                        <div className="font-medium text-[#1a1a2e]">{coach.experience}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#7091E6]" />
                      <div>
                        <div className="text-sm text-[#8697C4]">Availability</div>
                        <div className="font-medium text-green-600">{coach.availability}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-[#7091E6]" />
                      <div>
                        <div className="text-sm text-[#8697C4]">Success Rate</div>
                        <div className="font-medium text-[#1a1a2e]">{coach.successRate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-[#7091E6]" />
                      <div>
                        <div className="text-sm text-[#8697C4]">Session Price</div>
                        <div className="font-medium text-[#1a1a2e]">{coach.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {coach.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#EDE8F5] hover:border-[#7091E6] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-[#1a1a2e]">{cert.title}</h4>
                          {cert.verified && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-[#8697C4] mb-1">{cert.issuer}</p>
                        <p className="text-xs text-[#ADBBDA]">Issued: {cert.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {coach.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#EDE8F5]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EDE8F5] flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5 text-[#7091E6]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1a1a2e] mb-1">{achievement.title}</h4>
                        <p className="text-sm text-[#8697C4] mb-1">{achievement.description}</p>
                        <p className="text-xs text-[#ADBBDA]">{achievement.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {coach.reviewsList.map((review) => (
                  <div
                    key={review.id}
                    className="pb-6 border-b border-[#EDE8F5] last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      <img 
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#1a1a2e]">{review.name}</h4>
                          <span className="text-sm text-[#8697C4]">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[#8697C4] leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
