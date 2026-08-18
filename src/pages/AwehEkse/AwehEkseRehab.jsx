import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import rehabs from '../../data/rehab-directory.json'
import taxonomy from '../../data/rehab-taxonomy.json'
import BackButton from '../../components/ui/BackButton'
import useRegionFilter from '../../hooks/useRegionFilter'

const CAT_COLORS = {
  substances: '#C0392B',
  conditioning: '#7D3C98',
  mental_health: '#1F618D',
}

const ACCORDION_COLORS = {
  gallery: '#89CFF0',
  capacity: '#1E8449',
  programmes: '#2FBDB0',
  staff: '#E67E22',
  cost: '#15181D',
  protocols: '#C0392B',
  tags: '#7D3C98',
  contact: '#1F618D',
}

const PROG_COLORS = ['#1F618D', '#1E8449', '#7D3C98', '#E67E22', '#2FBDB0', '#C0392B']

const typeChips = [
  { id: 'all', label: 'All Facilities' },
  { id: 'Rehab Centre', label: 'Rehab Centres' },
  { id: 'Government Psychiatric Ward', label: 'Government Wards' },
]

const BW_EMERGENCY_LINES = [
  { label: 'Botswana Police Emergency', number: '999' },
  { label: 'Emergency Medical Services (Ambulance)', number: '997' },
  { label: 'Medical Rescue Response', number: '992' },
  { label: 'Lifeline Botswana Crisis Line', number: '+267 391 1270', note: '24/7 Suicide Prevention & Crisis Helpline' },
  { label: 'Youth Helpline Botswana', number: '+267 391 2345', note: 'Youth Mental Health & Support' },
  { label: 'Childline Botswana', number: '116', alt: '+267 390 0900', note: 'Toll-Free Child Protection & Youth Counseling' },
]

function findTagName(catId, tagId) {
  const cat = taxonomy.categories.find(c => c.id === catId)
  if (!cat) return tagId
  for (const zone of cat.zones) {
    const item = zone.items.find(i => i.id === tagId)
    if (item) return item.name
  }
  return tagId
}

function tagPillsForCard(rehab) {
  const pills = []
  ;['substances', 'conditioning', 'mental_health'].forEach(cat => {
    ;(rehab.tags[cat] || [])
      .slice(0, 2)
      .forEach(tid => pills.push({ name: findTagName(cat, tid), color: CAT_COLORS[cat] }))
  })
  return pills.slice(0, 3)
}

function totalFilterCount(filters) {
  return (filters.substances || []).length + (filters.conditioning || []).length + (filters.mental_health || []).length
}

