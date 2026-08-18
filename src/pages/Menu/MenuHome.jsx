import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'About',
    items: [
      { to: '/menu/participants', label: 'Participants', desc: 'The family working with us', icon: '👥' },
    ],
  },
  {
    title: 'Features',
    items: [
      { to: '/lessons', label: 'Lesson Plans', desc: 'Facilitator resources', icon: '📋' },
      { to: '/campaign', label: 'Campaign Hub', desc: 'Awareness campaigns', icon: '📢' },
      { to: '/help', label: 'Contact Directory', desc: 'Hotlines & facilities', icon: '📞' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { to: '/menu/settings', label: 'Privacy & Terms', desc: 'Settings and legal', icon: '⚙️' },
    ],
  },
]

export default function MenuHome() {
  return (
    <div data-page="Menu_Page" aria-label="Menu Page" className="space-y-6">
      {sections.map(section => (
        <section key={section.title}>
          <h3 className="mb-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">{section.title}</h3>
          <div className="space-y-2">
            {section.items.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">{item.label}</p>
                  <p className="text-xs text-stone-400">{item.desc}</p>
                </div>
                <svg className="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <p className="text-center text-xs text-stone-400">
        Aweh Ekse! v0.1.0 — Built with ❤️ by Aweh Ekse!
      </p>
    </div>
  )
}
