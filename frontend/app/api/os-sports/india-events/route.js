import { NextResponse } from 'next/server'

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers })
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 10)
  const timezone = searchParams.get('timezone') || '5'
  const country = searchParams.get('country') || 'India'

  const rapidapiHost = process.env.RAPIDAPI_HOST
  const rapidapiKey = process.env.RAPIDAPI_KEY
  if (!rapidapiHost || !rapidapiKey) return NextResponse.json({ error: 'RapidAPI credentials not configured' }, { status: 500 })

  const headers = {
    'x-rapidapi-host': rapidapiHost,
    'x-rapidapi-key': rapidapiKey
  }

  try {
    // 1) fetch sports list
    const sportsUrl = `https://${rapidapiHost}/v1/sports`
    const sportsRes = await fetchJson(sportsUrl, headers)
    const sports = Array.isArray(sportsRes.data) ? sportsRes.data : []
    const sportIds = sports.map(s => s.id).filter(Boolean)

    // 2) fetch calendar/categories for each sport to collect category ids
    const categoryIds = new Set()
    const batchSize = 6

    for (let i = 0; i < sportIds.length; i += batchSize) {
      const batch = sportIds.slice(i, i + batchSize)
      const promises = batch.map(async (sport_id) => {
        const url = `https://${rapidapiHost}/v1/calendar/categories?sport_id=${sport_id}&timezone=${timezone}&date=${date}&country=${encodeURIComponent(country)}`
        return fetchJson(url, headers)
      })

      const results = await Promise.all(promises)
      results.forEach((res) => {
        if (!res) return
        let items = []
        if (Array.isArray(res.data)) items = res.data
        else if (Array.isArray(res.categories)) items = res.categories
        else if (Array.isArray(res.response?.items)) items = res.response.items
        else if (Array.isArray(res.results)) items = res.results
        else if (Array.isArray(res)) items = res

        items.forEach((it) => {
          if (!it) return
          const cat = it.category || it
          if (cat?.id) categoryIds.add(cat.id)
        })
      })
    }

    // 3) for each category id, fetch schedule by category for a short upcoming window (next 7 days)
    const days = Number(searchParams.get('days') || 7)
    const dateList = []
    const start = new Date(date)
    for (let d = 0; d < days; d++) {
      const dt = new Date(start)
      dt.setDate(start.getDate() + d)
      const yyyy = dt.getFullYear()
      const mm = String(dt.getMonth() + 1).padStart(2, '0')
      const dd = String(dt.getDate()).padStart(2, '0')
      dateList.push(`${yyyy}-${mm}-${dd}`)
    }

    const aggregated = []
    const categoryArray = Array.from(categoryIds)
    for (let i = 0; i < categoryArray.length; i += batchSize) {
      const batch = categoryArray.slice(i, i + batchSize)
      const promises = []
      for (const catId of batch) {
        for (const dt of dateList) {
          const url = `https://${rapidapiHost}/v1/events/schedule/category?category_id=${catId}&date=${dt}&timezone=${timezone}&country=${encodeURIComponent(country)}`
          promises.push(fetchJson(url, headers))
        }
      }

      const results = await Promise.all(promises)
      results.forEach((res) => {
        if (!res) return
        const items = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])
        items.forEach((ev) => {
          if (!ev) return
          aggregated.push(ev)
        })
      })
    }

    // Keep only events that are in India (by category or teams)
    function isIndianEvent(item) {
      const m = item || {}
      // category country (many responses include tournament or category info)
      const catCountry = m.category?.country?.alpha2 || m.tournament?.category?.country?.alpha2 || m.tournament?.category?.alpha2
      if (catCountry === 'IN') return true
      // team countries
      if (m.homeTeam?.country?.alpha2 === 'IN' || m.awayTeam?.country?.alpha2 === 'IN') return true
      if (m.teama?.country?.alpha2 === 'IN' || m.teamb?.country?.alpha2 === 'IN') return true
      // top-level country field
      if (m.country?.alpha2 === 'IN') return true
      return false
    }

    // dedupe and filter for Indian events
    const seen = new Set()
    const transformed = aggregated.filter(e => {
      const id = e.match_id || e.id || e.event_id
      if (!id) return false
      if (seen.has(id)) return false
      // filter for India
      if (!isIndianEvent(e)) return false
      seen.add(id)
      return true
    }).map((m) => ({
      id: m.match_id || m.id || m.event_id,
      title: m.title || m.name || `${m.homeTeam?.name || m.teama?.name || 'Team A'} vs ${m.awayTeam?.name || m.teamb?.name || 'Team B'}`,
      sport: m.sport || m.category_name || (m.tournament?.category?.sport?.name) || null,
      date: m.date_start || m.date || null,
      time: m.date_start || m.time || null,
      location: m.venue?.name || m.venue?.location || m.location || null,
      raw: m
    }))

    return NextResponse.json({ events: transformed })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
