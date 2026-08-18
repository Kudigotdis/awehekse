import { Link, useNavigate } from 'react-router-dom'

export default function BackButton({ to, className = '', label = 'Back' }) {
  const navigate = useNavigate()

  if (to) {
    return (
      <Link to={to} className={`block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99] ${className}`}>
        {label}
      </Link>
    )
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className={`block w-full rounded-xl bg-tov-blue py-3 text-center text-sm font-semibold text-white active:scale-[0.99] ${className}`}
    >
      {label}
    </button>
  )
}
