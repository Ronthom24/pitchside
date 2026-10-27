import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Shield, Trophy, Users, Compass, Clock3, BookOpen } from 'lucide-react'
import { api } from '../lib/api'
import type { Club, LessonTopic } from '../lib/types'
import ClubBadge from '../components/ClubBadge'
import Reveal from '../components/Reveal'
import { useMe } from '../lib/me'

const PATH = [
  { title: 'The basics', lesson: 'what-is-football', to: '/learn/what-is-football' },
  { title: 'How a match works', lesson: 'how-a-match-works', to: '/learn/how-a-match-works' },
  { title: 'Positions', lesson: 'positions-overview', to: '/learn/positions-overview' },
  { title: 'The rules', lesson: 'offside', to: '/learn/offside' },
  { title: 'Tactics', lesson: 'understanding-formations', to: '/learn/understanding-formations' },
  { title: 'Competitions', lesson: 'champions-league', to: '/learn/champions-league' },
  { title: 'Clubs', lesson: 'club-culture', to: '/learn/club-culture' },
]

const QUESTIONS = [
  { q: 'Why do teams use a back three?', a: 'Three centre-backs cover two strikers, and wing-backs bring the width.', to: '/formations/3-5-2', tag: 'Formations' },
  { q: 'What is a false nine?', a: 'A striker who drops deep to drag a centre-back out of position.', to: '/tactics/false-nine', tag: 'Tactics' },
  { q: 'How does the Champions League work?', a: 'A 36-team league phase, then knockouts to a single-match final.', to: '/learn/champions-league', tag: 'Competitions' },
  { q: 'What is a transfer window?', a: 'The fixed periods when clubs can register new players.', to: '/learn/transfers-and-contracts', tag: 'Football world' },
  { q: 'Why do clubs have ultras?', a: 'Organised supporter groups turn matchdays into a spectacle.', to: '/learn/club-culture', tag: 'Culture' },
  { q: 'What does gegenpressing mean?', a: 'Pressing the instant the ball is lost, not retreating.', to: '/tactics/gegenpressing', tag: 'Tactics' },
]

const WORLD = [
  { to: '/clubs', label: 'Clubs', desc: 'Histories, honours, rivalries and cultures.', icon: Shield },
  { to: '/competitions', label: 'Competitions', desc: 'How leagues and tournaments really work.', icon: Trophy },
  { to: '/players', label: 'Players', desc: 'Careers, styles and legends of the game.', icon: Users },
  { to: '/tactics', label: 'Tactics', desc: 'Animated diagrams of how modern football works.', icon: Compass },
  { to: '/history', label: 'History', desc: 'From the 1863 rulebook to the 48-team World Cup.', icon: Clock3 },
]

function HeroPitch() {
  const reduce = useReducedMotion()
  const draw = (delay: number) => reduce ? {} : ({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.8, delay, ease: 'easeInOut' as const } })
  return (
    <svg viewBox="0 0 800 420" className="absolute inset-x-0 top-0 h-full w-full opacity-[0.22]" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke="#6ee7a0" strokeWidth="2">
        <motion.rect x="40" y="30" width="720" height="360" rx="4" {...draw(0)} />
        <motion.line x1="400" y1="30" x2="400" y2="390" {...draw(0.3)} />
        <motion.circle cx="400" cy="210" r="62" {...draw(0.5)} />
        <motion.rect x="40" y="110" width="110" height="200" {...draw(0.7)} />
        <motion.rect x="650" y="110" width="110" height="200" {...draw(0.7)} />
        <motion.path d="M 150 170 A 50 50 0 0 1 150 250" {...draw(0.9)} />
        <motion.path d="M 650 170 A 50 50 0 0 0 650 250" {...draw(0.9)} />
      </g>
    </svg>
  )
}

