import BackButton from '../../components/ui/BackButton'

export default function ParticipantPlaceholder({ title, desc }) {
  return (
    <div data-page="Participant_Group_Page" aria-label={`${title} Page`} className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-tov-blue to-tov-blue-light p-6 text-white shadow-sm">
        <span className="text-3xl">🤝</span>
        <h1 className="mt-2 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-white/85">{desc}</p>
      </div>

      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-medium text-stone-800">Partners joining soon</p>
        <p className="mt-1 text-xs text-stone-400">
          We are building this directory. Check back as partners are added.
        </p>
      </div>

      <BackButton to="/menu/participants" />
    </div>
  )
}
