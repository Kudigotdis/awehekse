import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useActiveProfile } from '../../context/ProfileContext'

export default function SOSConfig() {
  const { activeProfile } = useActiveProfile()
  const existing = useLiveQuery(
    () => db.safetyPlan.get(activeProfile?.id),
    [activeProfile?.id]
  )

  const [contacts, setContacts] = useState([
    { name: '', phone: '' },
    { name: '', phone: '' },
  ])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (existing?.sosContacts) {
      setContacts(existing.sosContacts)
    }
  }, [existing])

  const update = (i, key, val) => setContacts(c => c.map((item, idx) => idx === i ? { ...item, [key]: val } : item))
  const addContact = () => { if (contacts.length < 5) setContacts(c => [...c, { name: '', phone: '' }]) }
  const removeContact = (i) => { if (contacts.length > 1) setContacts(c => c.filter((_, idx) => idx !== i)) }

  const save = async () => {
    setSaving(true)
    const validContacts = contacts.filter(c => c.name.trim() && c.phone.trim())
    await db.safetyPlan.put({
      profileId: activeProfile.id,
      ...(existing || {}),
      sosContacts: validContacts,
      updatedAt: new Date().toISOString()
    })
    setSaving(false)
    setSaved(true)
  }

  return (
    <div data-page="SOS_Config_Page" aria-label="SOS Config Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/safety-plan" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">SOS Configuration</h1>
      <p className="text-sm text-stone-500">Set up quick-access emergency contacts.</p>

      <div className="rounded-2xl bg-tov-red/5 border border-tov-red/20 p-4">
        <p className="text-xs text-tov-red">
          In an emergency, your trusted contacts can be reached quickly from your safety plan.
        </p>
      </div>

      <div className="space-y-3">
        {contacts.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-400">Contact {i + 1}</span>
              {contacts.length > 1 && (
                <button onClick={() => removeContact(i)} className="text-xs text-tov-red hover:underline">Remove</button>
              )}
            </div>
            <input value={c.name} onChange={e => update(i, 'name', e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-red focus:outline-none"
              placeholder="Contact name" />
            <input value={c.phone} onChange={e => update(i, 'phone', e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-tov-red focus:outline-none"
              placeholder="+263 7X XXX XXXX" type="tel" />
          </div>
        ))}
        {contacts.length < 5 && (
          <button onClick={addContact} className="text-xs text-tov-green hover:underline">+ Add contact</button>
        )}
      </div>

      <button onClick={save} disabled={saving}
        className="w-full rounded-2xl bg-tov-red py-3 text-sm font-semibold text-white hover:bg-tov-red/80 disabled:opacity-50">
        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save SOS Contacts'}
      </button>

      <p className="text-center text-xs text-stone-400">
        SOS contacts are stored locally and never synced.
      </p>
    </div>
  )
}
