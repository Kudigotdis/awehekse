import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveProfile } from '../../context/ProfileContext'
import { hashPassword } from '../../core/auth/password'

const COUNTRIES = [
  { code: 'ZW', label: '🇿🇼 Zimbabwe (ZW)' },
  { code: 'ZA', label: '🇿🇦 South Africa (ZA)' },
  { code: 'ZM', label: '🇿🇲 Zambia (ZM)' },
  { code: 'BW', label: '🇧🇼 Botswana (BW)' },
  { code: 'MZ', label: '🇲🇿 Mozambique (MZ)' },
  { code: 'MW', label: '🇲🇼 Malawi (MW)' },
  { code: 'NA', label: '🇳🇦 Namibia (NA)' },
  { code: 'SZ', label: '🇸🇿 Eswatini (SZ)' },
  { code: 'LS', label: '🇱🇸 Lesotho (LS)' },
]

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say' },
]

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'School Teacher' },
  { value: 'adult', label: 'Adult (General)' },
  { value: 'counselor', label: 'Counselor (Non-Paid)' },
  { value: 'law', label: 'Law Officiate' },
  { value: 'parent', label: 'Parent / Guardian' },
  { value: 'employer', label: 'Employer / HR' },
  { value: 'researcher', label: 'Researcher / Journalist' },
  { value: 'donor', label: 'Donor' },
]

const ROLE_LABELS = Object.fromEntries(ROLES.map(r => [r.value, r.label]))

const CITIES = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe', 'Masvingo']

const ACCORDIONS = [
  { id: 'tier1', label: 'Individual Account Registration', sub: 'Tier 1 — Required for all users', status: 'Required', icon: '👤' },
  { id: 'tier2', label: 'Select Profile Role', sub: 'Tier 2 — Customize your dashboard', status: 'Required', icon: '🏷️' },
  { id: 'tier3pro', label: 'Professional Pro Card', sub: 'Tier 3 — Optional · Managed by Individual User', status: 'Optional', icon: '💼' },
  { id: 'tier3group', label: 'Groups & Institutional Profiles', sub: 'Tier 3 — Optional · Created by Individual User', status: 'Optional', icon: '🏢' },
]

const ROLE_FIELDS = {
  student: [
    { key: 'level', label: 'Level', type: 'select', options: ['High School', 'Tertiary'] },
    { key: 'institution', label: 'Institution Search', type: 'text', placeholder: 'Search institution…' },
    { key: 'grade', label: 'Form / Grade / Academic Year', type: 'text', placeholder: 'e.g. Form 4 or Year 2' },
  ],
  teacher: [
    { key: 'level', label: 'Level', type: 'select', options: ['High School', 'Tertiary'] },
    { key: 'institution', label: 'Institution Search', type: 'text', placeholder: 'Search institution…' },
    { key: 'subject', label: 'Subject / Department', type: 'text', placeholder: 'e.g. Mathematics' },
    { key: 'staffId', label: 'Staff ID (optional)', type: 'text', placeholder: 'Optional' },
  ],
  counselor: [
    { key: 'category', label: 'Category', type: 'select', options: ['Religious (Church/Mosque)', 'Community', 'NGO'] },
    { key: 'organization', label: 'Associated Organization', type: 'text', placeholder: 'Organization name' },
    { key: 'baseLocation', label: 'Base Location', type: 'text', placeholder: 'City / Area' },
  ],
  law: [
    { key: 'role', label: 'Role', type: 'select', options: ['Lawyer', 'Police Officer (ZRP)'] },
    { key: 'station', label: 'Station / Law Firm / Court Branch', type: 'text', placeholder: 'e.g. Harare Central' },
  ],
  parent: [
    { key: 'dependents', label: 'Age Bracket of Dependents', type: 'checkboxes', options: ['Under 12', '13–18', '19–24', '25+'] },
    { key: 'focus', label: 'Focus Concerns', type: 'checkboxes', options: ['Substances', 'Conditioning / Media', 'Mental Health'] },
  ],
  employer: [
    { key: 'workplace', label: 'Workplace Name', type: 'text', placeholder: 'Company name' },
    { key: 'sector', label: 'Sector', type: 'text', placeholder: 'e.g. Manufacturing' },
    { key: 'employees', label: 'Employee Count', type: 'number', placeholder: 'Approximate number' },
  ],
  researcher: [
    { key: 'body', label: 'Academic / Media Body Name', type: 'text', placeholder: 'Institution name' },
    { key: 'verification', label: 'Verification Link', type: 'text', placeholder: 'URL to profile or credential' },
    { key: 'focus', label: 'Focus Area', type: 'text', placeholder: 'e.g. Youth Substance Use' },
  ],
  donor: [
    { key: 'entityType', label: 'Entity Type', type: 'select', options: ['Individual', 'Corporate', 'Foundation', 'NGO'] },
    { key: 'funding', label: 'Target Funding Areas', type: 'checkboxes', options: ['Substance Recovery', 'Mental Health', 'Youth Outreach', 'Education'] },
  ],
}

