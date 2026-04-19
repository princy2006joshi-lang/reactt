import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, firebaseReady } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const normalizedEmail = formData.email.trim().toLowerCase()
    if (!normalizedEmail || !formData.password) {
      setError('Please enter both email and password.')
      return
    }

    if (!firebaseReady) {
      setError('Login is unavailable until Firebase environment variables are configured.')
      return
    }

    setLoading(true)

    try {
      await login({ email: normalizedEmail, password: formData.password })
      navigate('/dashboard')
    } catch (submitError) {
      setError(submitError.message || 'Unable to log in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">DevTrack</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Sign in to continue your React learning plan and pick up where you left off.
        </p>

        {!firebaseReady ? (
          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
            Firebase is not configured yet. Add your VITE_FIREBASE_* environment variables to enable login.
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              placeholder="Your password"
              required
            />
          </label>

          {error ? (
            <p className="text-sm text-rose-300" role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !firebaseReady}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          No account yet?{' '}
          <Link to="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  )
}