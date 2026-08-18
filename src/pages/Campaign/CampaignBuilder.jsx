import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'
import { zimbabweLocations } from '../../data/zimbabwe-locations'
import { botswanaLocations } from '../../data/botswana-locations'
import venueTypes from '../../data/venue-types.json'
import targetAudience from '../../data/target-audience.json'
import issues from '../../data/issues.json'
import useRegionFilter from '../../hooks/useRegionFilter'
import BackButton from '../../components/ui/BackButton'

const EVENT_TYPES = [
  'Assembly', 'Campaign', 'Workshop', 'Training', 'Competition',
  'Counseling Session', 'Bonding / Obstacle Course', 'Poll Drive', 'Rehab Outreach',
]

const PILLARS = [
  { id: 'addictive_substances', name: 'Addictive Substances' },
  { id: 'conditioning_contents', name: 'Conditioning Contents' },
  { id: 'mental_health', name: 'Mental Health' },
]

const SMART_TEMPLATES = {
  alcohol: {
    name: '1. Cost Counts: Alcohol in Schools',
    detail: 'Harare Central • Assembly + Parent Meeting',
    s: 'Reduce alcohol use and normalize drinking among Form 3-6 students at 2 secondary schools in Harare Central.',
    m: '• 500 Students attend assembly\n• 75% Post-Poll score on brain impact\n• 40 Parents attend meeting\n• 20 HELP! referrals for counseling',
    a: 'Resources: 1 Pro Psychologist, 1 Rehab Rep, School hall, Aweh Ekse app, $0 budget.',
    r: 'Bottle stores within 300m of schools. Principal reported 15 alcohol suspensions last term.',
    t: '3 Weeks: 15 Aug 2026 to 5 Sept 2026 | Report Due: 10 Sept 2026',
    title: 'Cost Counts: Alcohol Awareness Assembly',
  },
  social: {
    name: '2. Better Brains: Unplug Social Media',
    detail: 'Bulawayo • 7-Day Digital Sunset Challenge',
    s: 'Reduce daily screen time and teach algorithm awareness to 100 students aged 13-17 at Girls High School, Bulawayo.',
    m: '• 100 Students complete 7-Day Digital Sunset\n• 60% Report 1+ Exposure-Free Hour/day\n• 80% Explain infinite scroll in post-poll\n• 15 HELP! referrals',
    a: 'Resources: 2 Teachers trained, 1 Counselor Pro Card, App tracker, $0 budget.',
    r: 'School reports drop in focus. 90% students have TikTok. Under-25 prefrontal cortex focus.',
    t: '2 Weeks: 1 Sept 2026 to 12 Sept 2026 | Report Due: 15 Sept 2026',
    title: 'Better Brains: 7-Day Digital Sunset',
  },
  gambling: {
    name: '3. The House Always Wins: Gambling & Forex',
    detail: 'Mbare • Sports Betting & Forex Awareness',
    s: 'Educate 300 young men aged 18-25 in Mbare, Harare on risks of sports betting and forex groups.',
    m: '• 300 Reached via community hall + WhatsApp\n• 50% Explain variable reward loop\n• 30 Take Rehab Assistance Test\n• 10 Pro Card financial bookings',
    a: 'Resources: Community leader host, 1 Pro Financial Counselor, Venue donated, $50 data.',
    r: 'Betting shops on every corner. High youth unemployment. Money lost to get-rich scams.',
    t: '1 Day Event + 2 Week Follow-up: 10 Oct 2026 | Report Due: 25 Oct 2026',
    title: 'The House Always Wins: Forex & Betting',
  },
  dagga: {
    name: '4. Reduce Repetition: Dagga Prevention',
    detail: 'Mutare District • Rural School Outreach',
    s: 'Reduce dagga use and peer pressure among Form 1-4 students at 1 rural school in Mutare District.',
    m: '• 250 Students attend assembly\n• 50% Reduction in dagga confiscations\n• 25 Students use anonymous HELP! chat\n• 3 Teachers trained to spot signs',
    a: 'Resources: Headmaster approval, 1 Pro Counselor, 1 Police Rep, Aweh Ekse Library.',
    r: 'Teachers report hostel dagga use increasing. Cultural myth that \'natural means safe\'.',
    t: 'Term 4: 12 Oct 2026 to 20 Nov 2026 | Report Due: 25 Nov 2026',
    title: 'Reduce Repetition: Dagga Prevention',
  },
  mental: {
    name: '5. You Are Not Alone: Mental Health',
    detail: 'Harare • Stress & Depression Screening',
    s: 'Provide mental health screening and coping tools to 150 university students aged 18-25 at UZ, Harare.',
    m: '• 150 Students attend workshop\n• 100 Complete anonymous mental health screening\n• 40 Referrals to campus clinic & Pro Cards\n• 90% Learn 1 coping skill',
    a: 'Resources: SRC partnership, 3 Pro Psychologists, Private room, App QR codes, $0.',
    r: 'Exam season stress. Campus clinic overwhelmed. High stigma around depression.',
    t: '1 Week: 3 Nov 2026 to 7 Nov 2026 | Report Due: 10 Nov 2026',
    title: 'You Are Not Alone: Campus Mental Health',
  },
}

