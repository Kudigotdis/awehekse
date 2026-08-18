const variants = {
  primary: 'bg-tov-green text-white hover:bg-tov-green/80 active:bg-tov-green/90',
  secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300',
  danger: 'bg-tov-red text-white hover:bg-tov-red/80 active:bg-tov-red/90',
  ghost: 'bg-transparent text-stone-600 hover:bg-stone-100 active:bg-stone-200',
  outline: 'border border-stone-300 text-stone-600 hover:bg-stone-50 active:bg-stone-100',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-xl',
  md: 'px-4 py-2.5 text-sm rounded-2xl',
  lg: 'px-6 py-3 text-base rounded-2xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, loading = false, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
