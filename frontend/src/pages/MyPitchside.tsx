import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark as BookmarkIcon, LogOut } from 'lucide-react'
import { api } from '../lib/api'
import type { Club, ClubDetail, ClubLive, GlossaryTerm, LessonTopic, Player } from '../lib/types'
import ClubBadge from '../components/ClubBadge'
import LivePanel, { Unavailable } from '../components/LivePanel'
import { Freshness } from '../components/Freshness'
import { TACTICS } from '../content/tactics'
import { useMe } from '../lib/me'
import { ACCOUNTS_ENABLED } from '../lib/flags'

export default function MyPitchside() {
  const me = useMe()
  const [club, setClub] = useState<ClubDetail | null>(null)
  const [live, setLive] = useState<ClubLive | null>(null)
  const [clubs, setClubs] = useState<Club[]>([])
  const [lessons, setLessons] = useState<LessonTopic[]>([])
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    Promise.all([api.clubs(), api.lessons(), api.glossary(), api.players()]).then(([c, l, g, p]) => { setClubs(c); setLessons(l); setTerms(g); setPlayers(p) }).catch(() => {})
  }, [])

  useEffect(() => {
    setClub(null); setLive(null)
    if (!me.primaryClubId) return
    api.club(me.primaryClubId).then(setClub).catch(() => {})
    api.clubLive(me.primaryClubId).then(setLive).catch(() => {})
  }, [me.primaryClubId])

  const done = lessons.filter((l) => me.isComplete(l.id))
  const pct = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0
  const nextLesson = lessons.find((l) => !me.isComplete(l.id))
  const scores = done.map((l) => me.progress[l.id]?.best_quiz_score).filter((s): s is number => typeof s === 'number')
  const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : null
  const others = me.follows.filter((f) => f.club_id !== me.primaryClubId)

  const saved = useMemo(() => me.bookmarks.map((b) => {
    switch (b.kind) {
      case 'lesson': { const l = lessons.find((x) => x.id === b.ref_id); return l && { ...b, title: l.title, to: `/learn/${l.id}`, label: 'Lesson' } }
      case 'tactic': { const t = TACTICS.find((x) => x.id === b.ref_id); return t && { ...b, title: t.name, to: `/tactics/${t.id}`, label: 'Tactic' } }
      case 'glossary': { const g = terms.find((x) => x.id === b.ref_id); return g && { ...b, title: g.term, to: `/glossary#${g.id}`, label: 'Term' } }
      case 'player': { const p = players.find((x) => x.id === b.ref_id); return p && { ...b, title: p.name, to: `/players/${p.id}`, label: 'Player' } }
      case 'club': { const c = clubs.find((x) => x.id === b.ref_id); return c && { ...b, title: c.name, to: `/clubs/${c.id}`, label: 'Club' } }
      default: return undefined
    }
  }).filter(Boolean) as { kind: string; ref_id: string; title: string; to: string; label: string }[], [me.bookmarks, lessons, terms, players, clubs])

  const primary = club?.primary_color || '#1f3327'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="eyebrow mb-2">My Pitchside</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">{me.user ? `Welcome back${me.user.display_name ? `, ${me.user.display_name}` : ''}` : 'Your football journey'}</h1>
        </div>
        {me.user && <button onClick={me.logout} className="inline-flex items-center gap-2 text-sm text-chalk-400 hover:text-chalk-50"><LogOut size={14} /> Sign out</button>}
      </div>

      {!me.user && ACCOUNTS_ENABLED && (
        <Link to="/account" className="surface surface-hover p-5 mb-10 flex items-center justify-between gap-4">
          <span><span className="block font-semibold text-chalk-50">Save your progress everywhere</span><span className="text-sm text-chalk-400">What you've done so far lives on this device only. A free account syncs it.</span></span>
          <ArrowRight className="text-grass-400 shrink-0" aria-hidden />
        </Link>
      )}

      <section className="mb-12" aria-labelledby="my-club">
        <h2 id="my-club" className="sr-only">My club</h2>
        {club ? (
          <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: `radial-gradient(80% 140% at 0% 0%, ${primary}44, transparent 70%)` }}>
            <div className="p-6 sm:p-8 flex flex-wrap items-center gap-5">
              <ClubBadge club={club} size={72} />
              <div className="flex-1 min-w-[12rem]">
                <p className="eyebrow">My club</p>
                <Link to={`/clubs/${club.id}`} className="font-display text-3xl font-semibold hover:text-grass-400">{club.name}</Link>
                <p className="text-sm text-chalk-300 mt-1">{[club.competition_name, club.stadium?.name].filter(Boolean).join(' · ')}</p>
              </div>
              {live?.league_position && (
                <div className="text-right"><p className="text-xs text-chalk-400">League position</p><p className="font-display text-4xl">{live.league_position.position}</p><Freshness updatedAt={live.league_position.updated_at} source={live.league_position.source} /></div>
              )}
            </div>
            <div className="p-6 sm:p-8 pt-0">{live ? <LivePanel data={live} highlightClubId={club.id} /> : <Unavailable live_available={false} />}</div>
          </div>
        ) : (
          <Link to="/find-your-club" className="surface surface-hover p-6 flex items-center justify-between gap-4">
            <span><span className="block font-display text-2xl">You haven't chosen a club yet</span><span className="text-sm text-chalk-400">Take the Find Your Club quiz, or browse clubs and tap Follow.</span></span>
            <ArrowRight className="text-grass-400 shrink-0" aria-hidden />
          </Link>
        )}
        {others.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-chalk-400 self-center mr-1">Also following</span>
            {others.map((f) => {
              const c = clubs.find((x) => x.id === f.club_id)
              return c ? <span key={f.club_id} className="surface inline-flex items-center gap-2 pl-2 pr-3 py-1.5 text-sm"><ClubBadge club={c} size={22} /><Link to={`/clubs/${c.id}`} className="text-chalk-50 hover:text-grass-400">{c.name}</Link><button onClick={() => me.follow(c.id, true)} className="text-xs text-grass-400 ml-1">Make mine</button></span> : null
            })}
          </div>
        )}
      </section>

      <section className="mb-12" aria-labelledby="learning">
        <h2 id="learning" className="font-display text-2xl font-semibold mb-4">Learning progress</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <div className="surface p-5"><p className="text-xs text-chalk-400">Lessons complete</p><p className="font-display text-4xl mt-1">{done.length}<span className="text-lg text-chalk-400"> / {lessons.length}</span></p></div>
          <div className="surface p-5"><p className="text-xs text-chalk-400">Overall</p><p className="font-display text-4xl mt-1">{pct}%</p><div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-grass-500" style={{ width: `${pct}%` }} /></div></div>
          <div className="surface p-5"><p className="text-xs text-chalk-400">Average quiz score</p><p className="font-display text-4xl mt-1">{avg === null ? '-' : `${avg}%`}</p></div>
        </div>
        {nextLesson ? (
          <Link to={`/learn/${nextLesson.id}`} className="surface surface-hover p-5 flex items-center justify-between gap-4">
            <span><span className="eyebrow block mb-1">Up next</span><span className="font-semibold text-chalk-50">{nextLesson.title}</span><span className="block text-sm text-chalk-400">{nextLesson.summary}</span></span>
            <ArrowRight className="text-grass-400 shrink-0" aria-hidden />
          </Link>
        ) : lessons.length > 0 && <p className="text-grass-400 font-medium">You've completed every lesson. Explore the tactics diagrams and club histories next.</p>}
      </section>

      <section aria-labelledby="saved">
        <h2 id="saved" className="font-display text-2xl font-semibold mb-4 flex items-center gap-2"><BookmarkIcon size={20} className="text-gold-400" aria-hidden /> Saved</h2>
        {saved.length ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {saved.map((s) => (
              <Link key={s.kind + s.ref_id} to={s.to} className="surface surface-hover px-4 py-3 flex items-center justify-between">
                <span className="text-chalk-50 font-medium">{s.title}</span><span className="text-[11px] uppercase tracking-wider text-chalk-400">{s.label}</span>
              </Link>
            ))}
          </div>
        ) : <p className="text-chalk-400 text-sm">Nothing saved yet. Use the bookmark button on lessons, tactics, players and glossary terms.</p>}
      </section>
    </div>
  )
}
