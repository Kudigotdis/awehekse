import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function DataExport() {
  const [exported, setExported] = useState(null)

  const exportData = async (type) => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    doc.setFontSize(14)
    doc.text(`Aweh Ekse! - ${type} Export`, 20, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30)
    doc.text('This data is de-identified and aggregated.', 20, 40)

    doc.text(`Report Type: ${type}`, 20, 55)
    doc.text('Note: All personal identifiers have been removed.', 20, 65)

    doc.save(`awehekse-${type.toLowerCase().replace(/\s+/g, '-')}-export.pdf`)
    setExported(type)
  }

  return (
    <div data-page="Data_Export_Page" aria-label="Data Export Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/research" className="text-sm text-tov-purple hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Export Data</h1>
      <p className="text-sm text-stone-500">Download de-identified datasets for research.</p>

      <div className="rounded-2xl bg-tov-purple/5 border border-tov-purple/20 p-4">
        <p className="text-xs text-tov-purple">
          All exports are de-identified. No personal information, device IDs, or IP addresses are included.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { type: 'Mood Trends', desc: 'Aggregated mood data across profiles' },
          { type: 'Survey Results', desc: 'De-identified survey responses' },
          { type: 'Campaign Impact', desc: 'Attendance and engagement metrics' },
          { type: 'Habit Patterns', desc: 'Anonymized habit tracking data' },
        ].map(({ type, desc }) => (
          <div key={type} className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-medium text-stone-800">{type}</h3>
            <p className="text-xs text-stone-400">{desc}</p>
            <button onClick={() => exportData(type)}
              className={`mt-3 w-full rounded-xl py-2.5 text-xs font-medium transition-all ${
                exported === type ? 'bg-tov-green/10 text-tov-green' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}>
              {exported === type ? '✓ Downloaded' : 'Export PDF'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-stone-400">
        Data collection follows IRB-approved protocols.
      </p>
    </div>
  )
}
