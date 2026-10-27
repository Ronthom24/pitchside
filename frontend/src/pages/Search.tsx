import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { SearchResults } from '../lib/types'
import { TACTICS } from '../content/tactics'

export default function Search() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim()
  const [results, setResults] = useState<SearchResults | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setResults(null); setError(false)
    if (q.length >= 2) api.search(q).then(setResults).catch(() => setError(true))
  }, [q])

  const tactics = TACTICS.filter((t) => `${t.name} ${t.short}`.toLowerCase().includes(q.toLowerCase()))

  const groups: { label: string; items: { key: string; to: string; title: string; sub?: string | null }[] }[] = results ? [
    { label: 'Clubs', items: results.clubs.map((c) => ({ key: c.id, to: `/clubs/${c.id}`, title: c.name, sub: [c.nickname, c.city].filter(Boolean).join(' · ') })) },
    { label: 'Players', items: results.players.map((p) => ({ key: p.id, to: `/players/${p.id}`, title: p.name, sub: p.position })) },
    { label: 'Competitions', items: results.competitions.map((c) => ({ key: c.id, to: `/competitions/${c.id}`, title: c.name })) },
    { label: 'Tactics', items: tactics.map((t) => ({ key: t.id, to: `/tactics/${t.id}`, title: t.name, sub: t.short })) },
    { label: 'Lessons', items: results.lessons.map((l) => ({ key: l.id, to: `/learn/${l.id}`, title: l.title, sub: l.summary })) },
    { label: 'Glossary', items: results.glossary.map((g) => ({ key: g.id, to: `/glossary#${g.id}`, title: g.term, sub: g.short_definition })) },
    { label: 'History', items: results.history.map((h) => ({ key: h.id, to: '/history', title: `${h.year}: ${h.title}` })) },
  ].filter((g) => g.items.length) : []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="eyebrow mb-2">Search</p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-8">{q ? <>Results for "{q}"</> : 'Search Pitchside'}</h1>
      {q.length < 2 && <p className="text-chalk-400">Type at least two letters in the search box above.</p>}
      {error && <p className="text-chalk-300">Search failed. Is the API running?</p>}
      {q.length >= 2 && !results && !error && <p className="text-chalk-400">Searching…</p>}
      {results && groups.length === 0 && <p className="text-chalk-400">Nothing found for "{q}". Try a club, player, competition or football term.</p>}
      {groups.map((g) => (
        <section key={g.label} className="mb-8" aria-label={g.label}>
          <h2 className="eyebrow mb-3">{g.label} <span className="text-chalk-400 font-normal">({g.items.length})</span></h2>
          <div className="surface divide-y divide-white/8 overflow-hidden">
            {g.items.map((it) => (
              <Link key={it.key} to={it.to} className="block px-4 py-3 hover:bg-white/5 transition-colors">
                <span className="text-chalk-50 font-medium">{it.title}</span>
                {it.sub && <span className="block text-sm text-chalk-400 truncate">{it.sub}</span>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