const Svg = ({ d, size = 16, strokeWidth = 2.2, filled = false, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {d}
  </svg>
)

const IconCall = s => <Svg size={s} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z" />} />
const IconWhatsApp = s => <Svg size={s} filled d={<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.83 14.06c-.24.68-1.39 1.3-1.92 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.71-4.09-4.85-4.28-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.28.53-.34.71-.34h.51c.16 0 .38-.06.6.46.24.56.8 1.96.87 2.1.07.14.11.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.7-.81.89-1.09.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.35z" />} />
const IconEmail = s => <Svg size={s} d={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></>} />
const IconWeb = s => <Svg size={s} d={<><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>} />
const IconGallery = s => <Svg size={s} d={<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>} />
const IconBed = s => <Svg size={s} d={<><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M2 14h20" /><path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" /></>} />
const IconList = s => <Svg size={s} d={<><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none" /></>} />
const IconStaff = s => <Svg size={s} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />
const IconMoney = s => <Svg size={s} d={<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 6v0M18 18v0" /></>} />
const IconTag = s => <Svg size={s} d={<><path d="M20.59 13.41L11 3.83A2 2 0 0 0 9.59 3.24H4a2 2 0 0 0-2 2v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l6.59-6.59a2 2 0 0 0 0-2.82z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" /></>} />
const IconClipboard = s => <Svg size={s} d={<><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" /><path d="M9 12l2 2 4-4" /></>} />
const IconPhone = s => <Svg size={s} d={<><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>} />
const IconPin = s => <Svg size={s} d={<><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />
const IconBadge = s => <Svg size={s} d={<><circle cx="12" cy="8" r="6" /><path d="M9 14L6 22l6-3 6 3-3-8" /></>} />
const IconPerson = s => <Svg size={s} d={<><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>} />
const IconApp = s => <Svg size={s} d={<><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>} />
const IconSearch = <Svg d={<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>} />
const IconChevron = s => <Svg size={s} strokeWidth={2.4} d={<path d="M6 9l6 6 6-6" />} />
const IconBack = <Svg size={16} strokeWidth={2.4} d={<path d="M15 18l-6-6 6-6" />} />

const socialIcons = {
  facebook: { color: '#1877F2', icon: <Svg size={18} filled d={<path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />} /> },
  twitter: { color: '#15181D', icon: <Svg size={18} filled d={<path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.4 22H1.3l8.1-9.3L1 2h7.1l4.9 6.4L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />} /> },
  instagram: { color: '#E1306C', icon: <Svg size={18} d={<><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></>} /> },
  tiktok: { color: '#15181D', icon: <Svg size={18} filled d={<path d="M16.5 2c.4 2.4 2 4.2 4.5 4.4v3.1c-1.6 0-3.1-.5-4.4-1.4v6.9a6.1 6.1 0 1 1-6.1-6.1c.3 0 .6 0 .9.1v3.2a3 3 0 1 0 2.1 2.9V2h3z" />} /> },
}

function Meta({ icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-stone-500">
      {icon}
      <span className="truncate">{children}</span>
    </div>
  )
}

function Accordion({ title, sub, color, icon, open, onToggle, children }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm ${open ? 'ring-1 ring-stone-100' : ''}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${color}17`, color }}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-stone-800">{title}</span>
          <span className="block truncate text-xs text-stone-400">{sub}</span>
        </span>
        <span className={`text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          {IconChevron()}
        </span>
      </button>
      {open && <div className="border-t border-stone-100 px-4 py-4">{children}</div>}
    </div>
  )
}

function QuickAction({ color, icon, label, href }) {
  const el = href ? (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1.5"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${color}17`, color }}>
        {icon}
      </span>
      <span className="text-[11px] font-medium text-stone-600">{label}</span>
    </a>
  ) : (
    <span className="flex flex-col items-center gap-1.5 opacity-40">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${color}17`, color }}>
        {icon}
      </span>
      <span className="text-[11px] font-medium text-stone-600">{label}</span>
    </span>
  )
  return el
}

function EmptyLine({ children }) {
  return <p className="py-3 text-center text-xs text-stone-400">{children}</p>
}

function FacilityRow({ facility }) {
  return (
    <div className="flex items-start gap-2 border-b border-stone-50 py-2 last:border-0">
      <span className="mt-0.5 w-6 text-right text-xs font-semibold text-tov-blue">{facility.count ?? '—'}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-stone-800">{facility.type || 'Facility'}</p>
        {facility.description && <p className="text-xs text-stone-400">{facility.description}</p>}
      </div>
    </div>
  )
}

function CostRow({ row }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: row.included ? '#1E8449' : '#C0392B' }} />
      <span className="flex-1 text-sm text-stone-700">{row.item}</span>
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
        style={{ background: row.included ? '#1E844917' : '#C0392B17', color: row.included ? '#1E8449' : '#C0392B' }}
      >
        {row.included ? 'Included' : 'Extra'}
      </span>
    </div>
  )
}

function ProtocolRow({ protocol }) {
  return (
    <div className="border-b border-stone-50 py-2.5 last:border-0">
      <p className="text-sm font-semibold text-stone-800">{protocol.practice}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-tov-orange">{protocol.frequency}</p>
      <p className="mt-0.5 text-xs text-stone-500">{protocol.purpose}</p>
    </div>
  )
}

function ContactRow({ icon, color, label, value }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}17`, color }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</p>
        <p className="break-words text-sm text-stone-700">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function AwehEkseRehab() {
  const { region, current, isFallback, filterByRegion } = useRegionFilter()
  const regionRehabs = useMemo(() => filterByRegion(rehabs), [region])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeFilters, setActiveFilters] = useState({ substances: [], conditioning: [], mental_health: [] })
  const [draftFilters, setDraftFilters] = useState({ substances: [], conditioning: [], mental_health: [] })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeRehabId, setActiveRehabId] = useState(null)
  const [openAccs, setOpenAccs] = useState(['capacity', 'cost', 'protocols'])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return regionRehabs.filter(r => {
      if (typeFilter !== 'all' && r.facility_type !== typeFilter) return false
      if (q) {
        const hay = [
          r.name,
          r.location.text,
          r.location.city,
          r.contact.contact_person,
          r.facility_type,
          ...(r.contact.phone || []),
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return ['substances', 'conditioning', 'mental_health'].every(cat => {
        const selected = activeFilters[cat] || []
        if (selected.length === 0) return true
        const rehabTags = r.tags[cat] || []
        return selected.some(id => rehabTags.includes(id))
      })
    })
  }, [query, typeFilter, activeFilters])

  const fCount = totalFilterCount(activeFilters)
  const rehab = rehabs.find(r => r.rehab_id === activeRehabId)

  const toggleFilterSheet = () => {
    if (!sheetOpen) setDraftFilters(JSON.parse(JSON.stringify(activeFilters)))
    setSheetOpen(!sheetOpen)
  }

  const applyFilters = () => {
    setActiveFilters(JSON.parse(JSON.stringify(draftFilters)))
    setSheetOpen(false)
  }

  const toggleAcc = id => {
    setOpenAccs(prev => (prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]))
  }

  const closeProfile = () => setActiveRehabId(null)

  if (rehab) {
    const isGov = rehab.facility_type === 'Government Psychiatric Ward'
    const phone = rehab.contact.phone?.[0] || ''
    const telHref = phone ? `tel:${phone.replace(/[\s-]/g, '')}` : null
    const waDigits = rehab.contact.whatsapp ? rehab.contact.whatsapp.replace(/[^0-9]/g, '') : ''
    const contact = rehab.contact
    const socials = Object.entries(socialIcons)
    const tagged = taxonomy.categories.map(cat => ({
      ...cat,
      items: cat.zones.flatMap(zone =>
        zone.items.filter(item => (rehab.tags[cat.id] || []).includes(item.id))
      ),
    })).filter(cat => cat.items.length > 0)

    return (
      <div data-page="Rehab_Directory_Page" aria-label="Rehab Profile" className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={closeProfile}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800 active:scale-95"
          >
            {IconBack}
          </button>
          <span className="text-sm font-semibold text-stone-500">Directory</span>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
              style={{ background: rehab.accent_color }}
            >
              {rehab.initials}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold leading-tight text-stone-800">{rehab.name}</h1>
              {rehab.tagline && <p className="mt-0.5 text-sm text-stone-500">{rehab.tagline}</p>}
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  isGov ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {isGov ? 'Government Ward' : 'Rehab Centre'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex h-28 items-center justify-center rounded-2xl" style={{ background: rehab.accent_color }}>
            <p className="px-4 text-center text-xs font-medium text-white/80">
              Premises photo coming soon
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <QuickAction color="#1E8449" icon={IconCall(17)} label="Call" href={telHref} />
          <QuickAction color="#25D366" icon={IconWhatsApp(17)} label="WhatsApp" href={waDigits ? `https://wa.me/${waDigits}` : null} />
          <QuickAction color="#1F618D" icon={IconEmail(17)} label="Email" href={contact.email ? `mailto:${contact.email}` : null} />
          <QuickAction color="#7D3C98" icon={IconWeb(17)} label="Website" href={contact.website || null} />
        </div>

        <div className="space-y-3">
          <Accordion id="gallery" title="Photo Gallery" sub={`${rehab.gallery.length} photo${rehab.gallery.length === 1 ? '' : 's'}`} color={ACCORDION_COLORS.gallery} icon={IconGallery()} open={openAccs.includes('gallery')} onToggle={() => toggleAcc('gallery')}>
            {rehab.gallery.length === 0 ? (
              <EmptyLine>No photos uploaded yet</EmptyLine>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {rehab.gallery.map((url, i) => (
                  <img key={i} src={url} alt="" className="aspect-square w-full rounded-xl object-cover" />
                ))}
              </div>
            )}
          </Accordion>

          <Accordion id="capacity" title="Accommodation & Facilities" sub={capacitySummary(rehab)} color={ACCORDION_COLORS.capacity} icon={IconBed()} open={openAccs.includes('capacity')} onToggle={() => toggleAcc('capacity')}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-stone-50 p-3 text-center">
                <p className="text-xl font-bold text-tov-blue">{rehab.accommodation.total_beds ?? '—'}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">Residential Beds</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-3 text-center">
                <p className="text-xl font-bold text-tov-blue">{rehab.facilities.length}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">Facility Types</p>
              </div>
            </div>
            {rehab.facilities.length === 0 ? (
              <EmptyLine>No facilities listed yet</EmptyLine>
            ) : (
              <div className="mt-2">{rehab.facilities.map((f, i) => <FacilityRow key={i} facility={f} />)}</div>
            )}
          </Accordion>

          <Accordion id="programmes" title="Programmes Offered" sub={`${rehab.programmes_offered.length} programme${rehab.programmes_offered.length === 1 ? '' : 's'}`} color={ACCORDION_COLORS.programmes} icon={IconList()} open={openAccs.includes('programmes')} onToggle={() => toggleAcc('programmes')}>
            {rehab.programmes_offered.length === 0 ? (
              <EmptyLine>No programmes listed yet</EmptyLine>
            ) : (
              <div>
                {rehab.programmes_offered.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 border-b border-stone-50 py-2 last:border-0">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: PROG_COLORS[i % PROG_COLORS.length] }} />
                    <span className="text-sm text-stone-700">{p}</span>
                  </div>
                ))}
              </div>
            )}
          </Accordion>

          <Accordion id="staff" title="Staff" sub={`${rehab.staff.length} team member${rehab.staff.length === 1 ? '' : 's'}`} color={ACCORDION_COLORS.staff} icon={IconStaff()} open={openAccs.includes('staff')} onToggle={() => toggleAcc('staff')}>
            {rehab.staff.length === 0 ? (
              <EmptyLine>No staff listed yet</EmptyLine>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {rehab.staff.map((s, i) => (
                  <div key={i} className="text-center">
                    <span
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold text-white"
                      style={{ background: rehab.accent_color }}
                    >
                      {s.name ? s.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'}
                    </span>
                    <p className="mt-1.5 text-xs font-semibold text-stone-700">{s.name || 'Staff'}</p>
                    <p className="text-[10px] text-stone-400">{s.role || '—'}</p>
                  </div>
                ))}
              </div>
            )}
          </Accordion>

          <Accordion id="cost" title="Cost Breakdown" sub={costSummary(rehab)} color={ACCORDION_COLORS.cost} icon={IconMoney()} open={openAccs.includes('cost')} onToggle={() => toggleAcc('cost')}>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-stone-900 p-3 text-white">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">{rehab.cost_structure.currency} · DEPOSIT</p>
                <p className="text-lg font-bold">{rehab.cost_structure.intake_deposit ?? '—'}</p>
                <p className="text-[10px] text-white/60">Intake deposit</p>
              </div>
              <div className="rounded-xl bg-stone-900 p-3 text-white">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">{rehab.cost_structure.currency} · DAILY</p>
                <p className="text-lg font-bold">{rehab.cost_structure.daily_rate ?? '—'}</p>
                <p className="text-[10px] text-white/60">Per day rate</p>
              </div>
            </div>
            <div className="mt-2 rounded-xl bg-tov-blue p-3 text-white">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">{rehab.cost_structure.currency} · FULL PROGRAMME</p>
              <p className="text-lg font-bold">{rehab.cost_structure.full_28day_program ?? '—'}</p>
              <p className="text-[10px] text-white/60">28-day residential programme</p>
            </div>
            {rehab.cost_structure.breakdown.length === 0 ? (
              <EmptyLine>No cost breakdown listed</EmptyLine>
            ) : (
              <div className="mt-3">{rehab.cost_structure.breakdown.map((b, i) => <CostRow key={i} row={b} />)}</div>
            )}
          </Accordion>

          <Accordion id="tags" title="Focus Areas" sub={tagsSummary(rehab)} color={ACCORDION_COLORS.tags} icon={IconTag()} open={openAccs.includes('tags')} onToggle={() => toggleAcc('tags')}>
            {tagged.length === 0 ? (
              <EmptyLine>No focus areas tagged</EmptyLine>
            ) : (
              <div className="space-y-4">
                {tagged.map(cat => (
                  <div key={cat.id}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                      <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(item => (
                        <span key={item.id} className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: cat.color, color: '#fff' }}>
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Accordion>

          <Accordion id="protocols" title="Mandatory Care Protocols" sub={`${rehab.protocols.length} standard practices`} color={ACCORDION_COLORS.protocols} icon={IconClipboard()} open={openAccs.includes('protocols')} onToggle={() => toggleAcc('protocols')}>
            {rehab.protocols.length === 0 ? (
              <EmptyLine>No protocols listed</EmptyLine>
            ) : (
              <div>{rehab.protocols.map((p, i) => <ProtocolRow key={i} protocol={p} />)}</div>
            )}
          </Accordion>

          <Accordion id="contact" title="Contact & Social" sub="Numbers, email, social links" color={ACCORDION_COLORS.contact} icon={IconPhone()} open={openAccs.includes('contact')} onToggle={() => toggleAcc('contact')}>
            <div>
              {(contact.phone || []).map((p, i) => (
                <ContactRow key={i} icon={IconCall(16)} color="#1E8449" label={`Phone${(contact.phone.length > 1) ? ` ${i + 1}` : ''}`} value={p} />
              ))}
              <ContactRow icon={IconWhatsApp(16)} color="#25D366" label="WhatsApp" value={contact.whatsapp} />
              <ContactRow icon={IconEmail(16)} color="#1F618D" label="Email" value={contact.email} />
              <ContactRow icon={IconWeb(16)} color="#7D3C98" label="Website" value={contact.website} />
              <ContactRow icon={IconApp(16)} color="#E67E22" label="App Link" value={contact.app_link} />
              <ContactRow icon={IconPerson(16)} color="#5B6270" label="Contact Person" value={contact.contact_person} />
              <ContactRow icon={IconPin(16)} color="#1F618D" label="Location" value={rehab.location.text} />
              <ContactRow icon={IconBadge(16)} color="#C0392B" label="Affiliation / License" value={rehab.affiliation.body} />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-400">Social Media</p>
              <div className="flex gap-3">
                {socials.map(([key, s]) => {
                  const value = contact.social?.[key]
                  return value ? (
                    <a
                      key={key}
                      href={value.startsWith('http') ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${s.color}17`, color: s.color }}
                    >
                      {s.icon}
                    </a>
                  ) : (
                    <span key={key} className="flex h-10 w-10 items-center justify-center rounded-xl opacity-30" style={{ background: `${s.color}17`, color: s.color }}>
                      {s.icon}
                    </span>
                  )
                })}
              </div>
            </div>
          </Accordion>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs text-stone-600">
            This directory is informational. Facilities vary in cost, capacity and accreditation — always call ahead to confirm availability.
          </p>
        </div>

        <BackButton to="/aweh/library" />
      </div>
    )
  }

  return (
    <div data-page="Rehab_Directory_Page" aria-label="Rehab Directory Page" className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Aweh Ekse!</p>
        <h1 className="text-2xl font-bold text-stone-800">Rehab &amp; Recovery Directory</h1>
        <p className="mt-1 text-sm text-stone-500">{regionRehabs.length} facilities {isFallback ? `across ${current.name}` : `across ${current.name}`}</p>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-stone-100 px-3.5 py-3">
          {IconSearch}
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search facility, city, contact..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
          />
        </div>
        <button
          onClick={toggleFilterSheet}
          className="flex items-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Filter
          {fCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1 text-[11px] font-bold text-stone-900">
              {fCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {typeChips.map(t => (
          <button
            key={t.id}
            onClick={() => setTypeFilter(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
              typeFilter === t.id ? 'bg-stone-900 text-white' : 'bg-white text-stone-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-2xl">🔍</p>
          <h3 className="mt-2 font-bold text-stone-800">No facilities match</h3>
          <p className="mt-1 text-xs text-stone-400">Try clearing filters or search terms</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-stone-400">{filtered.length} of {rehabs.length} shown</p>
          {filtered.map(r => {
            const pills = tagPillsForCard(r)
            const isGov = r.facility_type === 'Government Psychiatric Ward'
            const phone = r.contact.phone?.[0] || 'No number on file'
            return (
              <button
                key={r.rehab_id}
                onClick={() => setActiveRehabId(r.rehab_id)}
                className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.99]"
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ background: r.accent_color }}
                >
                  {r.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-stone-800">{r.name}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                        isGov ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {isGov ? 'Gov Ward' : 'Rehab'}
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <Meta icon={IconPin(12)}>{r.location.text || 'Location not set'}</Meta>
                    <Meta icon={IconCall(12)}>{phone}</Meta>
                  </div>
                  {pills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pills.map((p, i) => (
                        <span
                          key={i}
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{ background: `${p.color}17`, color: p.color }}
                        >
                          {p.name.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Link
        to="/help/rehab/checker"
        data-page="rehab_checker"
        className="block rounded-2xl bg-tov-orange py-4 text-center text-sm font-bold text-white shadow-sm active:scale-[0.99]"
      >
        Rehab Assistance Checker
      </Link>

      {region === 'BW' && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-bold text-purple-800">Botswana 3-Tier Rehab System</p>
          <p className="mt-1 text-xs text-purple-600">Botswana operates a three-tier referral system: Primary (community clinics &amp; NGOs) → Secondary (district hospitals like Sekgoma Memorial) → Tertiary (Sbrana Psychiatric Hospital). Contact any facility to begin the admission process.</p>
          <div className="mt-2 flex gap-2">
            <div className="flex-1 rounded-lg bg-white p-2 text-center">
              <p className="text-[10px] font-bold text-purple-700">TIER 1</p>
              <p className="text-[10px] text-stone-500">Community</p>
            </div>
            <div className="flex-1 rounded-lg bg-white p-2 text-center">
              <p className="text-[10px] font-bold text-purple-700">TIER 2</p>
              <p className="text-[10px] text-stone-500">District</p>
            </div>
            <div className="flex-1 rounded-lg bg-white p-2 text-center">
              <p className="text-[10px] font-bold text-purple-700">TIER 3</p>
              <p className="text-[10px] text-stone-500">Tertiary</p>
            </div>
          </div>
        </div>
      )}

      {region === 'BW' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-red-50 p-4">
            <h2 className="text-sm font-bold text-red-800">Emergency &amp; Crisis Lines — Botswana</h2>
            <p className="mt-1 text-xs text-red-600">If you or someone you know is in immediate danger, call emergency services.</p>
          </div>
          <div className="space-y-2">
            {BW_EMERGENCY_LINES.map((line, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-800">{line.label}</p>
                  {line.note && <p className="mt-0.5 text-xs text-stone-400">{line.note}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <a href={`tel:${line.number.replace(/\s/g, '')}`}
                    className="rounded-xl bg-tov-green px-4 py-2 text-sm font-medium text-white hover:bg-tov-green-light">
                    {line.number}
                  </a>
                  {line.alt && (
                    <a href={`tel:${line.alt.replace(/\s/g, '')}`}
                      className="rounded-xl bg-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-300">
                      {line.alt}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BackButton to="/aweh/library" />

      {sheetOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-hidden rounded-t-3xl bg-white animate-slide-up">
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-stone-200" />
            <div className="flex items-center justify-between px-5 pb-1 pt-4">
              <h3 className="font-bold text-stone-800">Filter by focus area</h3>
              <button
                onClick={() => setDraftFilters({ substances: [], conditioning: [], mental_health: [] })}
                className="text-sm font-semibold text-tov-red"
              >
                Clear all
              </button>
            </div>
            <div className="max-h-[60dvh] overflow-y-auto px-5 pb-4 pt-3">
              {taxonomy.categories.map(cat => {
                const color = CAT_COLORS[cat.id]
                return (
                  <div key={cat.id} className="mb-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-sm font-bold" style={{ color }}>{cat.label}</span>
                    </div>
                    {cat.zones.map(zone => (
                      <div key={zone.id} className="mb-3">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400">{zone.label}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {zone.items.map(item => {
                            const selected = (draftFilters[cat.id] || []).includes(item.id)
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  const cur = draftFilters[cat.id] || []
                                  const next = cur.includes(item.id)
                                    ? cur.filter(t => t !== item.id)
                                    : [...cur, item.id]
                                  setDraftFilters({ ...draftFilters, [cat.id]: next })
                                }}
                                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                                style={
                                  selected
                                    ? { background: color, borderColor: color, color: '#fff' }
                                    : { background: '#fff', border: '1px solid #E7E5E4', color: '#57534E' }
                                }
                              >
                                {item.name}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
            <div className="border-t border-stone-100 p-4 pb-6">
              <button onClick={applyFilters} className="w-full rounded-2xl bg-stone-900 py-3.5 text-sm font-bold text-white active:scale-[0.99]">
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function capacitySummary(rehab) {
  const beds = rehab.accommodation.total_beds
  const bedTxt = beds ? `${beds} beds` : 'Beds not set'
  return `${bedTxt} · ${rehab.facilities.length} facility type${rehab.facilities.length === 1 ? '' : 's'}`
}

function costSummary(rehab) {
  const rate = rehab.cost_structure.daily_rate
  return rate ? `${rehab.cost_structure.currency} ${rate}/day` : 'Pricing not set'
}

function tagsSummary(rehab) {
  const total = (rehab.tags.substances || []).length + (rehab.tags.conditioning || []).length + (rehab.tags.mental_health || []).length
  return total ? `${total} focus area${total === 1 ? '' : 's'} tagged` : 'No focus areas tagged'
}
