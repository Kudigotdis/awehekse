import { Link } from 'react-router-dom'
import awehEkseLogo from '../../assets/aweh_ekse_logo_2_gradient.png'

const pageLinks = [
  { to: '/aweh/mission', label: 'Mission', page: 'Mission_Page', desc: 'Why we exist' },
  { to: '/aweh/unvertising', label: 'Unvertising', page: 'Unvertising_Page', desc: 'Unmask · Unplug · Unlearn' },
  { to: '/aweh/contributors', label: 'Creative Contributors', page: 'Creative_Contributors', desc: 'Artists re-engineering the subconscious' },
  { to: '/aweh/cost-counts', label: 'Cost Counts', page: 'Cost_Counts_Page', desc: 'Addiction affects every class' },
  { to: '/aweh/better-brains', label: 'Better Brains', page: 'Better_Brains_Page', desc: 'The under-25 brain' },
  { to: '/aweh/endless-exposure', label: 'Endless Exposure', page: 'Endless_Exposure_Page', desc: 'Why exposure damages' },
  { to: '/aweh/reduce-repetition', label: 'Reduce Repetition', page: 'Reduce_Repetition_Page', desc: 'The power of repetition' },
  { to: '/aweh/communication', label: 'Communication', page: 'Communication_Page', desc: 'Conversate — talking points' },
]

const toolItems = [
  { to: '/aweh/library', label: 'Library', page: 'Library_Page', desc: 'Substances, contents, health, rehab, laws' },
  { to: '/aweh/wellness', label: 'Wellness', page: 'Wellness_Page', desc: 'Rehab Check & Habit Check' },
  { to: '/aweh/polls', label: 'Polls', page: 'Polls_Page', desc: 'Data summary' },
]

const buttonColours = [
  '#ef4444', // red
  '#782919', // brown
  '#22c55e', // green
  '#eab308', // yellow
  '#14b8a6', // turquoise
  '#f97316', // orange
  '#ec4899', // hot pink
  '#7dd3fc', // baby blue
  '#dc2626', // cherry
]

function buttonStyle(index) {
  const colour = buttonColours[index % buttonColours.length]
  return {
    border: `3px solid ${colour}80`,
    backgroundColor: '#fff',
    color: colour,
  }
}

export default function AwehEkseHome() {
  return (
    <div data-page="Aweh_Ekse_Page" aria-label="Aweh Ekse Page" className="space-y-4">
      <img
        src={awehEkseLogo}
        alt="Aweh Ekse"
        className="mx-auto w-64"
      />

      <div className="space-y-3">
        {pageLinks.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            data-page={item.page}
            aria-label={item.label}
            style={buttonStyle(index)}
            className="flex flex-col rounded-2xl p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
          >
            <p className="font-semibold">{item.label}</p>
            <p className="text-xs opacity-70">{item.desc}</p>
          </Link>
        ))}
      </div>

      <section className="-mx-4 flex min-h-[70dvh] flex-col bg-[#f1431a] px-4 pb-28 -mb-24 pt-4">
        <div className="space-y-3">
          {toolItems.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              data-page={item.page}
              aria-label={item.label}
              style={buttonStyle((index + pageLinks.length) % buttonColours.length)}
              className="flex flex-col rounded-2xl p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <p className="font-semibold">{item.label}</p>
              <p className="text-xs opacity-70">{item.desc}</p>
            </Link>
          ))}
        </div>

        <Link
          to="/aweh/help"
          data-page="Help_Button"
          className="mt-8 block w-full rounded-2xl border-2 border-white py-4 text-center text-sm font-bold text-white shadow-md active:scale-[0.99]"
        >
          Help!
        </Link>
      </section>
    </div>
  )
}
