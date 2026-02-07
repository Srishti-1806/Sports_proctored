import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { StreamChat } from 'stream-chat'
import crypto from 'crypto'

export async function POST(req) {
  try {
    console.log('Stream channel API called')
    
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    const body = await req.json()
    const { otherUserId } = body

    console.log('Creating channel with user:', otherUserId)

    if (!otherUserId) {
      return NextResponse.json({ error: 'Other user ID required' }, { status: 400 })
    }

    // Get current user's profile
    const { data: currentProfile, error: currentProfileError } = await supabase
      .from('profiles')
      .select('id, full_name, profile_picture, role')
      .eq('id', user.id)
      .single()

    if (currentProfileError) {
      console.error('Error fetching current profile:', currentProfileError)
      return NextResponse.json({ error: 'Failed to fetch current user profile' }, { status: 500 })
    }

    // Get other user's profile
    const { data: otherProfile, error: otherProfileError } = await supabase
      .from('profiles')
      .select('id, full_name, profile_picture, role')
      .eq('id', otherUserId)
      .single()

    if (otherProfileError) {
      console.error('Error fetching other profile:', otherProfileError)
      return NextResponse.json({ error: 'Other user not found' }, { status: 404 })
    }

    // Initialize Stream Chat server client
    const apiKey = process.env.STREAM_API_KEY
    const apiSecret = process.env.STREAM_API_SECRET

    if (!apiKey || !apiSecret) {
      console.error('Stream API credentials not configured')
      return NextResponse.json({ error: 'Chat service not configured' }, { status: 500 })
    }

    console.log('Initializing Stream Chat server client...')
    const serverClient = StreamChat.getInstance(apiKey, apiSecret)

    // Ensure both users exist in Stream
    console.log('Upserting current user in Stream:', user.id)
    await serverClient.upsertUser({
      id: user.id,
      name: currentProfile.full_name || 'User',
      image: currentProfile.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${currentProfile.full_name}`,
    })

    console.log('Upserting other user in Stream:', otherUserId)
    await serverClient.upsertUser({
      id: otherUserId,
      name: otherProfile.full_name || 'User',
      image: otherProfile.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherProfile.full_name}`,
    })

    // Create a unique channel ID (hash the sorted user IDs to keep it under 64 chars)
    const sortedIds = [user.id, otherUserId].sort().join('-')
    const channelId = crypto.createHash('sha256').update(sortedIds).digest('hex').substring(0, 32)

    console.log('Creating channel with ID:', channelId)

    // Create or get the channel
    const channel = serverClient.channel('messaging', channelId, {
      members: [user.id, otherUserId],
      created_by_id: user.id,
    })

    try {
      await channel.create()
      console.log('Channel created successfully:', channelId)
    } catch (createErr) {
      // If the channel already exists, Stream may return an error — ignore that case.
      const msg = String(createErr?.message || '')
      if (/already exists|already created|conflict|409/i.test(msg)) {
        console.log('Channel already exists, proceeding:', channelId)
      } else {
        console.error('Error creating channel:', createErr)
        throw createErr
      }
    }

    return NextResponse.json({
      channelId,
      channelType: 'messaging',
      success: true,
    })
  } catch (error) {
    console.error('Error creating Stream channel:', error)
    return NextResponse.json({ 
      error: 'Failed to create chat channel',
      details: error.message 
    }, { status: 500 })
  }
}
