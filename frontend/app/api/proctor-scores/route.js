import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '../../../lib/mongoose'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    if (!name) {
      return NextResponse.json({ error: 'Missing name query parameter' }, { status: 400 })
    }

    await connectToDatabase()

    const ScoreSchema = new mongoose.Schema({ name: String, score: Number }, { collection: 'scores' })
    const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema)

    const latest = await Score.findOne({ name }).sort({ _id: -1 }).lean().exec()

    if (!latest) {
      return NextResponse.json({ found: false, message: 'No score found for this player' }, { status: 200 })
    }

    return NextResponse.json({ found: true, score: { id: latest._id, name: latest.name, score: latest.score } }, { status: 200 })
  } catch (err) {
    console.error('Error in proctor-scores API:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
