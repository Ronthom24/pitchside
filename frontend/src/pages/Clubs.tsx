import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Search } from 'lucide-react'
import { api } from '../lib/api'
import type { Club, Competition } from '../lib/types'
import ClubBadge from '../components/ClubBadge'
import Reveal from '../components/Reveal'

const TAGS: { tag: string; label: string }[] = [
  { tag: 'historic', label: 'Historic' }, { tag: 'attacking', label: 'Attacking' }, { tag: 'trophy-laden', label: 'Trophy-laden' },
  { tag: 'global-fanbase', label: 'Global fanbase' }, { tag: 'passionate-fanbase', label: 'Passionate fanbase' },
  { tag: 'underdog-spirit', label: 'Underdog spirit' }, { tag: 'youth-development', label: 'Youth development' }, { tag: 'modern-success', label: 'Modern success' },
]

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [comps, setComps] = useState<Competition[]>([])
  const [q, setQ] = useState('')
  const [league, setLeague] = useState('')
  const [tag, setTag] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([api.clubs(), api.competitions()]).then(([c, k]) => { setClubs(c); setComps(k) }).catch(() => setError(true))
  }, [])

  const leagues = useMemo(() => comps.filter((c) => clubs.some((x) => x.current_competition_id === c.id)), [comps, clubs])
  const filtered = clubs.filter((c) =>
    (!q || `${c.name} ${c.nickname ?? ''} ${c.city ?? ''}`.toLowerCase().includes(q.toLowerCase())) &&
    (!league || c.current_competition_id === league) && (!tag || c.identity_tags?.includes(tag)))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-2">Clubs</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">{clubs.length || ''} clubs, real histories</h1>
        </div>
        <Link to="/find-your-club" className="inline-flex items-center gap-2 rounded-full bg-grass-500 text-pitch-950 font-semibold px-5 py-2.5 hover:bg-grass-400"><Sparkles size={16} aria-hidden /> Find your club</Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <label className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-full px-4 py-2.5 w-full sm:w-72 focus-within:ring-grass-500/50">
          <Search size={15} className="text-chalk-400" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clubs, cities…" aria-label="Search clubs" className="bg-transparent outline-none text-chalk-50 placeholder:text-chalk-400 w-full" />
        </label>
        <select value={league} onChange={(e) => setLeague(e.target.value)} aria-label="Filter by league" className="bg-pitch-800 ring-1 ring-white/10 rounded-full px-4 py-2.5 text-chalk-50">
          <option value="">All leagues</option>
          {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by character">
        {TAGS.map((t) => (
          <button key={t.tag} onClick={() => setTag(tag === t.tag ? '' : t.tag)} aria-pressed={tag === t.tag}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ring-1 transition-colors ${tag === t.tag ? 'bg-grass-500 text-pitch-950 ring-grass-400' : 'ring-white/15 text-chalk-200 hover:bg-white/5'}`}>{t.label}</button>
        ))}
      </div>

      {error && <p className="text-chalk-300">Couldn't load clubs. Is the API running?</p>}
      <p className="text-sm text-chalk-400 mb-4" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'club' : 'clubs'}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 0.04}>
            <Link to={`/clubs/${c.id}`} className="surface surface-hover p-4 flex items-center gap-4 h-full">
              <ClubBadge club={c} size={52} />
              <div className="min-w-0">
                <p className="font-semibold text-chalk-50 truncate">{c.name}</p>
                <p className="text-xs text-chalk-400 truncate">{[c.nickname, c.city].filter(Boolean).join(' · ')}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      {!error && filtered.length === 0 && clubs.length > 0 && <p className="text-chalk-400 mt-6">No clubs match those filters.</p>}
    </div>
  )
}
