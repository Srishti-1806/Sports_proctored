'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getThemeColors } from '../../lib/mapbox-utils';

const StadiumMap = ({ accessToken, venues, selectedVenue, onVenueSelect }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [userLocation, setUserLocation] = useState(null);
  // Resolve theme-aware colors once per render so all effects can use them
  const themeColors = (typeof window !== 'undefined' && window.getComputedStyle)
    ? getThemeColors()
    : {
        PRIMARY: 'varprimary',
        SUCCESS: 'varsuccess',
        WARNING: 'varwarning',
        DANGER: 'vardanger',
        INFO: 'varinfo',
        PURPLE: 'varpurple'
      };

  useEffect(() => {
    // Function to get location from IP address
    const getLocationFromIP = async () => {
      try {
        console.log('Attempting to get location from IP address...');
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const coords = [data.longitude, data.latitude];
          console.log('Location from IP:', coords, 'City:', data.city, 'Country:', data.country_name);
          setUserLocation(coords);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error getting location from IP:', error);
        return false;
      }
    };

    // Get user's current location - try high accuracy first, then fallback to low accuracy
    if (navigator.geolocation) {
      // First attempt: Try high accuracy with shorter timeout
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          console.log('GPS location obtained:', coords, 'Accuracy:', position.coords.accuracy, 'meters');
          setUserLocation(coords);
        },
        (error) => {
          console.log('High accuracy GPS failed:', error.message, '- Trying low accuracy...');
          
          // Second attempt: Try with low accuracy (faster, more reliable)
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = [position.coords.longitude, position.coords.latitude];
              console.log('✓ Low accuracy location obtained:', coords, 'Accuracy:', position.coords.accuracy, 'meters');
              setUserLocation(coords);
            },
            async (error) => {
              console.log('Low accuracy GPS also failed:', error.message, '- Trying IP location...');
              // Try to get location from IP address
              const ipLocationSuccess = await getLocationFromIP();
              if (!ipLocationSuccess) {
                console.log('ℹ Using default location (New Delhi)');
                setUserLocation([77.2090, 28.6139]);
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 300000 // Accept cached position up to 5 minutes old
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        }
      );
    } else {
      // No geolocation support, try IP-based location
      console.log('Geolocation not supported, trying IP-based location');
      getLocationFromIP().then((success) => {
        if (!success) {
          console.log('Falling back to default location (New Delhi)');
          setUserLocation([77.2090, 28.6139]);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    // Set Mapbox access token
    mapboxgl.accessToken = accessToken;

    // Check browser support
    if (!mapboxgl.supported()) {
      alert('Your browser does not support Mapbox GL');
      return;
    }

    // Create map instance with 3D view
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: userLocation, // Use user's location
      zoom: 18, // Maximum street-level zoom for precise location
      pitch: 60, // Tilt the map for 3D effect
      bearing: -17.6, // Rotate the map
      antialias: true // Enable for smoother 3D rendering
    });

    // Add error handler for map loading - suppress featureNamespace warnings
    mapInstanceRef.current.on('error', (e) => {
      if (!e.error.message.includes('featureNamespace')) {
        console.warn('Map error:', e.error);
      }
    });

    // Add user location marker with reverse geocoding
    const userMarker = new mapboxgl.Marker({ color: themeColors.PRIMARY, scale: 1.2 })
      .setLngLat(userLocation);

    // Fetch address from coordinates using reverse geocoding
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation[0]},${userLocation[1]}.json?access_token=${accessToken}`)
      .then(response => response.json())
      .then(data => {
        const place = data.features[0];
        const address = place.place_name || 'Current position';
        
        userMarker
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">Your Location</h3>
                <p style="color: varprimary-muted; font-size: 12px; line-height: 1.4;">${address}</p>
              </div>
            `)
          )
          .addTo(mapInstanceRef.current);
      })
      .catch(error => {
        console.error('Error fetching address:', error);
        userMarker
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;"> Your Location</h3>
                <p style="color: varprimary-muted; font-size: 12px;">Current position</p>
              </div>
            `)
          )
          .addTo(mapInstanceRef.current);
      });

    // Add navigation controls
    mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    mapInstanceRef.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [accessToken, userLocation]);

  // Add markers for venues
  useEffect(() => {
    if (!mapInstanceRef.current || !venues) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for each venue
    venues.forEach((venue) => {
      // Venue coordinates are already in [lng, lat] format
      const coordinates = venue.coordinates;
      
      if (!coordinates || coordinates.length !== 2) {
        console.warn('Invalid coordinates for venue:', venue.name);
        return;
      }

      // Create marker with standard Mapbox pin (green for venues, blue for selected)
      const marker = new mapboxgl.Marker({ 
        color: selectedVenue?.id === venue.id ? themeColors.PRIMARY : themeColors.SUCCESS,
        scale: 1.0
      })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${venue.name}</h3>
              <p style="color: varprimary-muted; font-size: 14px;">${venue.type}</p>
              <p style="color: varprimary-muted; font-size: 12px; margin-top: 4px;">${venue.distance} away</p>
              ${venue.sports && venue.sports.length > 0 ? `
                <div style="margin-top: 8px;">
                  <span style="color: varsuccess; font-size: 12px;"> ${venue.sports.join(', ')}</span>
                </div>
              ` : ''}
            </div>
          `)
        )
        .addTo(mapInstanceRef.current);

      // Add click handler to marker element
      marker.getElement().addEventListener('click', () => {
        if (onVenueSelect) {
          onVenueSelect(venue);
        }
      });

      markersRef.current.push(marker);
    });
  }, [venues, selectedVenue, onVenueSelect]);

  // Center map on selected venue
  useEffect(() => {
    if (selectedVenue && mapInstanceRef.current) {
      // Use venue's coordinates directly (already in [lng, lat] format)
      if (selectedVenue.coordinates && selectedVenue.coordinates.length === 2) {
        mapInstanceRef.current.flyTo({
          center: selectedVenue.coordinates,
          zoom: 16,
          essential: true
        });
      }
    }
  }, [selectedVenue]);

  return (
    <>
      <style jsx global>{`
        .mapboxgl-popup-close-button {
          font-size: 28px !important;
          width: 32px !important;
          height: 32px !important;
          padding: 0 !important;
          line-height: 32px !important;
          color: varprimary-muted !important;
        }
        .mapboxgl-popup-close-button:hover {
          background-color: varcard !important;
          color: varforeground !important;
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className="map-container w-full h-full rounded-lg"
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      />
    </>
  );
};

export default StadiumMap;
