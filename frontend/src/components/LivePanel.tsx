import { Link } from 'react-router-dom'
import { WifiOff } from 'lucide-react'
import type { LiveMatch, LiveMatches } from '../lib/types'
import { formatKickoff } from '../lib/format'
import { Freshness } from './Freshness'

function TeamName({ id, name }: { id?: string | null; name: string }) {
  return id ? <Link to={`/clubs/${id}`} className="hover:text-grass-400">{name}</Link> : <span>{name}</span>
}

export function MatchRow({ m, highlightClubId }: { m: LiveMatch; highlightClubId?: string }) {
  const finished = m.status === 'FINISHED' || m.status === 'AWARDED'
  const live = m.status === 'IN_PLAY' || m.status === 'PAUSED'
  const bold = (id?: string | null) => (id && id === highlightClubId ? 'font-semibold text-chalk-50' : 'text-chalk-200')
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm">
      <div className="w-24 shrink-0 text-xs text-chalk-400">
        {live ? <span className="text-red-400 font-semibold">LIVE</span> : finished ? 'Full time' : formatKickoff(m.kickoff_utc)}
      </div>
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3 min-w-0">
        <span className={`text-right truncate ${bold(m.home_club_id)}`}><TeamName id={m.home_club_id} name={m.home_name} /></span>
        <span className="font-display text-base tabular-nums px-2 py-0.5 rounded bg-white/6 min-w-[3.2rem] text-center text-chalk-50">
          {finished || live ? `${m.home_score ?? 0} - ${m.away_score ?? 0}` : 'vs'}
        </span>
        <span className={`truncate ${bold(m.away_club_id)}`}><TeamName id={m.away_club_id} name={m.away_name} /></span>
      </div>
    </div>
  )
}

export function Unavailable({ live_available, error }: { live_available: boolean; error?: string | null }) {
  return (
    <div className="surface p-5 flex items-start gap-3 text-sm text-chalk-300">
      <WifiOff size={18} className="mt-0.5 shrink-0 text-chalk-400" aria-hidden />
      <p>
        {!live_available
          ? 'Live fixtures and tables are not available for this competition from the current data source.'
          : error || 'No live data has been loaded yet.'}
      </p>
    </div>
  )
}

export default function LivePanel({ data, highlightClubId }: { data: LiveMatches; highlightClubId?: string }) {
  const has = data.upcoming.length + data.recent.length > 0
  if (!has) return <Unavailable live_available={data.live_available} error={data.error} />
  return (
    <div className="space-y-6">
      {data.error && <p className="text-xs text-gold-400">Showing saved data. {data.error}</p>}
      {data.upcoming.length > 0 && (
        <div>
          <h3 className="eyebrow mb-2">Upcoming</h3>
          <div className="surface divide-y divide-white/8">{data.upcoming.map((m) => <MatchRow key={m.id} m={m} highlightClubId={highlightClubId} />)}</div>
        </div>
      )}
      {data.recent.length > 0 && (
        <div>
          <h3 className="eyebrow mb-2">Recent results</h3>
          <div className="surface divide-y divide-white/8">{data.recent.map((m) => <MatchRow key={m.id} m={m} highlightClubId={highlightClubId} />)}</div>
        </div>
      )}
      <Freshness updatedAt={data.updated_at} source={data.source} />
    </div>
  )
}
