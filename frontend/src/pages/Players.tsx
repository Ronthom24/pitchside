import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { api } from '../lib/api'
import type { Player, Club } from '../lib/types'
import { POSITION_GROUP, POSITION_LABEL } from '../content/positions'
import { ageFrom } from '../lib/format'
import Reveal from '../components/Reveal'

const GROUPS = ['All', 'Goalkeepers', 'Defenders', 'Midfielders', 'Attackers'] as const
const ERAS = ['All', 'Current', 'Legends'] as const

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<typeof GROUPS[number]>('All')
  const [era, setEra] = useState<typeof ERAS[number]>('All')
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([api.players(), api.clubs()]).then(([p, c]) => { setPlayers(p); setClubs(c) }).catch(() => setError(true))
  }, [])

  const clubName = (id?: string | null) => clubs.find((c) => c.id === id)?.name
  const filtered = players
    .filter((p) => (!q || p.name.toLowerCase().includes(q.toLowerCase())) && (group === 'All' || POSITION_GROUP[p.position ?? ''] === group)
      && (era === 'All' || (era === 'Legends') === p.is_retired))
    .sort((a, b) => a.name.localeCompare(b.name))

  const pill = (active: boolean) => `px-4 py-2 rounded-full text-sm font-semibold ring-1 transition-colors ${active ? 'bg-grass-500 text-pitch-950 ring-grass-400' : 'ring-white/15 text-chalk-200 hover:bg-white/5'}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <p className="eyebrow mb-2">Players</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">Players, current and legendary</h1>
      <p className="text-chalk-300 mb-8 max-w-2xl">Careers, playing styles and the roles they made famous.</p>

      <label className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-full px-4 py-2.5 w-full sm:w-80 mb-4 focus-within:ring-grass-500/50">
        <Search size={15} className="text-chalk-400" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players" aria-label="Search players" className="bg-transparent outline-none text-chalk-50 placeholder:text-chalk-400 w-full" />
      </label>
      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Position">{GROUPS.map((g) => <button key={g} onClick={() => setGroup(g)} aria-pressed={group === g} className={pill(group === g)}>{g}</button>)}</div>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Era">{ERAS.map((g) => <button key={g} onClick={() => setEra(g)} aria-pressed={era === g} className={pill(era === g)}>{g}</button>)}</div>

      {error && <p className="text-chalk-300">Couldn't load players. Is the API running?</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const age = ageFrom(p.birth_date)
          return (
            <Reveal key={p.id} delay={(i % 3) * 0.04}>
              <Link to={`/players/${p.id}`} className="surface surface-hover p-4 block h-full">
                <p className="font-semibold text-chalk-50 text-lg">{p.name}</p>
                <p className="text-sm text-chalk-300 mt-0.5">{POSITION_LABEL[p.position ?? ''] ?? p.position}</p>
                <p className="text-xs text-chalk-400 mt-2">{p.is_retired ? 'Retired legend' : [clubName(p.current_club_id), age ? `${age}` : null].filter(Boolean).join(' · ')}</p>
              </Link>
            </Reveal>
          )
        })}
      </div>
      {!error && filtered.length === 0 && players.length > 0 && <p className="text-chalk-400 mt-6">No players match those filters.</p>}
    </div>
  )
}
