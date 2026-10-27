import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { HistoryEvent, HistoryEra } from '../lib/types'
import Reveal from '../components/Reveal'

const CATS: { key: string; label: string }[] = [
  { key: '', label: 'Everything' }, { key: 'rules', label: 'Rules' }, { key: 'world-cup', label: 'World Cups' },
  { key: 'tournament', label: 'Tournaments' }, { key: 'club', label: 'Clubs' }, { key: 'tactics', label: 'Tactics' }, { key: 'people', label: 'People' },
]

export default function History() {
  const [eras, setEras] = useState<HistoryEra[]>([])
  const [events, setEvents] = useState<HistoryEvent[]>([])
  const [cat, setCat] = useState('')
  const [era, setEra] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => { api.history().then((d) => { setEras(d.eras); setEvents(d.events) }).catch(() => setError(true)) }, [])

  const visible = useMemo(() => events.filter((e) => (!cat || e.category === cat) && (!era || e.era === era)), [events, cat, era])
  const pill = (a: boolean) => `px-4 py-2 rounded-full text-sm font-semibold ring-1 transition-colors ${a ? 'bg-grass-500 text-pitch-950 ring-grass-400' : 'ring-white/15 text-chalk-200 hover:bg-white/5'}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <p className="eyebrow mb-2">History</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">The story of the game</h1>
      <p className="text-chalk-300 mb-8 max-w-2xl">From the 1863 rulebook to the 48-team World Cup: {events.length || 'the'} moments that shaped football.</p>

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Era">
        <button onClick={() => setEra('')} aria-pressed={era === ''} className={pill(era === '')}>All eras</button>
        {eras.map((e) => <button key={e.id} onClick={() => setEra(era === e.id ? '' : e.id)} aria-pressed={era === e.id} className={pill(era === e.id)}>{e.label} <span className="opacity-60 font-normal ml-1">{e.years}</span></button>)}
      </div>
      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Topic">
        {CATS.map((c) => <button key={c.key} onClick={() => setCat(c.key)} aria-pressed={cat === c.key} className={pill(cat === c.key)}>{c.label}</button>)}
      </div>

      {error && <p className="text-chalk-300">Couldn't load history. Is the API running?</p>}
      <ol className="relative border-l border-white/15 ml-3 space-y-8">
        {visible.map((e, i) => {
          const newEra = i === 0 || visible[i - 1].era !== e.era
          const eraInfo = eras.find((x) => x.id === e.era)
          return (
            <li key={e.id} className="pl-7 relative">
              {newEra && eraInfo && (
                <div className="mb-5 -ml-7 pl-7">
                  <p className="eyebrow">{eraInfo.label} · {eraInfo.years}</p>
                  <p className="text-sm text-chalk-400">{eraInfo.blurb}</p>
                </div>
              )}
              <Reveal>
                <span className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-grass-500 ring-4 ring-pitch-950" style={newEra ? { top: '4.6rem' } : undefined} />
                <p className="font-display text-2xl text-grass-400 leading-none">{e.year}</p>
                <h2 className="font-semibold text-chalk-50 text-lg mt-1">{e.title}</h2>
                <p className="text-chalk-300 mt-1.5 leading-relaxed">{e.summary}</p>
                {((e.related_club_ids?.length ?? 0) > 0 || (e.related_competition_ids?.length ?? 0) > 0) && (
                  <p className="mt-2 flex flex-wrap gap-2">
                    {e.related_club_ids?.map((c) => <Link key={c} to={`/clubs/${c}`} className="text-xs bg-white/5 ring-1 ring-white/10 rounded-full px-2.5 py-1 text-chalk-200 hover:ring-grass-500/50">{c.replace(/-/g, ' ')}</Link>)}
                    {e.related_competition_ids?.map((c) => <Link key={c} to={`/competitions/${c}`} className="text-xs bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-2.5 py-1 text-gold-400">{c.replace(/-/g, ' ')}</Link>)}
                  </p>
                )}
              </Reveal>
            </li>
          )
        })}
      </ol>
      {!error && visible.length === 0 && events.length > 0 && <p className="text-chalk-400">Nothing matches those filters.</p>}
    </div>
  )
}
