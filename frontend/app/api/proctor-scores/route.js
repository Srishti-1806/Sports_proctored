import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '../../../lib/mongoose'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const limitParam = parseInt(searchParams.get('limit') || '100', 10)

    await connectToDatabase()

    const ScoreSchema = new mongoose.Schema({ name: String, score: Number }, { collection: 'scores' })
    const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema)

    if (name) {
      const latest = await Score.findOne({ name }).sort({ _id: -1 }).lean().exec()
      if (!latest) {
        return NextResponse.json({ found: false, message: 'No score found for this player' }, { status: 200 })
      }
      return NextResponse.json({ found: true, score: { id: latest._id, name: latest.name, score: latest.score } }, { status: 200 })
    }

    // No name provided -> return list of recent scores (capped)
    const cap = Math.min(Math.max(limitParam || 1, 1), 1000)
    const docs = await Score.find({}).sort({ _id: -1 }).limit(cap).lean().exec()
    return NextResponse.json({ count: docs.length, scores: docs.map(d => ({ id: d._id, name: d.name, score: d.score })) }, { status: 200 })
  } catch (err) {
    console.error('Error in proctor-scores API:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
