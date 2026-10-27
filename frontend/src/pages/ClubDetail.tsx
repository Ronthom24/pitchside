import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, MapPin, Calendar, Landmark, Trophy, Users } from 'lucide-react'
import { api } from '../lib/api'
import type { ClubDetail as ClubDetailType, Player, ClubLive, Club } from '../lib/types'
import ClubBadge from '../components/ClubBadge'
import LivePanel, { Unavailable } from '../components/LivePanel'
import { Freshness, AsOf } from '../components/Freshness'
import { useMe } from '../lib/me'
import { POSITION_LABEL, POSITION_GROUP } from '../content/positions'

const GROUP_ORDER = ['Goalkeepers', 'Defenders', 'Midfielders', 'Attackers']

export default function ClubDetail() {
  const { id } = useParams()
  const me = useMe()
  const [club, setClub] = useState<ClubDetailType | null>(null)
  const [squad, setSquad] = useState<Player[]>([])
  const [alumni, setAlumni] = useState<{ player: Player; start_year?: number | null; end_year?: number | null }[]>([])
  const [live, setLive] = useState<ClubLive | null>(null)
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setClub(null); setError(false); setLive(null)
    api.club(id).then(setClub).catch(() => setError(true))
    api.clubSquad(id).then(setSquad).catch(() => setSquad([]))
    api.clubAlumni(id).then(setAlumni).catch(() => setAlumni([]))
    api.clubLive(id).then(setLive).catch(() => setLive(null))
    api.clubs().then(setAllClubs).catch(() => {})
  }, [id])

  if (error) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-300">That club couldn't be found. <Link to="/clubs" className="text-grass-400">Browse clubs</Link></div>
  if (!club) return <div className="max-w-4xl mx-auto px-4 py-20 text-chalk-400">Loading…</div>

  const following = me.isFollowing(club.id)
  const isPrimary = me.primaryClubId === club.id
  const primary = club.primary_color || '#1f3327'
  const formerPlayers = alumni.filter((a) => !squad.some((s) => s.id === a.player.id))
  const clubName = (cid: string) => allClubs.find((c) => c.id === cid)?.name ?? cid

  const facts = [
    { icon: Calendar, label: 'Founded', value: club.founded_year },
    { icon: MapPin, label: 'Home', value: [club.city, club.country_name].filter(Boolean).join(', ') },
    { icon: Landmark, label: 'Stadium', value: club.stadium ? `${club.stadium.name}${club.stadium.capacity ? ` (${club.stadium.capacity.toLocaleString()})` : ''}` : null },
    { icon: Trophy, label: 'Competition', value: club.competition_name },
  ].filter((f) => f.value)

  return (
    <div>
      <header className="relative border-b border-white/10 overflow-hidden" style={{ background: `radial-gradient(70% 120% at 15% 0%, ${primary}55, transparent 70%)` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <Link to="/clubs" className="text-sm text-chalk-400 hover:text-chalk-50">← All clubs</Link>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <ClubBadge club={club} size={88} />
            <div className="flex-1 min-w-[14rem]">
              <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">{club.name}</h1>
              <p className="text-chalk-300 mt-1">{club.nickname}</p>
            </div>
            <div className="flex flex-col items-stretch gap-2">
              <button onClick={() => (following ? me.unfollow(club.id) : me.follow(club.id, !me.primaryClubId))} aria-pressed={following}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors ${following ? 'bg-grass-500 text-pitch-950' : 'ring-1 ring-white/30 text-chalk-50 hover:bg-white/8'}`}>
                <Heart size={16} fill={following ? 'currentColor' : 'none'} aria-hidden /> {following ? (isPrimary ? 'My club' : 'Following') : 'Follow club'}
              </button>
              {following && !isPrimary && (
                <button onClick={() => me.follow(club.id, true)} className="text-xs text-grass-400 hover:text-grass-300">Make this my club</button>
              )}
            </div>
          </div>
          <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {facts.map((f) => (
              <div key={f.label} className="surface p-4">
                <dt className="text-xs text-chalk-400 flex items-center gap-1.5"><f.icon size={13} aria-hidden /> {f.label}</dt>
                <dd className="mt-1 text-chalk-50 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid gap-14">
        <section aria-labelledby="live">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h2 id="live" className="font-display text-2xl font-semibold">Fixtures and form</h2>
            {live?.league_position && <Freshness updatedAt={live.league_position.updated_at} source={live.league_position.source} />}
          </div>
          {live?.league_position && (
            <div className="surface p-5 mb-6 flex flex-wrap items-center gap-6">
              <div><p className="text-xs text-chalk-400">League position</p><p className="font-display text-4xl text-chalk-50">{live.league_position.position}<span className="text-lg text-chalk-400">{ordinal(live.league_position.position)}</span></p></div>
              <div><p className="text-xs text-chalk-400">Points</p><p className="font-display text-4xl text-chalk-50">{live.league_position.points}</p></div>
              <div><p className="text-xs text-chalk-400">Played</p><p className="font-display text-4xl text-chalk-50">{live.league_position.played}</p></div>
            </div>
          )}
          {live ? <LivePanel data={live} highlightClubId={club.id} /> : <Unavailable live_available={false} />}
        </section>

        {club.history_summary && (
          <section aria-labelledby="story">
            <h2 id="story" className="font-display text-2xl font-semibold mb-3">The story</h2>
            <p className="text-chalk-300 leading-relaxed text-[1.05rem]">{club.history_summary}</p>
          </section>
        )}

        {(club.playing_style_summary || club.manager) && (
          <section aria-labelledby="football">
            <h2 id="football" className="font-display text-2xl font-semibold mb-3">Football today</h2>
            {club.playing_style_summary && <p className="text-chalk-300 leading-relaxed mb-3">{club.playing_style_summary}</p>}
            <div className="flex flex-wrap gap-3 text-sm">
              {club.typical_formation && <Link to={`/formations/${club.typical_formation}`} className="surface surface-hover px-4 py-2">Typical shape <span className="text-grass-400 font-semibold ml-1">{club.typical_formation}</span></Link>}
              {club.manager && <span className="surface px-4 py-2">Manager <span className="text-chalk-50 font-semibold ml-1">{club.manager.name}</span></span>}
            </div>
            {club.manager?.tactical_style && <p className="text-sm text-chalk-400 mt-3">{club.manager.name}'s style: {club.manager.tactical_style}</p>}
            <div className="mt-3"><AsOf value={club.facts_as_of} what="Manager and squad" /></div>
          </section>
        )}

        {squad.length > 0 && (
          <section aria-labelledby="squad">
            <h2 id="squad" className="font-display text-2xl font-semibold mb-1">Squad highlights</h2>
            <p className="text-sm text-chalk-400 mb-4">Featured players, not a full squad list.</p>
            {GROUP_ORDER.map((g) => {
              const players = squad.filter((p) => POSITION_GROUP[p.position ?? ''] === g)
              if (!players.length) return null
              return (
                <div key={g} className="mb-4">
                  <h3 className="eyebrow mb-2">{g}</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {players.map((p) => (
                      <Link key={p.id} to={`/players/${p.id}`} className="surface surface-hover flex items-center justify-between px-4 py-3">
                        <span className="text-chalk-50 font-medium">{p.name}</span>
                        <span className="text-xs text-chalk-400">{POSITION_LABEL[p.position ?? ''] ?? p.position}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {formerPlayers.length > 0 && (
          <section aria-labelledby="legends">
            <h2 id="legends" className="font-display text-2xl font-semibold mb-4 flex items-center gap-2"><Users size={20} className="text-grass-500" aria-hidden /> Players through the years</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {formerPlayers.map((a) => (
                <Link key={a.player.id + a.start_year} to={`/players/${a.player.id}`} className="surface surface-hover flex items-center justify-between px-4 py-3">
                  <span className="text-chalk-50 font-medium">{a.player.name}</span>
                  <span className="text-xs text-chalk-400">{a.start_year}{a.end_year ? `-${a.end_year}` : '-'}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {club.honours.length > 0 && (
          <section aria-labelledby="honours">
            <h2 id="honours" className="font-display text-2xl font-semibold mb-4">Honours</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {club.honours.map((h) => (
                <div key={h.competition_name} className="surface p-4">
                  <p className="text-chalk-50 font-medium">{h.competition_name}</p>
                  <p className="text-3xl font-display text-gold-400 mt-1">{h.count}</p>
                  {h.years && <p className="text-xs text-chalk-400 mt-1">{h.years.join(', ')}</p>}
                  {h.as_of && <p className="text-[11px] text-chalk-400 mt-1">As of {h.as_of}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {club.rivalries.length > 0 && (
          <section aria-labelledby="rivalries">
            <h2 id="rivalries" className="font-display text-2xl font-semibold mb-4">Rivalries</h2>
            <div className="space-y-3">
              {club.rivalries.map((r) => {
                const other = r.club_a_id === club.id ? r.club_b_id : r.club_a_id
                return (
                  <div key={r.club_a_id + r.club_b_id} className="surface p-4">
                    <p className="text-chalk-50 font-medium mb-1">{r.name ?? `v ${clubName(other)}`}{' '}<Link to={`/clubs/${other}`} className="text-grass-400 text-sm font-normal hover:text-grass-300">· {clubName(other)} →</Link></p>
                    <p className="text-sm text-chalk-300">{r.summary}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {club.culture_summary && (
          <section aria-labelledby="culture">
            <h2 id="culture" className="font-display text-2xl font-semibold mb-3">Culture and identity</h2>
            <p className="text-chalk-300 leading-relaxed text-[1.05rem]">{club.culture_summary}</p>
          </section>
        )}

        {club.timeline.length > 0 && (
          <section aria-labelledby="timeline">
            <h2 id="timeline" className="font-display text-2xl font-semibold mb-5">Timeline</h2>
            <ol className="relative border-l border-white/15 ml-2 space-y-7">
              {club.timeline.map((t) => (
                <li key={t.year + t.title} className="pl-6 relative">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-grass-500 ring-4 ring-pitch-950" />
                  <p className="text-sm font-semibold text-grass-400">{t.year}</p>
                  <p className="font-medium text-chalk-50">{t.title}</p>
                  {t.description && <p className="text-sm text-chalk-300 mt-1">{t.description}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  )
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
