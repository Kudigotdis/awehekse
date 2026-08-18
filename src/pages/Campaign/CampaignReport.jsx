import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../core/db/schema'
import { useState } from 'react'

export default function CampaignReport() {
  const events = useLiveQuery(() => db.campaignEvents.toArray()) || []
  const campaigns = useLiveQuery(() => db.campaigns.toArray()) || []
  const [format, setFormat] = useState('summary')

  const totalAttendance = events.reduce((s, e) => s + (e.attendanceCount || 0), 0)
  const totalEvents = events.length

  const generateReport = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Aweh Ekse! Campaign Report', 20, 20)
    doc.setFontSize(11)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30)
    doc.text(`Total Events: ${totalEvents}`, 20, 45)
    doc.text(`Total Attendance: ${totalAttendance}`, 20, 55)
    doc.text(`Active Campaigns: ${campaigns.filter(c => c.active).length}`, 20, 65)

    let y = 85
    doc.setFontSize(13)
    doc.text('Event Summary', 20, y)
    y += 10
    doc.setFontSize(10)
    events.slice(0, 15).forEach(e => {
      doc.text(`${e.title} - ${e.date} - ${e.attendanceCount || 0} attendees`, 20, y)
      y += 8
    })

    doc.save('awehekse-campaign-report.pdf')
  }

  return (
    <div data-page="Campaign_Report_Page" aria-label="Campaign Report Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/campaign" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Impact Report</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-tov-green/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-green">{totalEvents}</p>
          <p className="text-xs text-stone-500">Total Events</p>
        </div>
        <div className="rounded-2xl bg-tov-blue/10 p-4 text-center">
          <p className="text-3xl font-bold text-tov-blue">{totalAttendance}</p>
          <p className="text-xs text-stone-500">People Reached</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
        <h3 className="font-semibold text-stone-800">Report Format</h3>
        {['summary', 'detailed', 'export'].map(f => (
          <button key={f} onClick={() => setFormat(f)}
            className={`w-full rounded-xl p-3 text-left text-sm transition-all ${
              format === f ? 'bg-tov-green/10 border border-tov-green/30 text-tov-green font-medium' : 'bg-stone-50 border border-transparent text-stone-600'
            }`}>
            {f === 'summary' ? 'Quick Summary' : f === 'detailed' ? 'Detailed Report' : 'Export to PDF'}
          </button>
        ))}
      </div>

      <button onClick={generateReport}
        className="w-full rounded-2xl bg-tov-green py-3 text-sm font-semibold text-white hover:bg-tov-green/80">
        Generate Report
      </button>
    </div>
  )
}
