import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronRight, Bookmark } from 'lucide-react'
import { api } from '../lib/api'
import type { LessonTopic } from '../lib/types'
import { useMe } from '../lib/me'
import { ACCOUNTS_ENABLED } from '../lib/flags'
import Reveal from '../components/Reveal'

const LEVELS = [
  { level: 1, title: 'Football basics', desc: 'The objective, the pitch, and how a match works.' },
  { level: 2, title: 'The rules', desc: 'Offside, fouls, cards, VAR and the laws that shape every match.' },
  { level: 3, title: 'Tactics', desc: 'Formations, pressing, build-up and modern roles.' },
  { level: 4, title: 'The football world', desc: 'Leagues, cups, the Champions League, transfers and club culture.' },
]

export default function Learn() {
  const [lessons, setLessons] = useState<LessonTopic[]>([])
  const [error, setError] = useState(false)
  const me = useMe()

  useEffect(() => { api.lessons().then(setLessons).catch(() => setError(true)) }, [])

  const done = lessons.filter((l) => me.isComplete(l.id)).length
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <p className="eyebrow mb-2">Learn</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">From first whistle to tactical board</h1>
      <p className="text-chalk-300 mb-8 max-w-2xl">{lessons.length || 32} short lessons in four levels. Do them in order, or jump to what you need.</p>

      <div className="surface p-5 mb-12 flex items-center gap-5">
        <div className="relative h-14 w-14 shrink-0">
          <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#3ddc84" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${pct * 0.974} 100`} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{pct}%</span>
        </div>
        <div>
          <p className="font-semibold text-chalk-50">{done === 0 ? 'Your journey starts here' : `${done} of ${lessons.length} lessons complete`}</p>
          <p className="text-sm text-chalk-400">{me.user ? 'Progress is saved to your account.' : ACCOUNTS_ENABLED ? 'Progress is saved on this device. Create an account to keep it everywhere.' : 'Progress is saved on this device.'}</p>
        </div>
      </div>

      {error && <p className="text-chalk-300">Couldn't load the lessons. Is the API running?</p>}

      {LEVELS.map((lvl) => {
        const items = lessons.filter((l) => l.level === lvl.level)
        const d = items.filter((l) => me.isComplete(l.id)).length
        return (
          <Reveal key={lvl.level} className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h2 className="font-display text-2xl font-semibold"><span className="text-grass-500">Level {lvl.level}</span> · {lvl.title}</h2>
              <span className="text-xs text-chalk-400 shrink-0">{d}/{items.length}</span>
            </div>
            <p className="text-sm text-chalk-400 mb-4">{lvl.desc}</p>
            <div className="surface divide-y divide-white/8 overflow-hidden">
              {items.map((l) => {
                const complete = me.isComplete(l.id)
                const score = me.progress[l.id]?.best_quiz_score
                return (
                  <Link key={l.id} to={`/learn/${l.id}`} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                    {complete ? <CheckCircle2 className="text-grass-500 shrink-0" size={20} aria-label="Complete" /> : <Circle className="text-chalk-400 shrink-0" size={20} aria-label="Not started" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-chalk-50">{l.title}</p>
                      <p className="text-sm text-chalk-400 truncate">{l.summary}</p>
                    </div>
                    {l.interactive_component && <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wider text-gold-400 bg-gold-500/10 rounded-full px-2 py-0.5">Interactive</span>}
                    {typeof score === 'number' && <span className="text-xs text-chalk-400">{Math.round(score * 100)}%</span>}
                    {me.isBookmarked('lesson', l.id) && <Bookmark size={14} className="text-gold-400" fill="currentColor" aria-label="Bookmarked" />}
                    <ChevronRight className="text-chalk-400 shrink-0" size={18} aria-hidden />
                  </Link>
                )
              })}
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
