import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId } = body || {}
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

    const supabase = createClient(supabaseUrl, serviceKey)

    // Delete related rows in known tables
    try {
      await supabase.from('chat_messages').delete().eq('user_id', userId)
    } catch (e) { console.warn('chat_messages delete failed', e) }
    try {
      await supabase.from('chat_conversations').delete().or(`owner_id.eq.${userId},participant_id.eq.${userId}`)
    } catch (e) { console.warn('chat_conversations delete failed', e) }

    // Remove profile row
    try {
      await supabase.from('profiles').delete().eq('id', userId)
    } catch (e) { console.warn('profiles delete failed', e) }

    // Attempt to remove user's files in profile-images bucket
    try {
      const list = await supabase.storage.from('profile-images').list(userId)
      if (list?.data?.length) {
        const paths = list.data.map(f => `${userId}/${f.name}`)
        await supabase.storage.from('profile-images').remove(paths)
      }
    } catch (e) { console.warn('storage cleanup failed', e) }

    // Delete auth user (admin)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) {
      console.error('auth delete error', authError)
      return NextResponse.json({ error: authError.message || 'Failed to delete auth user' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('delete-account error', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
