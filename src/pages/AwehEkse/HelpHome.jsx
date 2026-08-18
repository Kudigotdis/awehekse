import { Link } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'

export default function HelpHome() {
  return (
    <div data-page="Help_Page" aria-label="Help Page" className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-tov-blue-light p-6 text-center text-white shadow-sm">
        <h1 className="text-2xl font-extrabold">You're not alone.</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/80">
          Let's figure this out together. Private, 5 minutes, no diagnosis — just clear next steps.
        </p>
        <p className="mt-3 text-xs text-white/70">
          Emergency? Call <strong className="text-white">ZRP 999</strong> | Child Helpline <strong className="text-white">116</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/aweh/help/wizard"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-tov-red p-5 text-center text-white shadow-sm active:scale-[0.99]"
        >
          <span className="text-2xl">🧍</span>
          <span className="text-sm font-bold">Check Myself</span>
          <small className="text-xs text-white/80">I'm concerned about me</small>
        </Link>
        <Link
          to="/aweh/help/wizard"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-tov-orange p-5 text-center text-white shadow-sm active:scale-[0.99]"
        >
          <span className="text-2xl">👥</span>
          <span className="text-sm font-bold">Check Someone I Know</span>
          <small className="text-xs text-white/80">Friend, family, student</small>
        </Link>
      </div>

      <Link
        to="/help/rehab"
        className="block rounded-2xl bg-white p-5 shadow-sm active:scale-[0.99]"
      >
        <h2 className="text-lg font-bold text-stone-800">Learn About Rehab</h2>
        <p className="mt-1 text-xs text-stone-500">What it is, how it works, when to go, and where to find help.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['What is Rehab', 'How Commission Works', 'When', 'Why', 'Where'].map(tag => (
            <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              {tag}
            </span>
          ))}
        </div>
      </Link>

      <div className="rounded-2xl border border-tov-blue/20 bg-tov-blue/5 p-5">
        <h2 className="text-sm font-bold text-stone-800">Need immediate help?</h2>
        <p className="mt-1 text-xs text-stone-600">If you or someone you know is in crisis, call now:</p>
        <div className="mt-3 flex gap-3">
          <a href="tel:999" className="flex-1 rounded-xl bg-tov-red py-3 text-center text-sm font-bold text-white">
            📞 999
          </a>
          <a href="tel:116" className="flex-1 rounded-xl bg-tov-blue py-3 text-center text-sm font-bold text-white">
            📞 116
          </a>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-800">Other ways to get help</h2>
        <div className="mt-3 space-y-2">
          <Link to="/help/hotlines" className="flex items-center justify-between rounded-xl bg-stone-50 p-3">
            <span className="text-sm font-medium text-stone-700">Hotlines</span>
          </Link>
          <Link to="/help/rehab" className="flex items-center justify-between rounded-xl bg-stone-50 p-3">
            <span className="text-sm font-medium text-stone-700">Rehab Directory</span>
          </Link>
        </div>
      </div>

      <BackButton to="/aweh" />
    </div>
  )
}
