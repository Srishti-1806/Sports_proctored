import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || ''
  const params = new URLSearchParams(searchParams)
  params.delete('path')

  const rapidapiHost = process.env.RAPIDAPI_HOST
  const rapidapiKey = process.env.RAPIDAPI_KEY

  if (!path) return NextResponse.json({ error: 'Missing path query param' }, { status: 400 })
  if (!rapidapiHost || !rapidapiKey) return NextResponse.json({ error: 'RapidAPI credentials not configured' }, { status: 500 })

  const targetUrl = `https://${rapidapiHost}/v1/${path}${params.toString() ? `?${params.toString()}` : ''}`

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidapiKey,
        'x-rapidapi-host': rapidapiHost
      }
    })

    const text = await res.text()
    try {
      const json = JSON.parse(text)
      return NextResponse.json(json)
    } catch (e) {
      return new Response(text, { status: res.status, headers: { 'content-type': 'text/plain' } })
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req) {
  // simple POST passthrough if needed in future
  return GET(req)
}
