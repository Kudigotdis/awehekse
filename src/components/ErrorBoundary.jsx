import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-stone-50 px-4 text-center">
          <span className="text-5xl">⚠️</span>
          <h1 className="mt-4 text-xl font-bold text-stone-800">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-sm text-stone-500">
            The app encountered an unexpected error. Don't worry — your data is safe on this device.
          </p>
          <p className="mt-3 max-w-md rounded-xl bg-stone-100 p-3 text-xs text-stone-400 font-mono break-all">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-2xl bg-tov-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-tov-green/80">
              Try Again
            </button>
            <Link to="/" className="rounded-2xl border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100">
              Go Home
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
