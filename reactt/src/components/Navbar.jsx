import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, profile, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link to="/dashboard" className="text-lg font-semibold tracking-tight text-white">
            DevTrack
          </Link>
          <p className="text-xs text-slate-400">React learning planner</p>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-100">
                  {profile?.displayName || user.email}
                </p>
                <p className="text-xs text-slate-400">Signed in account</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out of your account"
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}