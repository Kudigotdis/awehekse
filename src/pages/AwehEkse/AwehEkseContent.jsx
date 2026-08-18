import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { awehEksePages, awehEkseTalkingScripts } from '../../data/aweh-ekse'
import BackButton from '../../components/ui/BackButton'
import awehEkseLogo from '../../assets/aweh_ekse_logo_2.png'

const PAGE_NAMES = {
  about: 'About_Page',
  mission: 'Mission_Page',
  unvertising: 'Unvertising_Page',
  'cost-counts': 'Cost_Counts_Page',
  'better-brains': 'Better_Brains_Page',
  'endless-exposure': 'Endless_Exposure_Page',
  'reduce-repetition': 'Reduce_Repetition_Page',
  communication: 'Communication_Page',
}

const ACCENT_STYLES = [
  { bg: 'bg-purple-50', border: 'border-purple-200', title: 'text-purple-900', sub: 'text-purple-600' },
  { bg: 'bg-lime-50', border: 'border-lime-200', title: 'text-lime-900', sub: 'text-lime-600' },
  { bg: 'bg-rose-50', border: 'border-rose-200', title: 'text-rose-900', sub: 'text-rose-600' },
  { bg: 'bg-orange-50', border: 'border-orange-200', title: 'text-orange-900', sub: 'text-orange-600' },
  { bg: 'bg-sky-50', border: 'border-sky-200', title: 'text-sky-900', sub: 'text-sky-600' },
]

function Block({ block, accent }) {
  switch (block.type) {
    case 'para':
      return <p className="text-sm leading-relaxed text-stone-600">{block.text}</p>
    case 'card':
      return (
        <div className={`rounded-xl border ${accent.border} ${accent.bg} p-3.5`}>
          {block.heading && <h4 className={`text-sm font-semibold ${accent.title}`}>{block.heading}</h4>}
          {block.text && <p className="mt-1 text-xs leading-relaxed text-stone-600">{block.text}</p>}
        </div>
      )
    case 'callout':
      return (
        <div className={`rounded-r-xl border-l-4 border-stone-400 bg-stone-100 p-3.5 text-xs leading-relaxed text-stone-700`}>
          {block.text}
        </div>
      )
    case 'quote':
      return (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3.5 text-center">
          {block.heading && <h4 className={`text-sm font-bold ${accent.title}`}>{block.heading}</h4>}
          {block.text && <p className="mt-1 text-xs italic text-stone-600">{block.text}</p>}
        </div>
      )
    case 'chips':
      return (
        <div className="flex flex-wrap gap-1.5">
          {block.items.map(chip => (
            <span key={chip} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${accent.bg} ${accent.title}`}>
              {chip}
            </span>
          ))}
        </div>
      )
    case 'compare':
      return (
        <div className={`grid grid-cols-2 gap-2 rounded-xl border ${accent.border} p-3`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wide ${accent.title}`}>{block.left.split(' ')[0] || block.label}</p>
            <p className="mt-0.5 text-xs text-stone-700">{block.left}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-red-600">Endless Exposure</p>
            <p className="mt-0.5 text-xs text-stone-700">{block.right}</p>
          </div>
        </div>
      )
    case 'starter':
      return (
        <div className={`rounded-xl border ${accent.border} bg-white p-3.5`}>
          <p className="text-xs leading-relaxed text-stone-700">{block.text}</p>
        </div>
      )
    case 'scene':
      return (
        <div className="rounded-xl border border-stone-200 bg-white p-3.5">
          {block.label && <p className={`text-[11px] font-bold uppercase tracking-wide ${accent.title}`}>{block.label}</p>}
          {block.text && <p className="mt-0.5 text-xs text-stone-600">{block.text}</p>}
        </div>
      )
    case 'dodont':
      return (
        <div className="rounded-xl border border-stone-200 bg-white p-3.5">
          <p className="text-xs text-red-700 line-through">{block.dont}</p>
          <p className="mt-1.5 text-xs font-semibold text-tov-green">{block.do}</p>
        </div>
      )
    case 'method':
      return (
        <div className="rounded-xl bg-stone-50 p-3.5">
          <p className={`text-sm font-semibold ${accent.title}`}>{block.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-stone-600">{block.text}</p>
        </div>
      )
    default:
      return null
  }
}

function AccordionGroup({ page }) {
  const [open, setOpen] = useState(page.accordions.length ? 0 : null)
  const isCommunication = page.title.toLowerCase().includes('communicate')

  return (
    <div className="space-y-3">
      {page.accordions.map((acc, idx) => {
        const isOpen = open === idx
        const accent = ACCENT_STYLES[idx % ACCENT_STYLES.length]
        return (
          <div key={`${acc.title}-${idx}`} className={`overflow-hidden rounded-2xl bg-white shadow-sm`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              className={`flex w-full flex-col items-start border px-4 py-3.5 text-left ${accent.bg} ${accent.border}`}
            >
              <span className={`text-sm font-bold tracking-wide ${accent.title}`}>{acc.title}</span>
              {acc.subtitle && <span className={`mt-0.5 text-[11px] font-medium ${accent.sub}`}>{acc.subtitle}</span>}
            </button>
            {isOpen && (
              <div className="space-y-3 border-t border-stone-200 bg-white p-4">
                {acc.blocks.length === 0 && (
                  <p className="text-xs text-stone-400">Details open in the interactive version.</p>
                )}
                {acc.blocks.map((b, bi) => (
                  <Block key={bi} block={b} accent={accent} />
                ))}
                {isCommunication && acc.title.toLowerCase().includes('talking point') && !acc.title.includes('Generator') && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Quick scripts</p>
                    {awehEkseTalkingScripts.map(s => (
                      <div key={s.topic} className="rounded-xl border border-stone-200 p-3.5">
                        <p className="text-xs font-semibold text-stone-700">{s.emoji} {s.topic}</p>
                        <ul className="mt-2 space-y-1">
                          {s.steps.map((step, si) => (
                            <li key={si} className="text-xs leading-relaxed text-stone-600">{step}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AwehEkseContent() {
  const { slug } = useParams()
  const page = awehEksePages[slug]
  const pageName = PAGE_NAMES[slug]

  if (!page) {
    return (
      <div data-page="Page_Not_Found" aria-label="Page Not Found" className="py-16 text-center">
        <p className="text-stone-500">Page not found.</p>
        <BackButton to="/aweh" />
      </div>
    )
  }

  return (
    <div data-page={pageName} aria-label={`${page.title || pageName} Page`} className="space-y-4">
      <div className={slug === 'about' ? 'Title_Box' : 'rounded-2xl bg-gradient-to-br from-tov-blue to-tov-blue-light p-6 text-white shadow-sm'}>
        {slug === 'about' ? (
          <img src={awehEkseLogo} alt="Aweh Ekse" className="mx-auto w-56" />
        ) : (
          <>
            <h1 className="text-2xl font-bold">{page.title}</h1>
            {page.subtitle && <p className="mt-1 text-sm text-white/80">{page.subtitle}</p>}
          </>
        )}
      </div>

      {page.splash && (
        <div className="rounded-xl border-l-4 border-tov-blue bg-stone-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Splash statement</p>
          <p className="mt-1 text-sm font-medium text-stone-800">{page.splash}</p>
        </div>
      )}

      <AccordionGroup page={page} />

      <BackButton to="/aweh" />
    </div>
  )
}