const STEP_COLORS = [
  { header: 'bg-purple-100 border-purple-200 text-purple-900', sub: 'text-purple-700' },
  { header: 'bg-lime-100 border-lime-200 text-lime-900', sub: 'text-lime-700' },
  { header: 'bg-rose-100 border-rose-200 text-rose-900', sub: 'text-rose-700' },
  { header: 'bg-orange-100 border-orange-200 text-orange-900', sub: 'text-orange-700' },
]

export default function CampaignBuilder() {
  const { activeProfile } = useActiveProfile()
  const { region, current } = useRegionFilter()
  const navigate = useNavigate()

  const [openStep, setOpenStep] = useState(0)
  const [openIssue, setOpenIssue] = useState(null)
  const [openAudienceCat, setOpenAudienceCat] = useState(null)
  const [schoolsLoaded, setSchoolsLoaded] = useState(false)
  const [schoolsData, setSchoolsData] = useState([])

  const [form, setForm] = useState({
    name: '',
    eventType: 'Assembly',
    themes: [],
    themeCustom: '',
    topicNotes: '',
    pillars: [],
    topics: [],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    schedule: 'Single Day Event',
    description: '',
    venueType: '',
    venueOther: '',
    region: `${current.name} (${region})`,
    city: '',
    area: '',
    venueName: '',
    audience: [],
    audienceCustom: '',
    audienceType: '',
    attendees: '',
    speakers: '',
    budget: '',
    schools: [],
    schoolQuery: '',
    schoolLevel: 'All',
    schoolProvince: 'All',
    schoolDistrict: 'All',
    smart: { s: '', m: '', a: '', r: '', t: '' },
    referralLink: true,
    participationPolls: true,
    attendanceQR: true,
    duration: '4',
  })
  const [saving, setSaving] = useState(false)
  const [smartOpen, setSmartOpen] = useState(false)

  const categories = issues.issues.categories

  const regionLocations = useMemo(() => {
    return region === 'BW' ? botswanaLocations : zimbabweLocations
  }, [region])

  const townOptions = useMemo(() => {
    const map = {}
    for (const d of regionLocations.districts) {
      for (const t of d.towns) {
        map[t.name] = t
      }
    }
    return Object.values(map)
  }, [regionLocations])

  const areaOptions = useMemo(() => {
    if (!form.city) return []
    const town = townOptions.find(t => t.name === form.city)
    return town ? town.areas : []
  }, [form.city, townOptions])

  useEffect(() => {
    if (!schoolsLoaded) return
    const mod = region === 'BW'
      ? import('../../data/botswana-schools.json')
      : import('../../data/schools.json')
    mod.then(m => setSchoolsData(m.default))
  }, [schoolsLoaded, region])

  const venueItems = useMemo(() => {
    const out = []
    for (const cat of venueTypes.venue_categories) {
      for (const item of cat.items) out.push({ category: cat.category, name: item.name, description: item.description })
    }
    return out
  }, [])

  const allDistricts = useMemo(() => {
    const set = new Set()
    for (const s of schoolsData) {
      const d = s.district || s.area
      if (d) set.add(d)
    }
    return Array.from(set).sort()
  }, [schoolsData])

  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const toggleTheme = (t) => setForm(f => ({
    ...f,
    themes: f.themes.includes(t) ? f.themes.filter(x => x !== t) : [...f.themes, t],
  }))

  const addCustomTheme = () => {
    const t = form.themeCustom.trim()
    if (!t) return
    setForm(f => ({ ...f, themes: f.themes.includes(t) ? f.themes : [...f.themes, t], themeCustom: '' }))
  }

  const togglePillar = (id) => setForm(f => ({
    ...f,
    pillars: f.pillars.includes(id) ? f.pillars.filter(x => x !== id) : [...f.pillars, id],
  }))

  const toggleIssueTopic = (issue) => setForm(f => ({
    ...f,
    topics: f.topics.some(x => x.slug === issue.slug)
      ? f.topics.filter(x => x.slug !== issue.slug)
      : [...f.topics, { slug: issue.slug, name: issue.name, notes: '' }],
  }))

  const addTopicFromCustom = () => {
    const name = form.themeCustom.trim()
    if (!name) return
    setForm(f => ({
      ...f,
      themes: f.themes.includes(name) ? f.themes : [...f.themes, name],
      themeCustom: '',
      topics: [...f.topics, { slug: 'custom', name, notes: form.topicNotes.trim() }],
    }))
  }

  const updateTopicNotes = (slug, notes) => setForm(f => ({
    ...f,
    topics: f.topics.map(t => (t.slug === slug ? { ...t, notes } : t)),
  }))

  const toggleAudience = (label) => setForm(f => ({
    ...f,
    audience: f.audience.includes(label) ? f.audience.filter(x => x !== label) : [...f.audience, label],
  }))

  const addAudienceCustom = () => {
    const v = form.audienceCustom.trim()
    if (!v) return
    setForm(f => ({ ...f, audience: f.audience.includes(v) ? f.audience : [...f.audience, v], audienceCustom: '' }))
  }

  const loadSmartTemplate = (key) => {
    const t = SMART_TEMPLATES[key]
    if (!t) return
    setForm(f => ({
      ...f,
      name: f.name || t.title,
      smart: { s: t.s, m: t.m, a: t.a, r: t.r, t: t.t },
    }))
  }

  const schoolMatches = useMemo(() => {
    if (!schoolsData.length) return []
    const q = (form.schoolQuery || '').toLowerCase()
    return schoolsData.filter(s => {
      if (q && !s.name.toLowerCase().includes(q)) return false
      const level = s.schoolLevel || s.type
      if (form.schoolLevel && form.schoolLevel !== 'All' && level !== form.schoolLevel) return false
      const province = s.province || s.area
      if (form.schoolProvince && form.schoolProvince !== 'All' && province !== form.schoolProvince) return false
      const district = s.district || s.area
      if (form.schoolDistrict && form.schoolDistrict !== 'All' && district !== form.schoolDistrict) return false
      return true
    }).slice(0, 40)
  }, [schoolsData, form.schoolQuery, form.schoolLevel, form.schoolProvince, form.schoolDistrict])

  const addSchool = (school) => {
    const key = school.schoolNumber || school.id
    if (form.schools.some(s => (s.schoolNumber || s.id) === key)) return
    setForm(f => ({ ...f, schools: [...f.schools, school], schoolQuery: '' }))
  }

  const removeSchool = (school) => {
    const key = school.schoolNumber || school.id
    setForm(f => ({
      ...f,
      schools: f.schools.filter(s => (s.schoolNumber || s.id) !== key),
    }))
  }

  const valid = form.name.trim() && form.startDate

  const save = async () => {
    if (!valid) return
    setSaving(true)
    const createdAt = new Date().toISOString()
    const campaignId = await db.campaigns.add({
      creatorProfileId: activeProfile.id,
      name: form.name.trim(),
      theme: form.themes.join(', ') || form.eventType,
      pillars: form.pillars,
      topics: form.topics,
      duration: parseInt(form.duration),
      description: form.description,
      eventType: form.eventType,
      schedule: form.schedule,
      city: form.city,
      area: form.area,
      venueName: form.venueName,
      venueType: form.venueType,
      audience: form.audience,
      audienceType: form.audienceType,
      attendees: parseInt(form.attendees) || null,
      schools: form.schools,
      smart: form.smart,
      active: true,
      createdAt,
    })

    const title = form.name.trim()
    const location = [form.venueName, form.area, form.city].filter(Boolean).join(', ') || 'Online'

    if (form.startDate) {
      await db.campaignEvents.add({
        campaignId,
        date: form.startDate,
        title,
        location,
        time: form.startTime,
        endDate: form.endDate,
        endTime: form.endTime,
        createdAt,
      })
    }
    navigate('/campaign')
  }

  const accordion = (step, title, subtitle, children, colorIdx) => (
    <div className={`overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm`}>
      <button
        type="button"
        onClick={() => setOpenStep(openStep === step ? null : step)}
        className={`w-full border-b px-4 py-3 text-left ${openStep === step ? STEP_COLORS[colorIdx].header : 'bg-stone-50 border-stone-200'}`}
      >
        <span className={`block text-sm font-bold ${openStep === step ? '' : 'text-stone-700'}`}>{title}</span>
        <span className={`mt-0.5 block text-[11px] font-medium ${openStep === step ? STEP_COLORS[colorIdx].sub : 'text-stone-400'}`}>{subtitle}</span>
      </button>
      {openStep === step && (
        <div className="animate-slide-up p-4">{children}</div>
      )}
    </div>
  )

  const fieldClass = 'w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-blue focus:outline-none'
  const labelClass = 'text-[11px] font-bold uppercase tracking-wide text-stone-500'
  const chip = (active) => `rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${active ? 'bg-tov-blue text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`

  return (
    <div data-page="Campaign_Builder_Page" aria-label="Campaign Builder Page" className="space-y-5 pb-2">
      <span className="inline-block rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-stone-500">
        Aweh Ekse! Event Creator
      </span>
      <h1 className="text-2xl font-bold text-stone-800">Create Event / Campaign</h1>
      <p className="text-sm text-stone-500">Assemblies, Workshops, Outreach &amp; Campaigns</p>

      {accordion(0, 'STEP 1: BASICS', 'Title, Type, Themes & Schedule',
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Event Title <span className="normal-case text-stone-400">{form.name.length}/80</span></label>
            <input maxLength={80} value={form.name} onChange={update('name')} className={`mt-1 ${fieldClass}`} placeholder="e.g. Cost Counts: Vaping & Alcohol Assembly" />
          </div>

          <div>
            <label className={labelClass}>Event Type</label>
            <select value={form.eventType} onChange={update('eventType')} className={`mt-1 ${fieldClass}`}>
              {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Theme / Topic (What is this about?)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Alcohol Awareness', 'Better Brains', 'Cost Counts', 'Social Media', 'Vaping', 'Gambling', 'Mental Health'].map(t => (
                <button key={t} type="button" onClick={() => toggleTheme(t)} className={chip(form.themes.includes(t))}>{t}</button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input value={form.themeCustom} onChange={update('themeCustom')} className={`flex-1 ${fieldClass}`} placeholder="+ Add Custom Theme" />
              <button type="button" onClick={addCustomTheme} className="rounded-xl bg-tov-blue px-3 text-xs font-semibold text-white">Add</button>
            </div>
            <textarea value={form.topicNotes} onChange={update('topicNotes')} className={`mt-2 ${fieldClass}`} rows={2} placeholder="Topic notes / why this theme matters..." />
          </div>

          <div>
            <label className={labelClass}>Topic / Focus Pillars</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PILLARS.map(p => (
                <button key={p.id} type="button" onClick={() => togglePillar(p.id)} className={chip(form.pillars.includes(p.id))}>{p.name}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Add Topics <span className="normal-case text-tov-blue">({form.topics.length} selected)</span></label>
            {categories.map(cat => (
              <div key={cat.id} className="overflow-hidden rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setOpenIssue(openIssue === cat.id ? null : cat.id)}
                  className="flex w-full items-center justify-between bg-stone-50 px-3 py-2.5 text-left"
                >
                  <span className="text-sm font-semibold text-stone-700">{cat.icon} {cat.name}</span>
                  <span className="text-stone-400">{openIssue === cat.id ? '−' : '+'}</span>
                </button>
                {openIssue === cat.id && (
                  <div className="max-h-72 space-y-1 overflow-y-auto p-2">
                    {cat.zones.map(zone => (
                      <div key={zone.id}>
                        <p className="px-1 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-stone-400">{zone.name}</p>
                        {zone.issues.map(issue => {
                          const active = form.topics.some(t => t.slug === issue.slug)
                          return (
                            <button
                              key={issue.id}
                              type="button"
                              onClick={() => toggleIssueTopic(issue)}
                              className={`mb-1 w-full rounded-lg border px-3 py-2 text-left text-xs transition-all ${active ? 'border-tov-blue bg-tov-blue-pale' : 'border-stone-200 bg-white'}`}
                            >
                              <span className="flex items-center justify-between">
                                <span className="font-semibold text-stone-700">{issue.name}</span>
                                <span className="ml-2 text-tov-blue">{active ? '✓' : '+'}</span>
                              </span>
                              {issue.slang && <span className="mt-0.5 block text-[10px] text-stone-400">Slang: {issue.slang}</span>}
                              <span className="mt-1 block leading-relaxed text-stone-500">{issue.description}</span>
                              {active && (
                                <input
                                  type="text"
                                  onClick={e => e.stopPropagation()}
                                  value={form.topics.find(t => t.slug === issue.slug)?.notes || ''}
                                  onChange={e => updateTopicNotes(issue.slug, e.target.value)}
                                  className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs focus:border-tov-blue focus:outline-none"
                                  placeholder="Add note for this topic (optional)"
                                />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <input value={form.themeCustom} onChange={update('themeCustom')} className={`flex-1 ${fieldClass}`} placeholder="Type a custom topic..." />
              <button type="button" onClick={addTopicFromCustom} className="rounded-xl bg-tov-blue px-3 text-xs font-semibold text-white">Add Topic</button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Start Date &amp; Time</label>
            <input type="date" value={form.startDate} onChange={update('startDate')} className={`mt-1 ${fieldClass}`} />
            <input type="time" value={form.startTime} onChange={update('startTime')} className={`mt-2 ${fieldClass}`} />
          </div>

          <div>
            <label className={labelClass}>End Date &amp; Time</label>
            <input type="date" value={form.endDate} onChange={update('endDate')} className={`mt-1 ${fieldClass}`} />
            <input type="time" value={form.endTime} onChange={update('endTime')} className={`mt-2 ${fieldClass}`} />
          </div>

          <div>
            <label className={labelClass}>Event Schedule</label>
            <select value={form.schedule} onChange={update('schedule')} className={`mt-1 ${fieldClass}`}>
              {['Single Day Event', 'Multi-Day', 'Recurring (Weekly)', 'Recurring (Monthly)'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={update('description')} className={`mt-1 ${fieldClass}`} rows={3} placeholder="What happens at this event? Mention @Library articles or Did You Know facts..." />
          </div>
        </div>, 0)}

      {accordion(1, 'STEP 2: MEDIA, PEOPLE & LOCATION', 'Images, Venue, Audience & Speakers',
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Venue Type</label>
            <select value={form.venueType} onChange={update('venueType')} className={`mt-1 ${fieldClass}`}>
              <option value="">Select a venue type...</option>
              {venueItems.map((v, i) => (
                <option key={i} value={v.name}>{v.name} ({v.category})</option>
              ))}
            </select>
            <input value={form.venueOther} onChange={update('venueOther')} className={`mt-2 ${fieldClass}`} placeholder="Or type a venue type not listed..." />
          </div>

          <div>
            <label className={labelClass}>Venue Name</label>
            <input value={form.venueName} onChange={update('venueName')} className={`mt-1 ${fieldClass}`} placeholder="Search Schools, Rehabs, Churches..." />
          </div>

          <div>
            <label className={labelClass}>Country / Region</label>
            <select value={form.region} onChange={update('region')} className={`mt-1 ${fieldClass}`}>
              <option>{current.name} ({region})</option>
              <option>SADC Region</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>City / Town</label>
            <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value, area: '' }))} className={`mt-1 ${fieldClass}`}>
              <option value="">Select city / town...</option>
              {townOptions.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Area / Neighbourhood</label>
            <select value={form.area} onChange={update('area')} className={`mt-1 ${fieldClass}`} disabled={!form.city}>
              <option value="">{form.city ? 'Select area...' : 'Choose a city first'}</option>
              {areaOptions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Target Audience <span className="normal-case text-tov-blue">({form.audience.length} selected)</span></label>
            <div className="mt-2 space-y-1">
              {targetAudience.target_audiences.categories.map(cat => (
                <div key={cat.name} className="overflow-hidden rounded-xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setOpenAudienceCat(openAudienceCat === cat.name ? null : cat.name)}
                    className="flex w-full items-center justify-between bg-stone-50 px-3 py-2.5 text-left"
                  >
                    <span className="text-sm font-semibold text-stone-700">{cat.name}</span>
                    <span className="text-stone-400">{openAudienceCat === cat.name ? '−' : '+'}</span>
                  </button>
                  {openAudienceCat === cat.name && (
                    <div className="flex flex-wrap gap-1.5 p-2">
                      {cat.subcategories.map(sub => (
                        <button key={sub} type="button" onClick={() => toggleAudience(sub)} className={chip(form.audience.includes(sub))}>{sub}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input value={form.audienceCustom} onChange={update('audienceCustom')} className={`flex-1 ${fieldClass}`} placeholder="Add custom audience..." />
              <button type="button" onClick={addAudienceCustom} className="rounded-xl bg-tov-blue px-3 text-xs font-semibold text-white">Add</button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Audience Type</label>
            <select value={form.audienceType} onChange={update('audienceType')} className={`mt-1 ${fieldClass}`}>
              <option value="">Select audience type...</option>
              <option>Students</option>
              <option>Teachers</option>
              <option>Parents</option>
              <option>Adults</option>
              <option>Counselors</option>
              <option>Health Professionals</option>
              <option>Community Members</option>
              <option>Mixed</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Number of Attendees</label>
            <input type="number" min="0" value={form.attendees} onChange={update('attendees')} className={`mt-1 ${fieldClass}`} placeholder="e.g. 500" />
          </div>

          <div>
            <label className={labelClass}>Attach Speakers / Pro Cards</label>
            <input value={form.speakers} onChange={update('speakers')} className={`mt-1 ${fieldClass}`} placeholder="Search registered Doctors, Counselors, Police..." />
          </div>

          <div>
            <label className={labelClass}>Budget / Cost Notes</label>
            <textarea value={form.budget} onChange={update('budget')} className={`mt-1 ${fieldClass}`} rows={2} placeholder="Budget details... (App does not process payments)" />
          </div>
        </div>, 1)}

      {accordion(2, 'STEP 3: ENGAGEMENT & S.M.A.R.T. GOALS', 'SMART Framework, Polls & Referral Links',
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Load Pre-Filled S.M.A.R.T Template</label>
            <p className="mb-2 text-xs text-stone-400">Tap a template to complete all 5 SMART fields automatically:</p>
            <div className="space-y-2">
              {Object.entries(SMART_TEMPLATES).map(([key, t]) => (
                <button key={key} type="button" onClick={() => loadSmartTemplate(key)} className="w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-left">
                  <strong className="block text-xs text-sky-800">{t.name}</strong>
                  <span className="text-[11px] text-stone-500">{t.detail}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSmartOpen(o => !o)}
            className="w-full rounded-xl border border-tov-blue bg-tov-blue-pale px-3 py-2.5 text-xs font-semibold text-tov-blue"
          >
            {smartOpen ? 'Hide S.M.A.R.T. Framework Guide' : 'View S.M.A.R.T. Framework Guide'}
          </button>

          {smartOpen && (
            <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs leading-relaxed text-stone-600">
              <p className="rounded-lg border border-tov-purple bg-purple-50 p-2 font-semibold text-tov-purple">
                "If your campaign isn't S.M.A.R.T, donors won't fund it, schools won't track it, and you can't prove it changed anything."
              </p>
              {[
                { letter: 'S', word: 'Specific (Exactly WHO, WHAT, WHERE)', good: 'Reduce dagga use among Form 3-4 boys at Churchill High, Harare', bad: 'Stop drug abuse' },
                { letter: 'M', word: 'Measurable (How to count success with numbers)', good: '80% of learners can name 3 risks of dagga by end of term', bad: 'Raise awareness' },
                { letter: 'A', word: 'Achievable (Realistic within budget & time)', good: 'Run 4 assemblies + 1 parent meeting this term', bad: 'End all drug use in Zim in 1 month' },
                { letter: 'R', word: 'Relevant (Matters to THIS specific group)', good: 'Teach vaping + energy drinks sold at the tuckshop', bad: 'Teach heroin harm (to a school with no heroin)' },
                { letter: 'T', word: 'Time-Bound (Explicit start & end date)', good: '6 weeks: 1 Aug to 12 Sept 2026', bad: 'Ongoing campaign' },
              ].map(({ letter, word, good, bad }) => (
                <div key={letter} className="rounded-lg border border-stone-200 bg-white p-2">
                  <p className="font-bold text-tov-blue">{letter}. {word}</p>
                  <p className="mt-1 text-tov-red line-through opacity-70">{bad}</p>
                  <p className="text-tov-green">{good}</p>
                </div>
              ))}
              <p className="rounded-lg border border-tov-green bg-green-50 p-2 font-semibold text-tov-green">
                "By [DATE], we will [ACTION] for [WHO] at [WHERE] so that [MEASURABLE RESULT]. This is relevant because [PROBLEM]. We will do this with [RESOURCES]."
              </p>
            </div>
          )}

          {[
            { key: 's', label: 'S - Specific', placeholder: 'By [Date], we will [ACTION] for [WHO] at [WHERE]...' },
            { key: 'm', label: 'M - Measurable (2-4 Targets)', placeholder: 'e.g. 500 Attendance | 75% Poll Score | 20 HELP! Referrals' },
            { key: 'a', label: 'A - Achievable (Resources Needed)', placeholder: 'e.g. 1 Pro Psychologist, 1 Rehab Rep, Venue donated, $0 budget' },
            { key: 'r', label: 'R - Relevant (Problem Statement)', placeholder: 'e.g. 15 alcohol suspensions last term. Under 25 brains developing.' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="rounded-xl bg-stone-50 p-3">
              <label className={labelClass}>{label}</label>
              <textarea value={form.smart[key]} onChange={e => setForm(f => ({ ...f, smart: { ...f.smart, [key]: e.target.value } }))} className={`mt-1 ${fieldClass}`} rows={2} placeholder={placeholder} />
            </div>
          ))}
          <div className="rounded-xl bg-stone-50 p-3">
            <label className={labelClass}>T - Time-Bound</label>
            <input value={form.smart.t} onChange={e => setForm(f => ({ ...f, smart: { ...f.smart, t: e.target.value } }))} className={`mt-1 ${fieldClass}`} placeholder="Start Date - End Date | Report Due Date" />
          </div>

          <div className="space-y-2">
            {[
              { key: 'referralLink', label: 'Rehab/Clinic Referral Link' },
              { key: 'participationPolls', label: 'Participation Polls' },
              { key: 'attendanceQR', label: 'Attendance QR Check-in' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
                <span className="text-sm font-medium text-stone-700">{label}</span>
                <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="h-5 w-5 accent-tov-blue" />
              </label>
            ))}
          </div>
        </div>, 2)}

      {accordion(3, 'STEP 4: SCHOOLS, PREVIEW & PUBLISH', 'Schools, Conflict Check, Moderation & Launch',
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Add Schools <span className="normal-case text-tov-blue">({form.schools.length} added)</span></label>
            <button
              type="button"
              onClick={() => setSchoolsLoaded(true)}
              className={`mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs font-semibold text-stone-600 ${schoolsLoaded ? 'hidden' : ''}`}
            >
              Load school database ({region === 'BW' ? '1,008' : '9,778'} schools)
            </button>

            {schoolsLoaded && (
              <div className="mt-2 space-y-2">
                <input value={form.schoolQuery || ''} onChange={update('schoolQuery')} className={fieldClass} placeholder="Quick-fill school name search..." />
                <div className="grid grid-cols-2 gap-2">
                  <select value={form.schoolLevel || 'All'} onChange={update('schoolLevel')} className={fieldClass}>
                    <option value="All">All Levels</option>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">High School</option>
                  </select>
                  <select value={form.schoolProvince || 'All'} onChange={update('schoolProvince')} className={fieldClass}>
                    <option value="All">All Provinces</option>
                    {[...new Set(schoolsData.map(s => s.province || s.area).filter(Boolean))].sort().map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <select value={form.schoolDistrict || 'All'} onChange={update('schoolDistrict')} className={fieldClass}>
                  <option value="All">All Districts</option>
                  {allDistricts.map(d => <option key={d}>{d}</option>)}
                </select>
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {schoolMatches.length === 0 && <p className="py-4 text-center text-xs text-stone-400">No schools match your filters.</p>}
                  {schoolMatches.map(s => (
                    <button key={s.schoolNumber || s.id} type="button" onClick={() => addSchool(s)} className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-white px-3 py-2 text-left">
                      <span>
                        <span className="block text-xs font-semibold text-stone-700">{s.name}</span>
                        <span className="text-[10px] text-stone-400">{s.schoolLevel || s.type} • {s.province || s.area} • {s.district || s.area}</span>
                      </span>
                      <span className="ml-2 text-tov-blue">+</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {form.schools.length > 0 && (
              <div className="mt-2 space-y-1">
                {form.schools.map(s => (
                  <div key={s.schoolNumber || s.id} className="flex items-center justify-between rounded-lg border border-tov-blue bg-tov-blue-pale px-3 py-2">
                    <span>
                      <span className="block text-xs font-semibold text-stone-700">{s.name}</span>
                      <span className="text-[10px] text-stone-400">{s.schoolLevel || s.type} • {s.district || s.area}</span>
                    </span>
                    <button type="button" onClick={() => removeSchool(s)} className="ml-2 h-6 w-6 rounded-full bg-tov-red text-xs font-bold text-white">x</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-3">
            <p className="text-xs font-bold uppercase text-tov-green">Conflict Checker</p>
            <p className="mt-1 text-xs text-tov-green">No venue clashes detected for selected date and time.</p>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <p className="text-xs font-bold uppercase text-stone-600">Content Moderation Scan</p>
            <p className="mt-1 text-xs text-stone-500">Auto-scan complete. Content meets Aweh Ekse safety guidelines.</p>
          </div>

          <button onClick={save} disabled={!valid || saving}
            className="w-full rounded-xl bg-stone-800 py-3 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Publishing...' : 'Publish Campaign Now'}
          </button>
          <button onClick={save} disabled={!valid || saving}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 text-sm font-bold text-stone-700 disabled:opacity-50">
            Schedule for Later
          </button>
        </div>, 3)}

      <BackButton to="/campaign" className="back_button" />
    </div>
  )
}
