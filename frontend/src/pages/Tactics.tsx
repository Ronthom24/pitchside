import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bookmark } from 'lucide-react'
import { TACTICS } from '../content/tactics'
import { DIAGRAMS } from '../content/diagrams'
import TacticDiagram from '../components/TacticDiagram'
import Reveal from '../components/Reveal'
import { useMe } from '../lib/me'

const CATEGORIES = ['All', 'Pressing', 'Possession', 'Structure', 'Transition'] as const

export default function Tactics() {
  const { id } = useParams()
  const me = useMe()
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('All')
  const [onlyAnimated, setOnlyAnimated] = useState(false)
  const active = TACTICS.find((t) => t.id === id)

  if (id && !active) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-300">That tactic isn't in the library. <Link to="/tactics" className="text-grass-400">See all tactics</Link></div>

  if (active) {
    const hasDiagram = !!DIAGRAMS[active.id]
    const bookmarked = me.isBookmarked('tactic', active.id)
    const related = TACTICS.filter((t) => t.category === active.category && t.id !== active.id).slice(0, 4)
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/tactics" className="inline-flex items-center gap-1.5 text-sm text-chalk-400 hover:text-chalk-50"><ArrowLeft size={14} /> All tactics</Link>
        <div className={`mt-6 grid gap-8 ${hasDiagram ? 'lg:grid-cols-[1fr_1.6fr] items-start' : 'max-w-2xl'}`}>
          <div>
            <p className="eyebrow mb-2">{active.category}</p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">{active.name}</h1>
              <button onClick={() => me.toggleBookmark('tactic', active.id)} aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark tactic'}
                className={`mt-1 p-2.5 rounded-full ring-1 shrink-0 ${bookmarked ? 'ring-gold-500 text-gold-400 bg-gold-500/10' : 'ring-white/15 text-chalk-400 hover:text-chalk-50'}`}>
                <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
            <p className="text-xl text-chalk-200 mt-4 mb-5">{active.short}</p>
            <p className="text-chalk-300 leading-relaxed">{active.explanation}</p>
            {active.glossaryId && <Link to={`/glossary#${active.glossaryId}`} className="mt-5 inline-block text-sm text-grass-400 hover:text-grass-300">See it in the glossary →</Link>}
            {!hasDiagram && <p className="mt-6 text-sm text-chalk-400">An animated diagram for this concept is not available yet.</p>}
          </div>
          {hasDiagram && <TacticDiagram id={active.id} />}
        </div>
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="eyebrow mb-4">More in {active.category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {related.map((t) => (
                <Link key={t.id} to={`/tactics/${t.id}`} className="surface surface-hover p-4"><p className="font-semibold text-chalk-50 text-sm">{t.name}</p></Link>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  const filtered = TACTICS.filter((t) => (category === 'All' || t.category === category) && (!onlyAnimated || DIAGRAMS[t.id]))
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <p className="eyebrow mb-2">Tactics</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">How modern football is actually played</h1>
      <p className="text-chalk-300 mb-8 max-w-2xl">{TACTICS.length} concepts, {Object.keys(DIAGRAMS).length} with step-by-step animated diagrams.</p>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c}
            className={`px-4 py-2 rounded-full text-sm font-semibold ring-1 transition-colors ${category === c ? 'bg-grass-500 text-pitch-950 ring-grass-400' : 'ring-white/15 text-chalk-200 hover:bg-white/5'}`}>{c}</button>
        ))}
        <label className="ml-auto inline-flex items-center gap-2 text-sm text-chalk-300 cursor-pointer">
          <input type="checkbox" checked={onlyAnimated} onChange={(e) => setOnlyAnimated(e.target.checked)} className="accent-grass-500" /> Only with animated diagram
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 0.05}>
            <Link to={`/tactics/${t.id}`} className="surface surface-hover p-5 block h-full">
              <div className="flex items-center justify-between mb-1">
                <span className="eyebrow">{t.category}</span>
                {DIAGRAMS[t.id] && <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-400 bg-gold-500/10 rounded-full px-2 py-0.5">Animated</span>}
              </div>
              <h3 className="font-semibold text-chalk-50 mb-1.5">{t.name}</h3>
              <p className="text-sm text-chalk-400">{t.short}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
