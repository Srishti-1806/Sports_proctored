import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function POST(req) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { targetUserId, action } = body

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
    }

    if (targetUserId === user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Get current user's profile
    const { data: currentProfile, error: currentProfileError } = await supabase
      .from('profiles')
      .select('following')
      .eq('id', user.id)
      .single()

    if (currentProfileError) {
      console.error('Error fetching current profile:', currentProfileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Get target user's profile
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('followers')
      .eq('id', targetUserId)
      .single()

    if (targetProfileError) {
      console.error('Error fetching target profile:', targetProfileError)
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    const currentFollowing = currentProfile.following || []
    const targetFollowers = targetProfile.followers || []

    let updatedFollowing = [...currentFollowing]
    let updatedFollowers = [...targetFollowers]

    if (action === 'follow') {
      // Add to following list if not already following
      if (!updatedFollowing.includes(targetUserId)) {
        updatedFollowing.push(targetUserId)
      }
      // Add to target's followers list if not already there
      if (!updatedFollowers.includes(user.id)) {
        updatedFollowers.push(user.id)
      }
    } else if (action === 'unfollow') {
      // Remove from following list
      updatedFollowing = updatedFollowing.filter(id => id !== targetUserId)
      // Remove from target's followers list
      updatedFollowers = updatedFollowers.filter(id => id !== user.id)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update current user's following list
    const { error: updateCurrentError } = await supabase
      .from('profiles')
      .update({ following: updatedFollowing })
      .eq('id', user.id)

    if (updateCurrentError) {
      console.error('Error updating current profile:', updateCurrentError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Update target user's followers list
    const { error: updateTargetError } = await supabase
      .from('profiles')
      .update({ followers: updatedFollowers })
      .eq('id', targetUserId)

    if (updateTargetError) {
      console.error('Error updating target profile:', updateTargetError)
      return NextResponse.json({ error: 'Failed to update target profile' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      action,
      followersCount: updatedFollowers.length,
      followingCount: updatedFollowing.length
    })
  } catch (error) {
    console.error('Follow API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get follow status
export async function GET(req) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const targetUserId = searchParams.get('targetUserId')

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
    }

    // Get current user's following list
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('following, followers')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const following = profile.following || []
    const isFollowing = following.includes(targetUserId)

    return NextResponse.json({ 
      isFollowing,
      followersCount: (profile.followers || []).length,
      followingCount: following.length
    })
  } catch (error) {
    console.error('Follow status API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
