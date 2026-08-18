import { useParams, Link } from 'react-router-dom'
import { facilities } from '../../data'

export default function FacilityPage() {
  const { id } = useParams()
  const facility = facilities.find(f => f.id === id)

  if (!facility) {
    return (
      <div data-page="Facility_Page" aria-label="Facility Page" className="space-y-6">
        <Link to="/help" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>
        <p className="text-stone-400 text-center py-8">Facility not found.</p>
      </div>
    )
  }

  return (
    <div data-page="Facility_Page" aria-label="Facility Page" className="space-y-6">
      <Link to="/help" className="mb-3 inline-block text-sm text-tov-green hover:underline">&larr; Back</Link>

      <div>
        <h1 className="text-2xl font-bold text-stone-800">{facility.name}</h1>
        <p className="mt-1 text-sm text-stone-500">{facility.type}</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">📍</span>
          <div>
            <p className="text-sm font-medium text-stone-800">{facility.address}</p>
            <p className="text-xs text-stone-400">{facility.province}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xl">📞</span>
          <a href={`tel:${facility.phone}`} className="text-sm font-medium text-tov-green hover:underline">{facility.phone}</a>
        </div>

        {facility.free && (
          <div className="flex items-center gap-3">
            <span className="text-xl">🆓</span>
            <p className="text-sm text-stone-600">Free services available</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-stone-800 mb-3">Services</h3>
        <div className="flex flex-wrap gap-2">
          {facility.services.map((s, i) => (
            <span key={i} className="rounded-full bg-tov-green/10 px-3 py-1 text-xs text-tov-green">{s}</span>
          ))}
        </div>
      </div>

      {facility.lat && facility.lng && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl bg-tov-blue py-3 text-center text-sm font-semibold text-white hover:bg-tov-blue/80"
        >
          Get Directions
        </a>
      )}

      <a href={`tel:${facility.phone}`}
        className="block rounded-2xl bg-tov-green py-3 text-center text-sm font-semibold text-white hover:bg-tov-green/80">
        Call Now
      </a>
    </div>
  )
}
