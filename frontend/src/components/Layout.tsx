import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, Menu, X, User } from 'lucide-react'
import { useMe } from '../lib/me'
import { ACCOUNTS_ENABLED } from '../lib/flags'

const NAV = [
  { to: '/learn', label: 'Learn' },
  { to: '/positions', label: 'Positions' },
  { to: '/formations', label: 'Formations' },
  { to: '/tactics', label: 'Tactics' },
  { to: '/clubs', label: 'Clubs' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/players', label: 'Players' },
  { to: '/history', label: 'History' },
  { to: '/glossary', label: 'Glossary' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { user } = useMe()

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); setOpen(false) }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-grass-500 text-pitch-950 px-3 py-2 rounded-lg">Skip to content</a>
      <header className="sticky top-0 z-40 bg-pitch-950/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="font-display text-xl font-bold tracking-tight text-chalk-50 shrink-0">
            Pitch<span className="text-grass-500">side</span>
          </Link>
          <nav className="hidden xl:flex items-center gap-0.5 flex-1" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) => `px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-grass-500/15 text-grass-400' : 'text-chalk-200 hover:text-chalk-50 hover:bg-white/5'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <form onSubmit={submitSearch} role="search" className="hidden md:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 ml-auto w-52 focus-within:ring-1 focus-within:ring-grass-500/50">
            <Search size={15} className="text-chalk-400 shrink-0" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Pitchside" aria-label="Search"
              className="bg-transparent outline-none text-sm text-chalk-50 placeholder:text-chalk-400 w-full" />
          </form>
          <Link to={user || !ACCOUNTS_ENABLED ? '/my-pitchside' : '/account'}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-grass-500 text-pitch-950 text-sm font-semibold px-4 py-2 hover:bg-grass-400 transition-colors shrink-0">
            <User size={15} aria-hidden /> {user || !ACCOUNTS_ENABLED ? 'My Pitchside' : 'Sign in'}
          </Link>
          <button className="xl:hidden text-chalk-50 ml-auto md:ml-0 p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="xl:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1 bg-pitch-950">
            <form onSubmit={submitSearch} role="search" className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-2 mb-2">
              <Search size={15} className="text-chalk-400" aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Pitchside" aria-label="Search" className="bg-transparent outline-none text-sm text-chalk-50 w-full" />
            </form>
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-chalk-200 hover:bg-white/5">{n.label}</NavLink>
            ))}
            <Link to={user || !ACCOUNTS_ENABLED ? '/my-pitchside' : '/account'} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-grass-400 font-semibold">
              {user || !ACCOUNTS_ENABLED ? 'My Pitchside' : 'Sign in / Create account'}
            </Link>
          </div>
        )}
      </header>
      <main id="main" className="flex-1">{children}</main>
      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-6 sm:grid-cols-3 text-sm text-chalk-400">
          <div>
            <p className="font-display text-lg text-chalk-50 mb-1">Pitch<span className="text-grass-500">side</span></p>
            <p>Football, explained. Learn the game, discover its world, find your club.</p>
          </div>
          <div>
            <p className="text-chalk-200 font-semibold mb-2">Explore</p>
            <div className="flex flex-col gap-1">
              <Link to="/learn" className="hover:text-chalk-50">Learn</Link>
              <Link to="/find-your-club" className="hover:text-chalk-50">Find your club</Link>
              <Link to="/history" className="hover:text-chalk-50">History</Link>
            </div>
          </div>
          <div>
            <p className="text-chalk-200 font-semibold mb-2">About the data</p>
            <p>Fixtures and tables come from football-data.org when configured. Club badges are generated from club colours; Pitchside is not affiliated with any club or league.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
