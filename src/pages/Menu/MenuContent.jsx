import { useParams } from 'react-router-dom'
import { menuPages } from '../../data/menu-pages'
import BackButton from '../../components/ui/BackButton'

export default function MenuContent() {
  const { slug } = useParams()
  const page = menuPages[slug]

  if (!page) {
    return (
      <div data-page="Menu_Content_Page" aria-label="Menu Content Page" className="py-16 text-center">
        <p className="text-stone-500">Page not found.</p>
        <BackButton to="/menu" />
      </div>
    )
  }

  return (
    <div data-page="Menu_Content_Page" aria-label="Menu Content Page" className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-tov-green to-tov-green-light p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold">{page.title}</h1>
        <p className="mt-2 text-sm text-white/85">{page.intro}</p>
      </div>

      {page.sections.map(section => (
        <div key={section.heading} className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-stone-800">{section.heading}</h2>
          {section.body && <p className="mt-2 text-sm text-stone-600">{section.body}</p>}
          {section.rows && (
            <dl className="mt-3 space-y-2">
              {section.rows.map(([k, v]) => (
                <div key={k} className="border-t border-stone-100 pt-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">{k}</dt>
                  <dd className="mt-0.5 text-sm text-stone-700">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {section.list && (
            <ul className="mt-3 space-y-3">
              {section.list.map(([title, body]) => (
                <li key={title} className="rounded-xl bg-stone-50 p-3.5">
                  <p className="text-sm font-semibold text-stone-800">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">{body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <BackButton to="/menu" />
    </div>
  )
}
