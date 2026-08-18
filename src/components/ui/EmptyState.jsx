export default function EmptyState({ icon = '📭', title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-stone-800">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-stone-500">{description}</p>
      )}
      {action && onAction && (
        <button onClick={onAction} className="mt-4 rounded-2xl bg-tov-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-tov-green/80">
          {action}
        </button>
      )}
    </div>
  )
}
