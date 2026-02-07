import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { StreamChat } from 'stream-chat'

export async function GET(req) {
  try {
    console.log('Stream token API called')
    
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, profile_picture, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Initialize Stream Chat server client
    const apiKey = process.env.STREAM_API_KEY
    const apiSecret = process.env.STREAM_API_SECRET

    console.log('Stream API Key present:', !!apiKey)
    console.log('Stream API Secret present:', !!apiSecret)

    if (!apiKey || !apiSecret) {
      console.error('Stream API credentials not configured')
      return NextResponse.json({ error: 'Chat service not configured' }, { status: 500 })
    }

    console.log('Initializing Stream Chat server client...')
    const serverClient = StreamChat.getInstance(apiKey, apiSecret)

    // Create or update user in Stream
    console.log('Upserting user in Stream:', user.id)
    await serverClient.upsertUser({
      id: user.id,
      name: profile.full_name || 'User',
      image: profile.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}`,
    })

    // Generate token
    console.log('Generating token for user:', user.id)
    const token = serverClient.createToken(user.id)

    console.log('Token generated successfully')
    return NextResponse.json({
      token,
      apiKey,
      userId: user.id,
      userName: profile.full_name,
    })
  } catch (error) {
    console.error('Error generating Stream token:', error)
    return NextResponse.json({ 
      error: 'Failed to generate chat token',
      details: error.message 
    }, { status: 500 })
  }
}
