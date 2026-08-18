export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-stone-100 text-stone-600',
    green: 'bg-tov-green/10 text-tov-green',
    blue: 'bg-tov-blue/10 text-tov-blue',
    purple: 'bg-tov-purple/10 text-tov-purple',
    orange: 'bg-tov-orange/10 text-tov-orange',
    red: 'bg-tov-red/10 text-tov-red',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function ProgressRing({ value = 0, max = 100, size = 40, strokeWidth = 4, className = '' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference

  return (
    <svg width={size} height={size} className={className}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1B5E20" strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={circumference - progress}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        className="transition-all duration-500"
      />
    </svg>
  )
}
