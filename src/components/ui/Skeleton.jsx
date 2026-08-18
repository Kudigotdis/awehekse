export default function Skeleton({ className = '', count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded-2xl bg-stone-200 ${className}`} />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
      <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
      <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200" />
    </div>
  )
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
