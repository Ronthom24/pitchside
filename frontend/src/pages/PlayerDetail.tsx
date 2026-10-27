import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { api } from '../lib/api'
import type { PlayerDetail as PlayerDetailType } from '../lib/types'
import ClubBadge from '../components/ClubBadge'
import { AsOf } from '../components/Freshness'
import { POSITION_LABEL } from '../content/positions'
import { ageFrom, formatDate } from '../lib/format'
import { useMe } from '../lib/me'

export default function PlayerDetail() {
  const { id } = useParams()
  const me = useMe()
  const [player, setPlayer] = useState<PlayerDetailType | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setPlayer(null); setError(false)
    api.player(id).then(setPlayer).catch(() => setError(true))
  }, [id])

  if (error) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-300">That player couldn't be found. <Link to="/players" className="text-grass-400">Browse players</Link></div>
  if (!player) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-400">Loading…</div>

  const age = ageFrom(player.birth_date, player.death_date)
  const bookmarked = me.isBookmarked('player', player.id)
  const years = (s: { start_year?: number | null; end_year?: number | null }) => `${s.start_year ?? '?'}-${s.end_year ?? 'present'}`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <Link to="/players" className="text-sm text-chalk-400 hover:text-chalk-50">← All players</Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">{player.is_retired ? 'Legend' : 'Player'}{player.position ? ` · ${POSITION_LABEL[player.position] ?? player.position}` : ''}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">{player.name}</h1>
          {player.full_name && player.full_name !== player.name && <p className="text-chalk-400 mt-1">{player.full_name}</p>}
        </div>
        <button onClick={() => me.toggleBookmark('player', player.id)} aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark player'}
          className={`mt-1 p-2.5 rounded-full ring-1 shrink-0 ${bookmarked ? 'ring-gold-500 text-gold-400 bg-gold-500/10' : 'ring-white/15 text-chalk-400 hover:text-chalk-50'}`}>
          <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['Nationality', player.nationality_name],
          [player.death_date ? 'Born' : 'Age', player.death_date ? formatDate(player.birth_date) : age],
          player.death_date ? ['Died', `${formatDate(player.death_date)} (aged ${age})`] : ['Born', formatDate(player.birth_date)],
          ['Role', player.position ? POSITION_LABEL[player.position] : null],
        ].filter((r) => r[1]).map(([k, v]) => (
          <div key={k as string} className="surface p-3"><dt className="text-xs text-chalk-400">{k}</dt><dd className="text-chalk-50 font-medium mt-0.5 text-sm">{v}</dd></div>
        ))}
      </dl>

      {player.current_club && (
        <div className="mt-6">
          <Link to={`/clubs/${player.current_club.id}`} className="surface surface-hover inline-flex items-center gap-3 px-4 py-3">
            <ClubBadge club={player.current_club} size={38} />
            <span><span className="block text-xs text-chalk-400">Current club</span><span className="text-chalk-50 font-medium">{player.current_club.name}</span></span>
          </Link>
          <div className="mt-2"><AsOf value={player.facts_as_of} what="Club" /></div>
        </div>
      )}

      {player.playing_style && <section className="mt-10"><h2 className="font-display text-2xl font-semibold mb-2">Playing style</h2><p className="text-chalk-300 leading-relaxed text-[1.05rem]">{player.playing_style}</p></section>}
      {player.bio && <section className="mt-8"><h2 className="font-display text-2xl font-semibold mb-2">Career highlights</h2><p className="text-chalk-300 leading-relaxed text-[1.05rem]">{player.bio}</p></section>}

      {player.career.length > 0 && (
        <section className="mt-10" aria-labelledby="career">
          <h2 id="career" className="font-display text-2xl font-semibold mb-5">Clubs</h2>
          <ol className="relative border-l border-white/15 ml-2 space-y-5">
            {player.career.map((s, i) => (
              <li key={i} className="pl-6 relative">
                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-grass-500 ring-4 ring-pitch-950" />
                <p className="text-sm font-semibold text-grass-400">{years(s)}</p>
                <p className="text-chalk-50 font-medium">{s.club_id ? <Link to={`/clubs/${s.club_id}`} className="hover:text-grass-400">{s.club_name}</Link> : s.club_name}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-chalk-400">Senior club career by contract years. Loans and brief spells may be omitted.</p>
        </section>
      )}
    </div>
  )
}
