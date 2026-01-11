"use client"
import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'

import MapProvider from "@/lib/mapbox/provider";
import MapControls from "@/components/map/map-controls";
import { useMap } from "@/context/map-context";

// Enhanced MapNavigator component with comprehensive Mapbox APIs
const MapNavigator = ({ startLocation, destinationLocation }) => {
  const { map, mapReady } = useMap();

  // Function to add markers using proper Mapbox approach, wrapped in useCallback
  const addLocationMarker = useCallback((location, id, color) => {
    if (!map || !mapReady) {
      console.error('Map not ready for marker');
      return;
    }

    // Wait for map to be fully loaded before adding marker
    const addMarkerWhenReady = () => {
      if (!map.loaded()) {
        setTimeout(addMarkerWhenReady, 100);
        return;
      }

      try {
        const coordinates = [location.coordinates.longitude, location.coordinates.latitude];

        if (!coordinates[0] || !coordinates[1] || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
          console.error('Invalid coordinates for marker:', coordinates);
          return;
        }

        // Ensure custom markers object exists on the map instance
        if (!map._customMarkers) {
          map._customMarkers = {};
        }

        // Remove existing marker with the same ID to prevent duplicates
        if (map._customMarkers[id]) {
          map._customMarkers[id].remove();
        }

        // Create and add the new marker
        const marker = new mapboxgl.Marker({
          color: color,
          scale: 1.1,
        })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 10px; font-family: sans-serif;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">${location.name}</h3>
            <p style="margin: 0; font-size: 14px;">${location.coordinates.latitude.toFixed(5)}, ${location.coordinates.longitude.toFixed(5)}</p>
          </div>
        `))
        .addTo(map);

        // Store reference to the new marker
        map._customMarkers[id] = marker;

      } catch (error) {
        console.error(`Error adding marker with id ${id}:`, error);
      }
    };

    addMarkerWhenReady();
  }, [map, mapReady]);

  // Effect for handling start location changes
  useEffect(() => {
    if (startLocation && map) {
      map.flyTo({
        center: [startLocation.coordinates.longitude, startLocation.coordinates.latitude],
        zoom: 16,
        pitch: 45,
        essential: true,
      });
      addLocationMarker(startLocation, 'start-location-marker', '#10b981'); // Green marker
    }
  }, [startLocation, map, addLocationMarker]);

  // Effect for handling destination location changes
  useEffect(() => {
    if (destinationLocation && map) {
      map.flyTo({
        center: [destinationLocation.coordinates.longitude, destinationLocation.coordinates.latitude],
        zoom: 16,
        pitch: 45,
        essential: true,
      });
      addLocationMarker(destinationLocation, 'destination-location-marker', '#ef4444'); // Red marker
    }
  }, [destinationLocation, map, addLocationMarker]);

  return null;
};

// Enhanced LocationSearchInput with Mapbox Search Box API and Sessions
const LocationSearchInput = ({ 
  value, 
  onChange, 
  placeholder, 
  icon, 
  label,
  onLocationSelect,
  selectedLocation
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const searchTimeout = useRef(null);

  // Generate session token for Search Box API
  useEffect(() => {
    const generateSessionToken = () => {
      return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    setSessionToken(generateSessionToken());
  }, []);

  // Enhanced search using Mapbox Geocoding API with sessions
  const searchLocations = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error('Mapbox token not configured');
      return;
    }

    console.log('Searching for:', query);

    try {
      setLoading(true);
      
      // Use Mapbox Search Box API with sessions for better autocomplete
      const searchBoxResponse = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?` + 
        `q=${encodeURIComponent(query)}` +
        `&access_token=${token}` +
        `&country=IN` +
        `&limit=5` +
        `&types=country,region,postcode,district,place,locality,neighborhood,address,poi` +
        `&session_token=${sessionToken}` +
        `&proximity=77.2090,28.6139` + // Delhi as proximity for better Indian results
        `&language=en`
      );

      let data;
      if (searchBoxResponse.ok) {
        data = await searchBoxResponse.json();
        console.log('Search Box API results:', data);
      } else {
        // Fallback to Geocoding API v5
        console.log('Falling back to Geocoding API v5');
        const geocodingResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `access_token=${token}` +
          `&country=IN` +
          `&limit=5` +
          `&types=place,locality,neighborhood,address,poi` +
          `&proximity=77.2090,28.6139`
        );
        
        if (!geocodingResponse.ok) {
          throw new Error(`Search failed: ${geocodingResponse.status}`);
        }
        
        data = await geocodingResponse.json();
        console.log('Geocoding API results:', data);
      }
      
      if (data.features && data.features.length > 0) {
        console.log('Found suggestions:', data.features);
        setSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        console.log('No suggestions found');
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log('Input changed to:', newValue);
    onChange(newValue);

    if (onLocationSelect) {
      onLocationSelect(null);
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      console.log('Triggering search for:', newValue);
      searchLocations(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setIsSelecting(true);
    
    // Handle both Search Box API v6 and Geocoding API v5 response formats
    let longitude, latitude, placeName;
    
    if (suggestion.geometry && suggestion.geometry.coordinates) {
      // Geocoding API v5 format
      [longitude, latitude] = suggestion.geometry.coordinates;
      placeName = suggestion.place_name;
    } else if (suggestion.center) {
      // Legacy format
      [longitude, latitude] = suggestion.center;
      placeName = suggestion.place_name;
    } else if (suggestion.properties && suggestion.properties.coordinates) {
      // Search Box API v6 format
      longitude = suggestion.properties.coordinates.longitude;
      latitude = suggestion.properties.coordinates.latitude;
      placeName = suggestion.properties.full_address || suggestion.properties.name;
    }

    const locationData = {
      name: placeName,
      coordinates: { longitude, latitude }
    };

    console.log('Location selected in handleSuggestionClick:', locationData);
    console.log('Calling onLocationSelect with:', locationData);
    
    onChange(placeName);
    onLocationSelect(locationData);
    setShowSuggestions(false);
    setSuggestions([]);
    setTimeout(() => setIsSelecting(false), 100);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    if (isSelecting || isHoveringDropdown) return;
    
    setTimeout(() => {
      if (!isSelecting && !isHoveringDropdown) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-black/90 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        {icon}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder}
            className={`w-full bg-gray-50 placeholder-gray-400 text-black py-3 rounded-xl border transition ${
              selectedLocation 
                ? 'border-green-400 focus:ring-2 focus:ring-green-400 focus:outline-none pl-4 pr-12' 
                : 'border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 px-4'
            }`}
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {selectedLocation && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <div 
                className="w-3 h-3 bg-green-500 rounded-full" 
                title="Location selected from search"
              ></div>
            </div>
          )}
          {loading && (
            <div className={`absolute top-1/2 transform -translate-y-1/2 ${selectedLocation ? 'right-16' : 'right-3'}`}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            </div>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <div 
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto z-50"
              onMouseEnter={() => setIsHoveringDropdown(true)}
              onMouseLeave={() => setIsHoveringDropdown(false)}
            >
              {suggestions.map((suggestion, index) => {
                // Handle both API formats for display
                const displayText = suggestion.text || suggestion.properties?.name || suggestion.place_name;
                const displayAddress = suggestion.place_name || suggestion.properties?.full_address || suggestion.properties?.place_formatted;
                
                return (
                  <div
                    key={suggestion.id || suggestion.properties?.mapbox_id || index}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(suggestion);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(suggestion);
                    }}
                  >
                    <div className="font-medium text-black">{displayText}</div>
                    <div className="text-sm text-gray-600">{displayAddress}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RouteFinder = () => {
  const router = useRouter()
  const mapContainerRef = useRef(null)
  const [start, setStart] = useState('')
  const [destination, setDestination] = useState('')
  const [startLocation, setStartLocation] = useState(null)
  const [destinationLocation, setDestinationLocation] = useState(null)
  const [preference, setPreference] = useState('safest')
  const [filters, setFilters] = useState([])

  // Debug logging for location state changes
  useEffect(() => {
    console.log('Start location state changed:', startLocation);
  }, [startLocation]);

  useEffect(() => {
    console.log('Destination location state changed:', destinationLocation);
  }, [destinationLocation]);

  const toggleFilter = (key) => {
    setFilters((prev) => {
      if (prev.includes(key)) return prev.filter((p) => p !== key)
      return [...prev, key]
    })
  }

  const handleFind = () => {
    router.push('/find-route');
  }

  return (
    <main className="h-dvh w-dvw flex">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="absolute inset-0 h-full w-full"
      />

      <MapProvider
        mapContainerRef={mapContainerRef}
        initialViewState={{
          longitude: 77.037,
          latitude: 28.6100,
          zoom: 17.5,
          pitch: 45,
          bearing: 25,
        }}
      >
        <MapControls />
        <MapNavigator 
          startLocation={startLocation}
          destinationLocation={destinationLocation}
        />
      </MapProvider>

      <section className="absolute md:h-[80dvh] h-auto md:w-[30dvw] w-full md:top-25 top-6 left-1/2 md:left-25 -translate-x-1/2 md:translate-x-0 z-10 rounded-2xl md:shadow-3xl shadow-lg bg-white overflow-auto text-black">
        <div className="p-4 md:p-5 flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-semibold flex items-center gap-3 text-black">
            <lord-icon
              src="https://cdn.lordicon.com/syjuljru.json"
              trigger="hover"
              colors="primary:#000000"
              style={{ width: "2rem", height: "2rem" }}
            />
            Route Finder
          </h1>
        </div>

        <form className="p-3 md:p-4 flex flex-col gap-4 md:gap-5" onSubmit={(e) => e.preventDefault()}>

          <div className="flex flex-col gap-4">
            <LocationSearchInput
              value={start}
              onChange={setStart}
              placeholder="Enter start location"
              label="START POINT"
              icon={
                <lord-icon
                  src="https://cdn.lordicon.com/innuazqa.json"
                  trigger="hover"
                  colors="primary:#000"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              }
              onLocationSelect={setStartLocation}
              selectedLocation={startLocation}
            />

            <LocationSearchInput
              value={destination}
              onChange={setDestination}
              placeholder="Enter destination"
              label="DESTINATION"
              icon={
                <lord-icon
                  src="https://cdn.lordicon.com/sbevrnsf.json"
                  trigger="hover"
                  colors="primary:#000000"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              }
              onLocationSelect={setDestinationLocation}
              selectedLocation={destinationLocation}
            />
          </div>


          <div>
            <button
              type="button"
              onClick={handleFind}
              disabled={!start.trim() || !destination.trim()}
              className="w-[70%] mx-auto bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <lord-icon
                src="https://cdn.lordicon.com/zhtsepgu.json"
                trigger="hover"
                colors="primary:#ffffff"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
              {preference === 'safest' && 'Find Safest Route'}
              {preference === 'quickest' && 'Find Quickest Route'}
              {preference === 'balanced' && 'Find Balanced Route'}
            </button>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            <h3 className="text-lg font-medium text-black">Route preferences</h3>
            <p className="text-sm text-gray-600 mb-3">Choose one</p>
            <div className="flex gap-2 p-1 rounded-lg">
              {['safest','balanced','quickest'].map((opt) => {
                const label = opt === 'safest' ? 'Safest' : opt === 'balanced' ? 'Balanced' : 'Quickest'
                const selected = preference === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPreference(opt)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selected ? 'bg-green-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            <h3 className="text-lg font-medium text-black">Safety filters</h3>
            <p className="text-sm text-gray-600 mb-3">Select any that apply</p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'wellLit', label: 'Well-lit areas' },
                { key: 'goodInfra', label: 'Good pathways' },
                { key: 'lowCrime', label: 'Low crime areas' }
              ].map((f) => {
                const active = filters.includes(f.key)
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => toggleFilter(f.key)}
                    aria-pressed={active}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${active ? 'bg-green-600 text-white shadow' : 'bg-transparent text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          </div>

        </form>
      </section>
    </main>
  )
}

export default RouteFinder
