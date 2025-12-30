-- Supabase Database Schema for ATHLETIX Profile System
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (stores all profile data as JSONB for flexibility)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  about TEXT,
  location TEXT,
  position TEXT,
  athletic_stats JSONB DEFAULT '{"height": "", "weight": "", "age": "", "primarySport": ""}'::jsonb,
  physical_stats JSONB DEFAULT '{"speed": 0, "strength": 0, "endurance": 0, "agility": 0, "flexibility": 0}'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  training_schedule JSONB DEFAULT '[]'::jsonb,
  match_history JSONB DEFAULT '[]'::jsonb,
  video_highlights JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  teams JSONB DEFAULT '[]'::jsonb,
  performance_metrics JSONB DEFAULT '[]'::jsonb,
  diet_plan TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  assessments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proctored Tests Table
CREATE TABLE IF NOT EXISTS proctored_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proctored_tests ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Public can view profiles (for showcasing athletes/coaches)
CREATE POLICY "Public can view profiles"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);

-- Policies for proctored_tests table
-- Users can read their own tests
CREATE POLICY "Users can read own tests"
  ON proctored_tests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own tests
CREATE POLICY "Users can insert own tests"
  ON proctored_tests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_proctored_tests_user_id ON proctored_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_proctored_tests_created_at ON proctored_tests(created_at DESC);

-- Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON proctored_tests TO authenticated;
GRANT SELECT ON profiles TO anon;
