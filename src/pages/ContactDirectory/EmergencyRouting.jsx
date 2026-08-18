import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRegionFilter from '../../hooks/useRegionFilter'
import { getFacilitiesByCountry } from '../../data'

const regionFacilities = {
  ZW: [
    { name: 'Harare Central Hospital', distance: '2.3 km', lat: -17.8252, lng: 31.0335 },
    { name: 'Parirenyatwa Hospital', distance: '3.1 km', lat: -17.8125, lng: 31.0431 },
    { name: 'Friendship Bench Clinic', distance: '4.5 km', lat: -17.8301, lng: 31.0288 },
  ],
  ZA: [
    { name: 'Chris Hani Baragwanath Hospital', distance: '2.1 km', lat: -26.2572, lng: 27.8619 },
    { name: 'Groote Schuur Hospital', distance: '3.8 km', lat: -33.9409, lng: 18.4643 },
  ],
  BW: [
    { name: 'Princess Marina Hospital', distance: '1.9 km', lat: -24.6282, lng: 25.9084 },
    { name: 'Sbrana Psychiatric Hospital', distance: '45 km', lat: -25.1286, lng: 25.6692 },
    { name: 'Nyangabgwe Referral Hospital', distance: '580 km', lat: -21.1661, lng: 27.5144 },
    { name: 'Sekgoma Memorial Hospital', distance: '280 km', lat: -22.7875, lng: 26.6878 },
  ],
  ZM: [
    { name: 'University Teaching Hospital', distance: '2.5 km', lat: -15.3875, lng: 28.3228 },
  ],
  MW: [
    { name: 'Queen Elizabeth Central Hospital', distance: '3.0 km', lat: -15.7861, lng: 35.0058 },
  ],
}

const fallbackFacilities = regionFacilities.ZW

export default function EmergencyRouting() {
  const { region, current, isFallback } = useRegionFilter()
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  const nearestFacilities = regionFacilities[region] || fallbackFacilities

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setError('Location access denied. You can still browse facilities manually.')
      )
    } else {
      setError('Geolocation not available on this device.')
    }
  }, [])

  return (
    <div data-page="Emergency_Routing_Page" aria-label="Emergency Routing Page" className="space-y-6">
      <div>
        <Link to="/help" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-stone-800">Find Nearest Help</h1>
        <p className="mt-1 text-sm text-stone-500">Nearest facilities based on your device location</p>
      </div>

      {isFallback && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
          Showing Zimbabwe facilities — not yet available in {current.name}.
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">{error}</div>
      )}

      {location && (
        <div className="rounded-2xl bg-tov-green/5 border border-tov-green/20 p-3 text-xs text-tov-green">
          Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      )}

      <div className="space-y-3">
        {nearestFacilities.map((f, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-stone-800">{f.name}</h3>
                <p className="text-sm text-stone-500">{f.distance} away</p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-tov-blue px-3 py-2 text-xs font-medium text-white hover:bg-tov-blue/80"
              >
                Directions
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-stone-400">
        Facility database ships with the app. Updated quarterly.
      </p>
    </div>
  )
}
