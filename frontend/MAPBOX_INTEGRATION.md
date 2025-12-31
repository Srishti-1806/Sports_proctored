# Mapbox GL JS Integration

This project integrates Mapbox GL JS v3 into Next.js following the official Mapbox documentation patterns.

## 🗺️ Features Implemented

- ✅ Mapbox GL JS v3 with React hooks pattern
- ✅ Geocoding search box with marker placement
- ✅ Navigation controls (zoom, rotate, pitch)
- ✅ Browser support detection
- ✅ Standard Mapbox style
- ✅ Environment variable configuration
- ✅ Proper cleanup on component unmount
- ✅ TypeScript/JSX support

## 📦 Installation

The required packages are already installed:

```bash
npm install mapbox-gl @mapbox/search-js-react
```

## 🔑 Configuration

1. Get your Mapbox access token from [https://account.mapbox.com](https://account.mapbox.com)

2. Add it to `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

**Note:** The token is already configured in your `.env.local` file.

## 🚀 Usage

### Basic Map Component

```jsx
import MapboxMap from '@/components/MapboxMap';

function MyPage() {
  return (
    <div style={{ height: '100vh' }}>
      <MapboxMap
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialCenter={[-74.5, 40]}
        initialZoom={9}
      />
    </div>
  );
}
```

### Available Pages

1. **Basic Map Demo** - `/map`
   - Simple map with search functionality
   - Navigation controls
   - Marker placement

2. **Interactive Examples** - `/map-examples`
   - Multiple map configurations
   - Different center points and zoom levels
   - Feature documentation

3. **Stadium Map** - Component for showing venue locations
   - Custom markers
   - Popups with venue information
   - Click handling for venue selection

## 📁 File Structure

```
frontend/
├── components/
│   ├── MapboxMap.jsx          # Main reusable map component
│   └── stadiums/
│       └── StadiumMap.jsx     # Venue-specific map component
├── app/
│   ├── map/
│   │   └── page.jsx           # Basic map demo page
│   └── map-examples/
│       └── page.jsx           # Interactive examples page
└── .env.local                 # Environment variables (Mapbox token)
```

## 🎯 Component Props

### MapboxMap Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accessToken` | string | required | Your Mapbox access token |
| `initialCenter` | [number, number] | `[-74.5, 40]` | Initial map center [lng, lat] |
| `initialZoom` | number | `9` | Initial zoom level |

### StadiumMap Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accessToken` | string | required | Your Mapbox access token |
| `venues` | array | required | Array of venue objects |
| `selectedVenue` | object | null | Currently selected venue |
| `onVenueSelect` | function | null | Callback when venue is clicked |

## 🔧 Key Implementation Details

### React Pattern (Following Mapbox Docs)

```jsx
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function MapComponent({ accessToken }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    if (!mapboxgl.supported()) {
      alert('Your browser does not support Mapbox GL');
      return;
    }

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-74.5, 40],
      zoom: 9
    });

    // Add controls
    mapInstanceRef.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [accessToken]);

  return <div ref={mapContainerRef} style={{ height: '100%' }} />;
}
```

### SearchBox Integration

```jsx
import { SearchBox } from '@mapbox/search-js-react';

<SearchBox
  accessToken={accessToken}
  map={mapInstanceRef.current}
  mapboxgl={mapboxgl}
  value={inputValue}
  onChange={(d) => setInputValue(d)}
  marker
/>
```

## 🌐 Map Styles

Current style: `mapbox://styles/mapbox/standard`

Other available styles:
- `mapbox://styles/mapbox/streets-v12`
- `mapbox://styles/mapbox/outdoors-v12`
- `mapbox://styles/mapbox/light-v11`
- `mapbox://styles/mapbox/dark-v11`
- `mapbox://styles/mapbox/satellite-v9`
- `mapbox://styles/mapbox/satellite-streets-v12`

## 📚 Documentation References

- [Mapbox GL JS Guides](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Simple Map Example](https://docs.mapbox.com/mapbox-gl-js/example/simple-map/)
- [SearchBox React Guide](https://docs.mapbox.com/mapbox-search-js/guides/search/react/)
- [API Reference](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Key Concepts](https://docs.mapbox.com/mapbox-gl-js/guides/#key-concepts)

## 🎨 Styling

The map components use Tailwind CSS for styling. The Mapbox GL CSS is imported directly in the components:

```jsx
import 'mapbox-gl/dist/mapbox-gl.css';
```

## 🔍 Browser Support

The implementation includes browser support detection:

```jsx
if (!mapboxgl.supported()) {
  alert('Your browser does not support Mapbox GL');
  return;
}
```

Supported browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari 9+ (iOS 9+)

## 🚦 Development

Start the development server:

```bash
cd frontend
npm run dev
```

Visit:
- Basic map: [http://localhost:3000/map](http://localhost:3000/map)
- Examples: [http://localhost:3000/map-examples](http://localhost:3000/map-examples)

## 📝 Notes

1. **Client-Side Only**: Mapbox GL JS requires browser APIs (WebGL, window), so components use `'use client'` directive in Next.js.

2. **Environment Variables**: Must use `NEXT_PUBLIC_` prefix for client-side environment variables in Next.js.

3. **Cleanup**: Always call `map.remove()` in the cleanup function to prevent memory leaks.

4. **Coordinates**: Mapbox uses [longitude, latitude] order (not [lat, lng]).

5. **Access Token**: Never commit access tokens to version control. Use environment variables.

## 🎯 Next Steps

To extend the integration:

1. Add custom markers with icons
2. Implement clustering for multiple markers
3. Add drawing/editing tools
4. Integrate real-time data layers
5. Add 3D buildings and terrain
6. Implement route planning with directions API

## 🆘 Troubleshooting

### Map not displaying
- Ensure access token is set in `.env.local`
- Check browser console for errors
- Verify container has a fixed height

### SearchBox not working
- Confirm `@mapbox/search-js-react` is installed
- Ensure map instance is loaded before passing to SearchBox
- Check that `mapboxgl` prop is passed correctly

### Performance issues
- Limit the number of markers
- Use clustering for large datasets
- Consider simplifying geometries
