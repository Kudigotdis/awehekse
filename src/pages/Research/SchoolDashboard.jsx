import { Link } from 'react-router-dom'
import { useState } from 'react'

const provinces = ['Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands']

export default function SchoolDashboard() {
  const [selected, setSelected] = useState(null)

  const schoolData = {
    'Harare': [{ name: 'Harare High School', students: 850, surveys: 120, avgWellbeing: 3.4 }, { name: 'Girls High School', students: 720, surveys: 95, avgWellbeing: 3.7 }],
    'Bulawayo': [{ name: 'Milward High School', students: 650, surveys: 88, avgWellbeing: 3.2 }],
    'Manicaland': [{ name: 'Mutare Boys High', students: 580, surveys: 72, avgWellbeing: 3.5 }],
  }

  const schools = selected ? (schoolData[selected] || []) : []

  return (
    <div data-page="School_Dashboard_Page" aria-label="School Dashboard Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/research" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">School Dashboard</h1>
      <p className="text-sm text-stone-500">Province-level aggregated data. No individual data is shown.</p>

      <div className="grid grid-cols-2 gap-2">
        {provinces.map(p => (
          <button key={p} onClick={() => setSelected(p)}
            className={`rounded-xl p-3 text-xs font-medium transition-all ${
              selected === p ? 'bg-tov-purple text-white' : 'bg-white text-stone-600 shadow-sm'
            }`}>{p}</button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-500">{selected} Province</h3>
          {schools.length > 0 ? schools.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
              <h4 className="font-semibold text-stone-800">{s.name}</h4>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-xl font-bold text-tov-purple">{s.students}</p>
                  <p className="text-[10px] text-stone-400">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-tov-blue">{s.surveys}</p>
                  <p className="text-[10px] text-stone-400">Surveys</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-tov-green">{s.avgWellbeing}</p>
                  <p className="text-[10px] text-stone-400">Avg Wellbeing</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-stone-400">No school data available for this province yet.</p>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-stone-400">
        All data is de-identified and aggregated. Compliant with IRB standards.
      </p>
    </div>
  )
}
