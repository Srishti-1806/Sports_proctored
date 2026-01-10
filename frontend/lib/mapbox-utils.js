/**
 * Mapbox Configuration and Utilities
 * Common configurations and helper functions for Mapbox GL JS integration
 */

// Map Styles
export const MAP_STYLES = {
  STANDARD: 'mapbox://styles/mapbox/standard',
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
};

// Common Map Centers
export const MAP_CENTERS = {
  MIAMI: [-80.1918, 25.7617],
  NEW_YORK: [-74.006, 40.7128],
  LOS_ANGELES: [-118.2437, 34.0522],
  CHICAGO: [-87.6298, 41.8781],
  HOUSTON: [-95.3698, 29.7604],
  WORLD: [0, 20],
};

// Zoom Levels
export const ZOOM_LEVELS = {
  WORLD: 2,
  COUNTRY: 4,
  STATE: 6,
  CITY: 10,
  NEIGHBORHOOD: 13,
  STREET: 15,
  BUILDING: 18,
};

// Marker Colors
export const MARKER_COLORS = {
  PRIMARY: 'varprimary',
  SUCCESS: 'varsuccess',
  WARNING: 'varwarning',
  DANGER: 'vardanger',
  INFO: 'varinfo',
  PURPLE: 'varpurple',
};

/**
 * Read theme colors from CSS variables at runtime (client-only).
 * Falls back to MARKER_COLORS when CSS variables are not available.
 */
export function getThemeColors() {
  if (typeof window === 'undefined' || !window.getComputedStyle) {
    return MARKER_COLORS;
  }

  const styles = getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue('--color-primary').trim() || MARKER_COLORS.PRIMARY;
  const success = styles.getPropertyValue('--color-success').trim() || MARKER_COLORS.SUCCESS;
  const warning = styles.getPropertyValue('--color-warning').trim() || MARKER_COLORS.WARNING;
  const danger = styles.getPropertyValue('--color-danger').trim() || MARKER_COLORS.DANGER;
  const info = styles.getPropertyValue('--color-info').trim() || MARKER_COLORS.INFO;
  const purple = styles.getPropertyValue('--color-purple').trim() || MARKER_COLORS.PURPLE;

  return {
    PRIMARY: primary || MARKER_COLORS.PRIMARY,
    SUCCESS: success || MARKER_COLORS.SUCCESS,
    WARNING: warning || MARKER_COLORS.WARNING,
    DANGER: danger || MARKER_COLORS.DANGER,
    INFO: info || MARKER_COLORS.INFO,
    PURPLE: purple || MARKER_COLORS.PURPLE,
  };
}

/**
 * Create a custom marker element
 * @param {Object} options - Marker configuration
 * @param {string} options.color - Marker color (hex)
 * @param {number} options.size - Marker size in pixels
 * @param {string} options.icon - Optional icon/emoji
 * @returns {HTMLDivElement} Marker element
 */
export function createMarkerElement({ color = null, size = 32, icon = null }) {
  const el = document.createElement('div');
  const themeColors = (typeof window !== 'undefined') ? getThemeColors() : MARKER_COLORS;
  const useColor = color || themeColors.PRIMARY;
  el.className = 'custom-marker';
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.backgroundColor = useColor;
  el.style.border = '3px solid white';
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  el.style.cursor = 'pointer';
  el.style.transition = 'all 0.3s';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontSize = `${size * 0.5}px`;

  if (icon) {
    el.textContent = icon;
  }

  // Add hover effect
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.2)';
    el.style.zIndex = '10';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
    el.style.zIndex = '1';
  });

  return el;
}

/**
 * Create a popup HTML content
 * @param {Object} data - Popup data
 * @param {string} data.title - Main title
 * @param {string} data.subtitle - Subtitle text
 * @param {string} data.description - Description text
 * @param {number} data.rating - Rating value (0-5)
 * @param {number} data.reviews - Number of reviews
 * @returns {string} HTML string
 */
export function createPopupContent({ title, subtitle, description, rating, reviews }) {
  return `
    <div style="padding: 12px; max-width: 250px;">
      <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${title}</h3>
      ${subtitle ? `<p style="color: varprimary-muted; font-size: 14px; margin-bottom: 8px;">${subtitle}</p>` : ''}
      ${description ? `<p style="color: varforeground; font-size: 13px; margin-bottom: 8px; line-height: 1.4;">${description}</p>` : ''}
      ${rating ? `
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="color: varwarning;">★</span>
          <span style="font-weight: bold;">${rating}</span>
          ${reviews ? `<span style="color: varprimary-muted; font-size: 12px;">(${reviews} reviews)</span>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Calculate bounds for multiple coordinates
 * @param {Array<[number, number]>} coordinates - Array of [lng, lat] pairs
 * @returns {Array<[[number, number], [number, number]]>} Bounds [[west, south], [east, north]]
 */
export function calculateBounds(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  const lngs = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return [
    [minLng, minLat],
    [maxLng, maxLat]
  ];
}

/**
 * Fit map to bounds with padding
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {Array<[number, number]>} coordinates - Array of coordinates
 * @param {number} padding - Padding in pixels
 */
export function fitMapToBounds(map, coordinates, padding = 50) {
  const bounds = calculateBounds(coordinates);
  if (bounds && map) {
    map.fitBounds(bounds, {
      padding,
      maxZoom: 15,
      duration: 1000
    });
  }
}

/**
 * Format distance for display
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance string
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)}km`;
}

/**
 * Geocode address to coordinates (requires Mapbox Geocoding API)
 * @param {string} address - Address to geocode
 * @param {string} accessToken - Mapbox access token
 * @returns {Promise<[number, number]>} Coordinates [lng, lat]
 */
export async function geocodeAddress(address, accessToken) {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].center;
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

/**
 * Check if browser supports Mapbox GL JS
 * @returns {boolean} True if supported
 */
export function isMapboxSupported() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for WebGL support
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Default map configuration
 */
export const DEFAULT_MAP_CONFIG = {
  style: MAP_STYLES.STANDARD,
  center: MAP_CENTERS.MIAMI,
  zoom: ZOOM_LEVELS.CITY,
  pitch: 0,
  bearing: 0,
  antialias: true,
  attributionControl: true,
};

/**
 * Navigation control options
 */
export const NAVIGATION_CONTROL_OPTIONS = {
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
};

/**
 * Geolocate control options
 */
export const GEOLOCATE_CONTROL_OPTIONS = {
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
  showUserHeading: true,
  showAccuracyCircle: true,
};

export default {
  MAP_STYLES,
  MAP_CENTERS,
  ZOOM_LEVELS,
  MARKER_COLORS,
  createMarkerElement,
  createPopupContent,
  calculateBounds,
  fitMapToBounds,
  formatDistance,
  geocodeAddress,
  isMapboxSupported,
  DEFAULT_MAP_CONFIG,
  NAVIGATION_CONTROL_OPTIONS,
  GEOLOCATE_CONTROL_OPTIONS,
};
