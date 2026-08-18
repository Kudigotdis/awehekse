import { useState } from 'react'
import { Link } from 'react-router-dom'
import { termsOfService, privacyPolicy } from '../../data/legal'
import BackButton from '../../components/ui/BackButton'
import useRegionFilter from '../../hooks/useRegionFilter'

function SectionBody({ section }) {
  return (
    <div className="space-y-3">
      {section.body && <p className="text-sm leading-relaxed text-stone-600">{section.body}</p>}
      {section.bullets && (
        <ul className="list-disc space-y-1.5 pl-5">
          {section.bullets.map((b, i) => (
            <li key={i} className="text-sm leading-relaxed text-stone-600">{b}</li>
          ))}
        </ul>
      )}
      {section.extra && <p className="text-sm leading-relaxed text-stone-600">{section.extra}</p>}
      {section.extra2 && <p className="text-sm leading-relaxed text-stone-600">{section.extra2}</p>}
      {section.contact && (
        <div className="rounded-xl bg-stone-50 p-3.5 text-sm leading-relaxed text-stone-700">
          {section.contact.name && <p className="font-semibold text-stone-800">{section.contact.name}</p>}
          {section.contact.attn && <p>{section.contact.attn}</p>}
          {section.contact.address && <p>{section.contact.address}</p>}
          {section.contact.details && <p>{section.contact.details}</p>}
        </div>
      )}
      {section.subSections && (
        <div className="space-y-3">
          {section.subSections.map(sub => (
            <div key={sub.heading} className="rounded-xl border border-stone-100 p-3.5">
              <p className="text-sm font-semibold text-stone-800">{sub.heading}</p>
              {sub.body && <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{sub.body}</p>}
              {sub.bullets && (
                <ul className="mt-1.5 list-disc space-y-1.5 pl-5">
                  {sub.bullets.map((b, i) => (
                    <li key={i} className="text-sm leading-relaxed text-stone-600">{b}</li>
                  ))}
                </ul>
              )}
              {sub.extra && <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{sub.extra}</p>}
              {sub.extra2 && <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{sub.extra2}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const { region } = useRegionFilter()
  const [openAcc, setOpenAcc] = useState(null)
  const [openSection, setOpenSection] = useState(null)

  const docs = [
    { id: 'terms', label: 'Terms Of Service', doc: termsOfService },
    { id: 'privacy', label: 'Privacy Policy', doc: privacyPolicy },
  ]

  return (
    <div data-page="Privacy_Terms_Page" aria-label="Privacy and Terms Page" className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Privacy &amp; Terms</h1>
        <p className="mt-1 text-sm text-stone-500">How your data is handled.</p>
      </div>

      {region === 'BW' && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-bold text-purple-800">Botswana Legal Framework</p>
          <p className="mt-1 text-xs text-purple-600">For Botswana-specific laws on substances, mental health, and rehabilitation, see the Laws section in the Library.</p>
          <Link to="/aweh/library/laws"
            className="mt-2 inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700">
            View Botswana Laws
          </Link>
        </div>
      )}

      {docs.map(acc => {
        const isOpen = openAcc === acc.id
        return (
          <div key={acc.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenAcc(isOpen ? null : acc.id)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="font-semibold text-stone-800">{acc.label}</span>
            </button>
            {isOpen && (
              <div className="border-t border-stone-100 p-4">
                {acc.doc.notice && (
                  <div className="mb-3 rounded-r-xl border-l-4 border-tov-red bg-red-50 p-3.5 text-xs leading-relaxed text-red-900">
                    {acc.doc.notice}
                  </div>
                )}
                <div className="mb-4 rounded-2xl bg-stone-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">{acc.doc.subtitle}</p>
                  <h2 className="mt-1 text-lg font-bold text-stone-800">{acc.doc.title}</h2>
                  <p className="text-xs text-stone-500">{acc.doc.effective}</p>
                </div>
                <div className="space-y-2">
                  {acc.doc.sections.map((section, idx) => {
                    const isSectionOpen = openAcc === acc.id && openSection === idx
                    return (
                      <div key={section.heading} className="overflow-hidden rounded-xl border border-stone-100">
                        <button
                          type="button"
                          onClick={() => setOpenSection(isSectionOpen ? null : idx)}
                          className="flex w-full items-center justify-between px-3.5 py-3 text-left"
                        >
                          <span className="text-sm font-semibold text-stone-800">{section.heading}</span>
                        </button>
                        {isSectionOpen && (
                          <div className="border-t border-stone-100 p-3.5">
                            <SectionBody section={section} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}

      <BackButton to="/menu" />
    </div>
  )
}
