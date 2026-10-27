import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { ClubMatch } from '../lib/types'
import ClubBadge from '../components/ClubBadge'

interface Question { question: string; hint?: string; multi?: boolean; options: { label: string; tag: string }[] }

const QUESTIONS: Question[] = [
  { question: 'What kind of football do you enjoy watching?', options: [
    { label: 'Fast, attacking football', tag: 'attacking' }, { label: 'Disciplined, defensive football', tag: 'defensive' }] },
  { question: 'Historic clubs, or clubs on the rise?', options: [
    { label: 'Historic, storied clubs', tag: 'historic' }, { label: 'Clubs built by recent success', tag: 'modern-success' }] },
  { question: 'What kind of fanbase appeals to you?', hint: 'Pick any that apply.', multi: true, options: [
    { label: 'A huge global fanbase', tag: 'global-fanbase' }, { label: 'A fiercely passionate local following', tag: 'passionate-fanbase' }, { label: 'An underdog spirit', tag: 'underdog-spirit' }] },
  { question: 'What matters most about the club itself?', hint: 'Pick any that apply.', multi: true, options: [
    { label: 'A cabinet full of trophies', tag: 'trophy-laden' }, { label: 'Developing young players', tag: 'youth-development' }] },
  { question: 'Which leagues interest you?', hint: 'Pick any, or none.', multi: true, options: [
    { label: 'Premier League', tag: 'premier-league' }, { label: 'La Liga', tag: 'la-liga' }, { label: 'Serie A', tag: 'serie-a' },
    { label: 'Bundesliga', tag: 'bundesliga' }, { label: 'Ligue 1', tag: 'ligue-1' }, { label: 'Indian Super League', tag: 'isl' }] },
]

const LABELS: Record<string, string> = Object.fromEntries(QUESTIONS.flatMap((q) => q.options.map((o) => [o.tag, o.label])))

export default function FindYourClub() {
  const [step, setStep] = useState(0)
  const [tags, setTags] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<ClubMatch[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const q = QUESTIONS[step]

  function toggle(tag: string) {
    if (q.multi) { setTags((t) => ({ ...t, [tag]: !t[tag] })); return }
    setTags((t) => {
      const cleared = { ...t }
      q.options.forEach((o) => { cleared[o.tag] = false })
      return { ...cleared, [tag]: !t[tag] }
    })
  }

  async function next() {
    if (step < QUESTIONS.length - 1) { setStep(step + 1); return }
    setLoading(true); setError(false)
    try { setResults(await api.matchClubs(tags)) } catch { setError(true) } finally { setLoading(false) }
  }

  if (results) {
    const selected = Object.entries(tags).filter(([, v]) => v).map(([t]) => t)
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <p className="eyebrow mb-2">Your matches</p>
        <h1 className="font-display text-4xl font-semibold mb-4">Clubs that fit what you told us</h1>
        <p className="text-chalk-400 mb-2">You selected:</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {selected.length ? selected.map((t) => <span key={t} className="text-xs bg-white/5 ring-1 ring-white/10 rounded-full px-3 py-1 text-chalk-200">{LABELS[t] ?? t}</span>) : <span className="text-sm text-chalk-400">Nothing selected</span>}
        </div>
        <div className="space-y-3">
          {results.map((r) => (
            <Link key={r.club.id} to={`/clubs/${r.club.id}`} className="surface surface-hover flex items-center gap-4 p-5">
              <ClubBadge club={r.club} size={56} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-chalk-50 text-lg">{r.club.name}</p>
                <p className="text-sm text-chalk-400 mt-1">Matches: {r.matched_tags.map((t) => LABELS[t] ?? t).join(' · ')}</p>
              </div>
              <span className="text-right shrink-0"><span className="block font-display text-2xl text-grass-400">{r.match_score}/{selected.length}</span><span className="text-[11px] text-chalk-400">traits matched</span></span>
            </Link>
          ))}
          {results.length === 0 && <p className="text-chalk-400">No clubs matched. Try choosing fewer or different traits.</p>}
        </div>
        <p className="mt-6 text-xs text-chalk-400">Matches use each club's documented traits in the Pitchside database, nothing else. A club's traits are editorial judgements, so treat this as a starting point for exploring.</p>
        <button onClick={() => { setResults(null); setStep(0); setTags({}) }} className="mt-6 text-sm text-grass-400 hover:text-grass-300">← Start over</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <p className="text-sm text-chalk-400 mb-2">Question {step + 1} of {QUESTIONS.length}</p>
      <div className="h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length}>
        <div className="h-full bg-grass-500 transition-all duration-500" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">{q.question}</h1>
      {q.hint && <p className="text-sm text-chalk-400 mb-6">{q.hint}</p>}
      {!q.hint && <div className="mb-6" />}
      <div className="space-y-3 mb-8" role="group" aria-label={q.question}>
        {q.options.map((o) => {
          const sel = !!tags[o.tag]
          return (
            <button key={o.tag} onClick={() => toggle(o.tag)} aria-pressed={sel}
              className={`w-full text-left px-5 py-4 rounded-xl ring-1 transition-colors font-medium ${sel ? 'ring-grass-500 bg-grass-500/10 text-grass-400' : 'ring-white/12 text-chalk-200 hover:bg-white/5'}`}>{o.label}</button>
          )
        })}
      </div>
      {error && <p role="alert" className="text-sm text-red-300 mb-4">Couldn't reach the server. Try again.</p>}
      <div className="flex items-center gap-4">
        {step > 0 && <button onClick={() => setStep(step - 1)} className="text-sm text-chalk-400 hover:text-chalk-50">Back</button>}
        <button onClick={next} disabled={loading} className="rounded-full bg-grass-500 text-pitch-950 font-semibold px-6 py-3 hover:bg-grass-400 transition-colors disabled:opacity-50">
          {loading ? 'Finding your club…' : step < QUESTIONS.length - 1 ? 'Next' : 'See my matches'}
        </button>
      </div>
    </div>
  )
}