export default function Home() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [lessons, setLessons] = useState<LessonTopic[]>([])
  const [counts, setCounts] = useState<{ clubs: number; players: number; comps: number } | null>(null)
  const me = useMe()

  useEffect(() => {
    Promise.all([api.clubs(), api.lessons(), api.players(), api.competitions()]).then(([c, l, p, k]) => {
      setClubs(c.filter((x) => ['arsenal', 'real-madrid', 'barcelona', 'mohun-bagan-super-giant', 'bayern-munich', 'boca-juniors'].includes(x.id)))
      setLessons(l)
      setCounts({ clubs: c.length, players: p.length, comps: k.length })
    }).catch(() => {})
  }, [])

  const next = PATH.find((s) => !me.isComplete(s.lesson))
  const completeCount = lessons.filter((l) => me.isComplete(l.id)).length
  const pct = lessons.length ? Math.round((completeCount / lessons.length) * 100) : 0
  const started = completeCount > 0
  const followed = me.primaryClubId

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10 floodlight bg-grain">
        <HeroPitch />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-24 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-6">The football knowledge platform</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight">
            Football, <span className="text-grass-500 italic">explained.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-6 text-lg sm:text-xl text-chalk-200 max-w-2xl mx-auto">
            Learn the game. Discover its world. Find your club.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={next ? next.to : '/learn'} className="inline-flex items-center gap-2 rounded-full bg-grass-500 text-pitch-950 font-semibold px-7 py-3.5 hover:bg-grass-400 transition-colors">
              {started ? 'Continue learning' : 'Start learning'} <ArrowRight size={18} />
            </Link>
            <Link to="/clubs" className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/25 text-chalk-50 font-semibold px-7 py-3.5 hover:bg-white/5 transition-colors">Explore football</Link>
          </motion.div>
          <div className="mt-14 min-h-[3rem]">
          {counts && (
            <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mx-auto flex flex-wrap justify-center gap-x-10 gap-y-4 text-center">
              {[[lessons.length, 'lessons'], [counts.clubs, 'clubs'], [counts.players, 'players'], [counts.comps, 'competitions']].map(([n, l]) => (
                <div key={l as string}><dt className="sr-only">{l}</dt><dd><span className="font-display text-3xl text-chalk-50">{n}</span> <span className="text-sm text-chalk-400">{l}</span></dd></div>
              ))}
            </motion.dl>
          )}
          </div>
        </div>
      </section>

      {(started || followed) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {started && next && (
              <Link to={next.to} className="surface surface-hover p-5 block">
                <p className="eyebrow mb-1">Continue your football journey</p>
                <p className="font-semibold text-chalk-50">{next.title}</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-grass-500" style={{ width: `${pct}%` }} /></div>
                <p className="mt-2 text-xs text-chalk-400">{completeCount} of {lessons.length} lessons complete ({pct}%)</p>
              </Link>
            )}
            {followed && (
              <Link to="/my-pitchside" className="surface surface-hover p-5 block">
                <p className="eyebrow mb-1">My club</p>
                <p className="font-semibold text-chalk-50">Fixtures, form and news for the club you follow</p>
                <p className="mt-2 text-xs text-chalk-400 inline-flex items-center gap-1">Open My Pitchside <ArrowRight size={12} /></p>
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <Reveal>
          <p className="eyebrow mb-2">New to football?</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-2">Start here</h2>
          <p className="text-chalk-400 mb-10 max-w-xl">Seven steps from "what is offside?" to reading a tactical diagram. Each step is a few minutes.</p>
        </Reveal>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PATH.map((s, i) => {
            const done = me.isComplete(s.lesson)
            return (
              <Reveal key={s.title} delay={i * 0.05}>
                <li>
                  <Link to={s.to} className="surface surface-hover p-5 flex items-center gap-4 h-full">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg ${done ? 'bg-grass-500 text-pitch-950' : 'bg-white/8 text-grass-400 ring-1 ring-white/15'}`}>
                      {done ? <Check size={18} /> : i + 1}
                    </span>
                    <span className="font-semibold text-chalk-50">{s.title}</span>
                  </Link>
                </li>
              </Reveal>
            )
          })}
        </ol>
      </section>

      <section className="border-y border-white/10 bg-pitch-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <Reveal>
            <p className="eyebrow mb-2">The football world</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-10">Pick a doorway</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WORLD.map((w, i) => (
              <Reveal key={w.to} delay={i * 0.05}>
                <Link to={w.to} className="surface surface-hover p-5 block h-full">
                  <w.icon className="text-grass-500 mb-4" size={26} aria-hidden />
                  <h3 className="font-display text-xl text-chalk-50 mb-1">{w.label}</h3>
                  <p className="text-sm text-chalk-400">{w.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-center">
          <Reveal>
            <p className="eyebrow mb-2">Find your club</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Which club is yours?</h2>
            <p className="text-chalk-300 mb-6">Answer a few questions about the football you enjoy. Pitchside shows the clubs whose documented characteristics match, and tells you exactly why.</p>
            <Link to="/find-your-club" className="inline-flex items-center gap-2 rounded-full bg-grass-500 text-pitch-950 font-semibold px-6 py-3 hover:bg-grass-400">Take the quiz <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {clubs.map((c) => (
                <Link key={c.id} to={`/clubs/${c.id}`} className="surface surface-hover p-4 flex flex-col items-center text-center gap-2">
                  <ClubBadge club={c} size={52} />
                  <span className="text-sm font-semibold text-chalk-50 leading-tight">{c.name}</span>
                  <span className="text-[11px] text-chalk-400">{c.nickname}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <Reveal>
          <div className="flex items-center gap-2 mb-8"><BookOpen className="text-grass-500" size={22} aria-hidden /><h2 className="font-display text-2xl sm:text-3xl font-semibold">Football questions, answered</h2></div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUESTIONS.map((f, i) => (
            <Reveal key={f.q} delay={(i % 3) * 0.06}>
              <Link to={f.to} className="surface surface-hover p-5 block h-full">
                <span className="eyebrow">{f.tag}</span>
                <p className="font-semibold text-chalk-50 mt-1 mb-1.5">{f.q}</p>
                <p className="text-sm text-chalk-400">{f.a}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