const PRO_CATEGORIES = [
  'Psychiatrist', 'Psychologist', 'Addiction Specialist / Counselor', 'General Counselor',
  'Social Worker', 'General Practitioner (GP)', 'Occupational Therapist (OT)',
  'Rehab Medical Staff', 'Law Professional', 'Police Officer (ZRP Liaison)',
]

const GROUP_TYPES = [
  { value: 'rehab', label: 'Rehab Facility (Private / Government)' },
  { value: 'clinic', label: 'Clinic / Health Facility' },
  { value: 'educational', label: 'Educational Institution' },
  { value: 'religious', label: 'Religious / NGO Entity' },
  { value: 'workplace', label: 'Workplace / Corporate' },
]

const inputClass = 'w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:border-tov-green focus:outline-none'
const labelClass = 'mb-1 block text-xs font-medium text-stone-500'

function computeAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function ProfileCreate() {
  const { addProfile, switchProfile } = useActiveProfile()
  const navigate = useNavigate()
  const [open, setOpen] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    username: '', password: '', firstName: '', middleNames: '', surname: '', dob: '',
    gender: '', phone: '', email: '', country: 'ZW', city: '', area: '', tribe: '', pin: '',
  })
  const [role, setRole] = useState('')
  const [roleData, setRoleData] = useState({})
  const [proCard, setProCard] = useState({})
  const [groupType, setGroupType] = useState('')
  const [groupData, setGroupData] = useState({})

  const toggleAccordion = (id) => setOpen(o => (o === id ? null : id))
  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const pickGender = (value) => setForm(f => ({ ...f, gender: value }))

  const updateRoleField = (key, value) => setRoleData(d => ({ ...d, [key]: value }))
  const updateProField = (key, value) => setProCard(d => ({ ...d, [key]: value }))
  const updateGroupField = (key, value) => setGroupData(d => ({ ...d, [key]: value }))

  const toggleRoleCheck = (key, option) => {
    const list = roleData[key] || []
    setRoleData(d => ({ ...d, [key]: list.includes(option) ? list.filter(x => x !== option) : [...list, option] }))
  }

  const toggleGroupCheck = (key, option) => {
    const list = groupData[key] || []
    setGroupData(d => ({ ...d, [key]: list.includes(option) ? list.filter(x => x !== option) : [...list, option] }))
  }

  const renderRoleFields = (fields) => fields.map(f => {
    if (f.type === 'select') {
      return (
        <div key={f.key} className="space-y-1">
          <label className={labelClass}>{f.label}</label>
          <select value={roleData[f.key] || ''} onChange={e => updateRoleField(f.key, e.target.value)} className={inputClass}>
            <option value="">Select…</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )
    }
    if (f.type === 'checkboxes') {
      return (
        <div key={f.key} className="space-y-1">
          <label className={labelClass}>{f.label}</label>
          <div className="space-y-1.5">
            {f.options.map(o => (
              <label key={o} className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={(roleData[f.key] || []).includes(o)}
                  onChange={() => toggleRoleCheck(f.key, o)}
                  className="h-4 w-4 accent-tov-green"
                />
                {o}
              </label>
            ))}
          </div>
        </div>
      )
    }
    return (
      <div key={f.key} className="space-y-1">
        <label className={labelClass}>{f.label}</label>
        <input
          type={f.type || 'text'}
          value={roleData[f.key] || ''}
          onChange={e => updateRoleField(f.key, e.target.value)}
          placeholder={f.placeholder}
          className={inputClass}
        />
      </div>
    )
  })

  const renderGroupFields = (fields) => fields.map(f => {
    if (f.type === 'select') {
      return (
        <div key={f.key} className="space-y-1">
          <label className={labelClass}>{f.label}</label>
          <select value={groupData[f.key] || ''} onChange={e => updateGroupField(f.key, e.target.value)} className={inputClass}>
            <option value="">Select…</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )
    }
    if (f.type === 'checkboxes') {
      return (
        <div key={f.key} className="space-y-1">
          <label className={labelClass}>{f.label}</label>
          <div className="space-y-1.5">
            {f.options.map(o => (
              <label key={o} className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={(groupData[f.key] || []).includes(o)}
                  onChange={() => toggleGroupCheck(f.key, o)}
                  className="h-4 w-4 accent-tov-green"
                />
                {o}
              </label>
            ))}
          </div>
        </div>
      )
    }
    return (
      <div key={f.key} className="space-y-1">
        <label className={labelClass}>{f.label}</label>
        <input
          type={f.type || 'text'}
          value={groupData[f.key] || ''}
          onChange={e => updateGroupField(f.key, e.target.value)}
          placeholder={f.placeholder}
          className={inputClass}
        />
      </div>
    )
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.surname || !form.dob || !form.username) {
      setError('Please complete all required fields in Tier 1 (username, first name, surname, date of birth).')
      setOpen('tier1')
      return
    }
    if (!role) {
      setError('Please select a profile role in Tier 2.')
      setOpen('tier2')
      return
    }
    setSaving(true)
    setError('')
    try {
      const passwordHash = await hashPassword(form.password)
      const age = computeAge(form.dob)
      const id = await addProfile({
        ...form,
        name: form.firstName,
        password: passwordHash,
        profileType: ROLE_LABELS[role] || role,
        role,
        roleData,
        proCard,
        group: groupType ? { type: groupType, ...groupData } : null,
        age,
      })
      await switchProfile(id)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setSaving(false)
    }
  }

  const age = computeAge(form.dob)

  return (
    <div data-page="Profile_Create_Page" aria-label="Profile Create Page" className="flex min-h-dvh flex-col bg-tov-cream px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="mb-4 text-sm text-tov-green hover:underline">
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-tov-green">Aweh Ekse!</h1>
          <p className="mt-1 text-sm text-stone-500">Profile &amp; Account Setup</p>
          <p className="mt-2 text-xs text-stone-400">
            Complete the sections below to create your account. All accordions start closed — open one at a time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {ACCORDIONS.map(acc => (
            <div key={acc.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleAccordion(acc.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tov-blue-pale text-lg">{acc.icon}</span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-stone-800">{acc.label}</span>
                  <span className="block text-[11px] text-stone-400">{acc.sub}</span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  acc.status === 'Required' ? 'bg-tov-green/10 text-tov-green' : 'bg-stone-100 text-stone-400'
                }`}>
                  {acc.status}
                </span>
              </button>

              {open === acc.id && (
                <div className="space-y-4 border-t border-stone-100 p-4">
                  {acc.id === 'tier1' && (
                    <>
                      <div className="space-y-1">
                        <label className={labelClass}>Username <span className="text-tov-red">*</span></label>
                        <input type="text" required value={form.username} onChange={update('username')} placeholder="e.g. tendai_25" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Password <span className="text-tov-red">*</span></label>
                        <input type="password" required value={form.password} onChange={update('password')} placeholder="Min 4 characters" minLength={4} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>First Name <span className="text-tov-red">*</span></label>
                        <input type="text" required value={form.firstName} onChange={update('firstName')} placeholder="Your legal first name" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Middle Names</label>
                        <input type="text" value={form.middleNames} onChange={update('middleNames')} placeholder="Optional — all middle names" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Surname <span className="text-tov-red">*</span></label>
                        <input type="text" required value={form.surname} onChange={update('surname')} placeholder="Your legal surname" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Date of Birth <span className="text-tov-red">*</span></label>
                        <input type="date" required value={form.dob} onChange={update('dob')} className={inputClass} />
                        {age !== null && (
                          <p className={`text-xs font-medium ${age < 25 ? 'text-tov-purple' : 'text-tov-green'}`}>
                            Age: {age}{age < 25 ? ' · 🧠 Better Brains' : ''}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Gender <span className="text-tov-red">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {GENDERS.map(g => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => pickGender(g.value)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                form.gender === g.value ? 'border-tov-green bg-tov-green text-white' : 'border-stone-200 bg-white text-stone-600'
                              }`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Phone Number <span className="text-tov-red">*</span></label>
                        <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+263 77 123 4567" className={inputClass} />
                        <span className="text-[10px] text-stone-400">Requires OTP verification</span>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Email</label>
                        <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Region / Country <span className="text-tov-red">*</span></label>
                        <select value={form.country} onChange={update('country')} className={inputClass}>
                          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>City / Town <span className="text-tov-red">*</span></label>
                        <input type="text" value={form.city} onChange={update('city')} placeholder="e.g. Harare" list="cityList" className={inputClass} />
                        <datalist id="cityList">
                          {CITIES.map(c => <option key={c} value={c} />)}
                        </datalist>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Area / Neighbourhood <span className="text-tov-red">*</span></label>
                        <input type="text" value={form.area} onChange={update('area')} placeholder="e.g. Borrowdale" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Tribe / Ethnic group</label>
                        <input type="text" value={form.tribe} onChange={update('tribe')} placeholder="e.g. Shona, Ndebele, Tonga" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>PIN (optional, for privacy)</label>
                        <input type="password" value={form.pin} onChange={update('pin')} placeholder="4-6 digit PIN" maxLength={6} className={inputClass} />
                      </div>
                    </>
                  )}

                  {acc.id === 'tier2' && (
                    <>
                      <div className="space-y-1">
                        <label className={labelClass}>I am a… <span className="text-tov-red">*</span></label>
                        <select value={role} onChange={e => { setRole(e.target.value); setRoleData({}) }} className={inputClass}>
                          <option value="">— Select your role —</option>
                          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </div>
                      {role && ROLE_FIELDS[role] && (
                        <div className="space-y-3 rounded-xl bg-tov-blue-pale/60 p-3">
                          {renderRoleFields(ROLE_FIELDS[role])}
                        </div>
                      )}
                    </>
                  )}

                  {acc.id === 'tier3pro' && (
                    <>
                      <p className="text-xs text-stone-400">
                        Must be owned by a verified Individual User Account. You act as administrative manager.
                      </p>
                      <div className="space-y-1">
                        <label className={labelClass}>Full Name &amp; Qualifications</label>
                        <input type="text" value={proCard.fullName || ''} onChange={e => updateProField('fullName', e.target.value)} placeholder="e.g. Dr. T. Moyo, MBChB, FC Psych" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Practice License / Registration #</label>
                        <input type="text" value={proCard.license || ''} onChange={e => updateProField('license', e.target.value)} placeholder="Required for verification" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>City / Town</label>
                        <input type="text" value={proCard.city || ''} onChange={e => updateProField('city', e.target.value)} placeholder="Pre-filled from account" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Area / Neighbourhood</label>
                        <input type="text" value={proCard.area || ''} onChange={e => updateProField('area', e.target.value)} placeholder="Pre-filled from account" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Session Booking Fee (USD)</label>
                        <input type="number" min="0" value={proCard.fee || ''} onChange={e => updateProField('fee', e.target.value)} placeholder="e.g. 20" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Professional Category</label>
                        <select value={proCard.category || ''} onChange={e => updateProField('category', e.target.value)} className={inputClass}>
                          <option value="">— Select category —</option>
                          {PRO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      {proCard.category === 'Psychiatrist' && (
                        <label className="flex items-center gap-2 text-sm text-stone-700">
                          <input
                            type="checkbox"
                            checked={!!proCard.psychAccredited}
                            onChange={e => updateProField('psychAccredited', e.target.checked)}
                            className="h-4 w-4 accent-tov-green"
                          />
                          Accredited for Legal Rehab Commitment Assessments
                        </label>
                      )}
                      <div className="space-y-1">
                        <label className={labelClass}>Contact Channel Setup</label>
                        <div className="space-y-1.5">
                          {['WhatsApp Only', 'Physical Venue / Clinic', 'Both (WhatsApp & Physical)'].map(c => (
                            <label key={c} className="flex items-center gap-2 text-sm text-stone-700">
                              <input
                                type="checkbox"
                                checked={(proCard.channels || []).includes(c)}
                                onChange={() => {
                                  const list = proCard.channels || []
                                  const next = list.includes(c) ? list.filter(x => x !== c) : [...list, c]
                                  updateProField('channels', next)
                                }}
                                className="h-4 w-4 accent-tov-green"
                              />
                              {c}
                            </label>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        💰 <b>$20/Month Subscription</b> required to maintain active listing. 15% commission tracked on app bookings.
                      </p>
                    </>
                  )}

                  {acc.id === 'tier3group' && (
                    <>
                      <p className="text-xs text-stone-400">
                        Must be created by a registered Individual User who serves as the Profile Administrator.
                      </p>
                      <div className="space-y-1">
                        <label className={labelClass}>Group / Institution Type <span className="text-tov-red">*</span></label>
                        <select value={groupType} onChange={e => { setGroupType(e.target.value); setGroupData({}) }} className={inputClass}>
                          <option value="">— Select type —</option>
                          {GROUP_TYPES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                      </div>
                      {groupType === 'rehab' && (
                        <div className="space-y-3 rounded-xl bg-tov-blue-pale/60 p-3">
                          <div className="space-y-1">
                            <label className={labelClass}>Facility Name</label>
                            <input type="text" value={groupData.name || ''} onChange={e => updateGroupField('name', e.target.value)} placeholder="Facility name" className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>Ownership Tag</label>
                            <div className="flex gap-2">
                              {['Private', 'Government'].map(o => (
                                <button
                                  key={o} type="button"
                                  onClick={() => updateGroupField('ownership', o)}
                                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${groupData.ownership === o ? 'border-tov-green bg-tov-green text-white' : 'border-stone-200 bg-white text-stone-600'}`}
                                >
                                  {o}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>Care Categories</label>
                            <div className="space-y-1.5">
                              {['Inpatient Care (24/7 Residential)', 'Outpatient Programs (Day Care)', 'Medical Detoxification Facility', 'Faith-Based Rehab', 'Youth Dedicated (Under 25 — Better Brains)'].map(o => (
                                <label key={o} className="flex items-center gap-2 text-sm text-stone-700">
                                  <input type="checkbox" checked={(groupData.care || []).includes(o)} onChange={() => toggleGroupCheck('care', o)} className="h-4 w-4 accent-tov-green" />
                                  {o}
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>Total Bed Count</label>
                            <input type="number" min="0" value={groupData.beds || ''} onChange={e => updateGroupField('beds', e.target.value)} placeholder="e.g. 30" className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>On-site Licensed Psychiatrist?</label>
                            <select value={groupData.psych || ''} onChange={e => updateGroupField('psych', e.target.value)} className={inputClass}>
                              <option value="">Select…</option>
                              <option>Yes</option><option>No</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>Cost Tier</label>
                            <select value={groupData.cost || ''} onChange={e => updateGroupField('cost', e.target.value)} className={inputClass}>
                              <option value="">Select…</option>
                              <option>Low / Subsidized</option><option>Moderate</option><option>Private Premium</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>City / Town</label>
                            <input type="text" value={groupData.city || ''} onChange={e => updateGroupField('city', e.target.value)} placeholder="City" className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>Area / Neighbourhood</label>
                            <input type="text" value={groupData.area || ''} onChange={e => updateGroupField('area', e.target.value)} placeholder="Area" className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className={labelClass}>Physical Address</label>
                            <input type="text" value={groupData.address || ''} onChange={e => updateGroupField('address', e.target.value)} placeholder="Full street address" className={inputClass} />
                          </div>
                        </div>
                      )}
                      {groupType === 'clinic' && (
                        <div className="space-y-3 rounded-xl bg-tov-blue-pale/60 p-3">
                          {renderGroupFields([
                            { key: 'name', label: 'Facility Name', type: 'text', placeholder: 'Clinic name' },
                            { key: 'facilityClass', label: 'Facility Class', type: 'select', options: ['Primary Healthcare Clinic', 'Psychiatric Hospital / Clinic', 'Community Health Center', 'General Hospital'] },
                            { key: 'emergency', label: 'Emergency Line', type: 'text', placeholder: 'Emergency contact number' },
                            { key: 'address', label: 'Physical Address', type: 'text', placeholder: 'Full address' },
                          ])}
                          <div className="space-y-1">
                            <label className={labelClass}>Services Provided</label>
                            <div className="space-y-1.5">
                              {['Emergency Detox Triage', 'Mental Health Screening', 'Psychiatric Evaluation', 'Counseling'].map(o => (
                                <label key={o} className="flex items-center gap-2 text-sm text-stone-700">
                                  <input type="checkbox" checked={(groupData.services || []).includes(o)} onChange={() => toggleGroupCheck('services', o)} className="h-4 w-4 accent-tov-green" />
                                  {o}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {groupType === 'educational' && (
                        <div className="space-y-3 rounded-xl bg-tov-blue-pale/60 p-3">
                          {renderGroupFields([
                            { key: 'name', label: 'Institution Name', type: 'text', placeholder: 'School or tertiary name' },
                            { key: 'ownership', label: 'Ownership', type: 'select', options: ['Public', 'Private', 'Mission'] },
                            { key: 'enrollment', label: 'Student Enrollment Count', type: 'number', placeholder: 'Approximate' },
                            { key: 'admin', label: 'Linked Admin (Individual Account ID)', type: 'text', placeholder: 'Admin user ID reference' },
                          ])}
                        </div>
                      )}
                      {groupType === 'religious' && (
                        <div className="space-y-3 rounded-xl bg-tov-blue-pale/60 p-3">
                          {renderGroupFields([
                            { key: 'name', label: 'Entity Name', type: 'text', placeholder: 'Organization name' },
                            { key: 'type', label: 'Type', type: 'select', options: ['Church', 'Mosque', 'Local NGO', 'International Body'] },
                            { key: 'admin', label: 'Admin Contact (Individual Account ID)', type: 'text', placeholder: 'Admin user ID reference' },
                          ])}
                          <div className="space-y-1">
                            <label className={labelClass}>Active Initiatives</label>
                            <div className="space-y-1.5">
                              {['Substance Support', 'Mental Health', 'Youth Outreach'].map(o => (
                                <label key={o} className="flex items-center gap-2 text-sm text-stone-700">
                                  <input type="checkbox" checked={(groupData.initiatives || []).includes(o)} onChange={() => toggleGroupCheck('initiatives', o)} className="h-4 w-4 accent-tov-green" />
                                  {o}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {groupType === 'workplace' && (
                        <div className="space-y-3 rounded-xl bg-tov-blue-pale/60 p-3">
                          {renderGroupFields([
                            { key: 'name', label: 'Company Name', type: 'text', placeholder: 'Company name' },
                            { key: 'sector', label: 'Sector', type: 'text', placeholder: 'e.g. Finance, Tech' },
                            { key: 'size', label: 'Employee Size Range', type: 'select', options: ['1–20', '21–100', '101–500', '500+'] },
                            { key: 'admin', label: 'Wellness Program Manager (Individual Account ID)', type: 'text', placeholder: 'Admin user ID reference' },
                          ])}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {error && <p className="text-sm text-tov-red">{error}</p>}

          <button
            type="submit" disabled={saving}
            className="w-full rounded-2xl bg-tov-green py-3 text-sm font-semibold text-white transition-colors hover:bg-tov-green-light disabled:opacity-50"
          >
            {saving ? 'Creating...' : '📋 Review & Create Profile'}
          </button>

          <p className="text-center text-[11px] text-stone-400">
            By submitting, you confirm all information is accurate. All data stays on this device.
          </p>
        </form>
      </div>
    </div>
  )
}
