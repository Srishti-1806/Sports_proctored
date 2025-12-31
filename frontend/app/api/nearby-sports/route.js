import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lon = parseFloat(searchParams.get('lon'));
    const radius = parseInt(searchParams.get('radius')) || 20000;

    // Validate inputs
    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: 'Coordinates out of valid range' },
        { status: 400 }
      );
    }

    if (radius < 100 || radius > 50000) {
      return NextResponse.json(
        { error: 'Radius must be between 100 and 50000 meters' },
        { status: 400 }
      );
    }

    // Build Overpass QL query - reduced query size to avoid timeout
    const overpassQuery = `
      [out:json][timeout:30];
      (
        node["leisure"~"stadium|sports_centre|sports_hall|pitch|track|swimming_pool|fitness_centre|golf_course|miniature_golf|fitness_station"](around:${radius},${lat},${lon});
        node["sport"~"cricket|football|soccer|basketball|tennis|volleyball|athletics|badminton|hockey|swimming|golf"](around:${radius},${lat},${lon});
        way["leisure"~"stadium|sports_centre|sports_hall|pitch|track|swimming_pool|fitness_centre|golf_course|miniature_golf|fitness_station"](around:${radius},${lat},${lon});
        way["sport"~"cricket|football|soccer|basketball|tennis|volleyball|athletics|badminton|hockey|swimming|golf"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    // Call Overpass API with retry logic
    const maxRetries = 2;
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt} for Overpass API...`);
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        const response = await fetch(overpassUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(overpassQuery)}`,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 504 || response.status === 429) {
          lastError = new Error(`Overpass API ${response.status === 504 ? 'timeout' : 'rate limit'}: ${response.status}`);
          if (attempt < maxRetries) continue; // Retry
          throw lastError;
        }

        if (!response.ok) {
          throw new Error(`Overpass API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Success - process data
        const facilities = [];
        const seenIds = new Set();

        for (const element of data.elements || []) {
          // Get coordinates
          let latitude, longitude;
          
          if (element.type === 'node') {
            latitude = element.lat;
            longitude = element.lon;
          } else if (element.type === 'way' && element.center) {
            latitude = element.center.lat;
            longitude = element.center.lon;
          } else {
            continue; // Skip if no coordinates
          }

          // Skip duplicates
          const id = `${element.type}-${element.id}`;
          if (seenIds.has(id)) continue;
          seenIds.add(id);

          // Determine facility type
          const tags = element.tags || {};
          let type = 'sports_facility';
          
          if (tags.leisure === 'stadium') type = 'stadium';
          else if (tags.leisure === 'sports_centre') type = 'sports_centre';
          else if (tags.leisure === 'sports_hall') type = 'sports_hall';
          else if (tags.leisure === 'fitness_centre') type = 'gym';
          else if (tags.leisure === 'fitness_station') type = 'fitness_station';
          else if (tags.leisure === 'pitch') type = 'pitch';
          else if (tags.leisure === 'track') type = 'track';
          else if (tags.leisure === 'swimming_pool') type = 'swimming_pool';
          else if (tags.leisure === 'ice_rink') type = 'ice_rink';
          else if (tags.leisure === 'horse_riding') type = 'horse_riding';
          else if (tags.leisure === 'golf_course') type = 'golf_course';
          else if (tags.leisure === 'miniature_golf') type = 'miniature_golf';
          else if (tags.landuse === 'recreation_ground') type = 'recreation_ground';
          else if (tags.amenity === 'school' || tags.amenity === 'college') type = 'school_sports';

          // Get sport type
          const sport = tags.sport || null;

          facilities.push({
            id,
            name: tags.name || tags['name:en'] || null,
            type,
            sport,
            latitude,
            longitude,
            tags: {
              surface: tags.surface,
              access: tags.access,
              capacity: tags.capacity,
            }
          });
        }

        return NextResponse.json({
          count: facilities.length,
          facilities,
        });

      } catch (error) {
        lastError = error;
        if (attempt < maxRetries && (error.message.includes('504') || error.message.includes('429') || error.name === 'AbortError')) {
          continue; // Retry
        }
        throw error; // Give up
      }
    }

    // If we get here, all retries failed
    throw lastError;

  } catch (error) {
    console.error('Overpass API error:', error);

    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch sports facilities' },
      { status: 500 }
    );
  }
}
