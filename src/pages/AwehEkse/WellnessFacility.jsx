import { useParams } from 'react-router-dom'
import rehabs from '../../data/rehabs.json'
import BackButton from '../../components/ui/BackButton'

export default function WellnessFacility() {
  const { id } = useParams()
  const facility = rehabs.find(f => f.id === id)

  if (!facility) {
    return (
      <div data-page="Wellness_Facility_Page" aria-label="Wellness Facility Page" className="space-y-4">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-stone-800">Facility not found</p>
          <p className="mt-1 text-xs text-stone-400">This centre may have been removed.</p>
        </div>
        <BackButton to="/aweh/wellness" />
      </div>
    )
  }

  const phone = facility.phones[0] || ''
  const isGov = facility.type === 'Government Psychiatric Ward'

  return (
    <div data-page="Wellness_Facility_Page" aria-label="Wellness Facility Page" className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
            style={{ background: facility.accent || '#1F618D' }}
          >
            {facility.initials || facility.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-stone-800">{facility.name}</h1>
            {facility.tagline && <p className="mt-0.5 text-xs text-stone-500">{facility.tagline}</p>}
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
              isGov ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isGov ? 'Gov Ward' : 'Rehab'}
            </span>
          </div>
        </div>
      </div>

      {(facility.city || facility.lodging) && (
        <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
          {facility.city && (
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <p className="text-sm font-medium text-stone-800">{facility.city}</p>
            </div>
          )}
          {facility.lodging && (
            <div className="flex items-center gap-3">
              <span className="text-xl">🏠</span>
              <p className="text-sm text-stone-600">Residential / lodging available</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {phone && (
          <a href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex-1 rounded-xl bg-tov-green py-3 text-center text-sm font-semibold text-white hover:bg-tov-green-light">
            Call {phone}
          </a>
        )}
        {facility.whatsapp && (
          <a href={`https://wa.me/${facility.whatsapp.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-green-500 py-3 text-center text-sm font-semibold text-white hover:bg-green-600">
            WhatsApp
          </a>
        )}
      </div>

      {facility.protocols && facility.protocols.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-stone-800">Treatment &amp; Care Protocols</h2>
          <div className="mt-3 space-y-3">
            {facility.protocols.map((p, i) => (
              <div key={i} className="rounded-xl bg-stone-50 p-3">
                <p className="text-sm font-semibold text-stone-800">{p.practice}</p>
                {p.frequency && (
                  <span className="mt-1 inline-block rounded-full bg-tov-blue/10 px-2 py-0.5 text-[10px] font-bold text-tov-blue">
                    {p.frequency}
                  </span>
                )}
                {p.purpose && <p className="mt-1 text-xs text-stone-500">{p.purpose}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(facility.email || facility.website) && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-stone-800">Contact</h2>
          <div className="mt-3 space-y-2 text-sm">
            {facility.email && (
              <a href={`mailto:${facility.email}`} className="block text-tov-green hover:underline">{facility.email}</a>
            )}
            {facility.website && (
              <a href={facility.website} target="_blank" rel="noopener noreferrer"
                className="block text-tov-blue hover:underline">{facility.website}</a>
            )}
          </div>
        </div>
      )}

      <BackButton to="/aweh/wellness" />
    </div>
  )
}
