import { Link } from 'react-router-dom'

export default function FacilitationGuide() {
  return (
    <div data-page="Facilitation_Guide_Page" aria-label="Facilitation Guide Page" className="space-y-6">
      <Link to="/lessons" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      <h1 className="text-2xl font-bold text-stone-800">Facilitation Guide</h1>
      <p className="text-sm text-stone-500">Tips for running effective sessions.</p>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        {[
          { title: 'Create a Safe Space', desc: 'Establish ground rules: respect, confidentiality, no judgement.' },
          { title: 'Use Local Examples', desc: 'Reference Zimbabwean contexts — brands, places, cultural norms.' },
          { title: 'Be Trauma-Informed', desc: 'Some participants may have personal experiences. Never force sharing.' },
          { title: 'Use Interactive Methods', desc: 'Role-plays, group work, and polls work better than lectures.' },
          { title: 'End with Hope', desc: 'Always close with recovery stories and available support.' },
        ].map(({ title, desc }, i) => (
          <div key={i}>
            <h3 className="font-medium text-stone-800">{i + 1}. {title}</h3>
            <p className="mt-1 text-sm text-stone-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
