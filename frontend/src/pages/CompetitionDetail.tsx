import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Competition, Club, Standings, LiveMatches } from '../lib/types'
import ClubBadge from '../components/ClubBadge'
import LivePanel, { Unavailable } from '../components/LivePanel'
import { Freshness } from '../components/Freshness'

type Tab = 'overview' | 'table' | 'fixtures' | 'clubs'

export default function CompetitionDetail() {
  const { id } = useParams()
  const [comp, setComp] = useState<Competition | null>(null)
  const [clubs, setClubs] = useState<Club[]>([])
  const [standings, setStandings] = useState<Standings | null>(null)
  const [matches, setMatches] = useState<LiveMatches | null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setComp(null); setError(false); setTab('overview'); setStandings(null); setMatches(null)
    api.competition(id).then(setComp).catch(() => setError(true))
    api.competitionClubs(id).then(setClubs).catch(() => setClubs([]))
  }, [id])

  useEffect(() => {
    if (!id || !comp) return
    if (tab === 'table' && !standings) api.standings(id).then(setStandings).catch(() => {})
    if (tab === 'fixtures' && !matches) api.competitionMatches(id).then(setMatches).catch(() => {})
  }, [tab, id, comp, standings, matches])

  if (error) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-300">That competition couldn't be found. <Link to="/competitions" className="text-grass-400">See all competitions</Link></div>
  if (!comp) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-400">Loading…</div>

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'overview', label: 'Overview', show: true },
    { key: 'table', label: 'Table', show: comp.category === 'domestic_league' || comp.live_data_available },
    { key: 'fixtures', label: 'Fixtures and results', show: comp.live_data_available },
    { key: 'clubs', label: 'Clubs', show: clubs.length > 0 },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <Link to="/competitions" className="text-sm text-chalk-400 hover:text-chalk-50">← All competitions</Link>
      <p className="eyebrow mt-5 mb-2">{comp.category.replace('_', ' ')}</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold">{comp.name}</h1>
      {comp.founded_year && <p className="text-chalk-400 mt-2">Since {comp.founded_year}</p>}

      <div className="mt-8 flex gap-1 border-b border-white/10 overflow-x-auto scrollbar-none" role="tablist">
        {tabs.filter((t) => t.show).map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t.key ? 'border-grass-500 text-chalk-50' : 'border-transparent text-chalk-400 hover:text-chalk-200'}`}>{t.label}</button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'overview' && (
          <div className="grid gap-10 max-w-3xl">
            {comp.format_summary && <section><h2 className="font-display text-2xl font-semibold mb-2">Format</h2><p className="text-chalk-300 leading-relaxed text-[1.05rem]">{comp.format_summary}</p></section>}
            {comp.history_summary && <section><h2 className="font-display text-2xl font-semibold mb-2">History</h2><p className="text-chalk-300 leading-relaxed text-[1.05rem]">{comp.history_summary}</p></section>}
            {!comp.live_data_available && <p className="text-sm text-chalk-400">Live tables and fixtures are not available for this competition from the current data source.</p>}
          </div>
        )}

        {tab === 'table' && (
          !standings ? <p className="text-chalk-400">Loading…</p>
          : standings.rows.length === 0 ? <Unavailable live_available={standings.live_available} error={standings.error} />
          : (
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h2 className="font-display text-2xl font-semibold">{standings.season ? `${standings.season}/${String(Number(standings.season) + 1).slice(2)} table` : 'Table'}</h2>
                <Freshness updatedAt={standings.updated_at} source={standings.source} />
              </div>
              {standings.error && <p className="text-xs text-gold-400 mb-2">Showing saved data. {standings.error}</p>}
              <div className="surface overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">League table</caption>
                  <thead className="text-xs text-chalk-400 text-left">
                    <tr><th className="p-3 w-10">#</th><th className="p-3">Club</th>{['P', 'W', 'D', 'L', 'GF', 'GA', 'Pts'].map((h) => <th key={h} className="p-3 text-right">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {standings.rows.map((r) => (
                      <tr key={r.team_name} className="hover:bg-white/4">
                        <td className="p-3 text-chalk-400 tabular-nums">{r.position}</td>
                        <td className="p-3 text-chalk-50 font-medium">{r.club_id ? <Link to={`/clubs/${r.club_id}`} className="hover:text-grass-400">{r.team_name}</Link> : r.team_name}</td>
                        {[r.played, r.won, r.drawn, r.lost, r.goals_for, r.goals_against].map((v, i) => <td key={i} className="p-3 text-right tabular-nums text-chalk-300">{v}</td>)}
                        <td className="p-3 text-right tabular-nums font-semibold text-chalk-50">{r.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {tab === 'fixtures' && (matches ? <LivePanel data={matches} /> : <p className="text-chalk-400">Loading…</p>)}

        {tab === 'clubs' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clubs.map((c) => (
              <Link key={c.id} to={`/clubs/${c.id}`} className="surface surface-hover flex items-center gap-3 px-4 py-3">
                <ClubBadge club={c} size={36} /><span className="text-chalk-50 font-medium">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
