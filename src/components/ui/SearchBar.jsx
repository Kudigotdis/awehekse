import { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search...', className = '' }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => { setValue(e.target.value); if (!e.target.value) onSearch('') }}
        className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm placeholder:text-stone-400 focus:border-tov-green focus:outline-none focus:ring-1 focus:ring-tov-green/20"
        placeholder={placeholder}
      />
      {value && (
        <button type="button" onClick={() => { setValue(''); onSearch('') }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  )
}
