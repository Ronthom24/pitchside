import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Bookmark } from 'lucide-react'
import { api } from '../lib/api'
import type { GlossaryTerm } from '../lib/types'
import { useMe } from '../lib/me'

const CATEGORY_LABEL: Record<string, string> = {
  all: 'All', tactics: 'Tactics', rules: 'Rules', stats: 'Statistics', culture: 'Culture', business: 'Transfers & business', competition: 'Competitions', skills: 'Skills',
}

export default function Glossary() {
  const me = useMe()
  const { hash } = useLocation()
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => { api.glossary().then((t) => setTerms(t.sort((a, b) => a.term.localeCompare(b.term)))).catch(() => setError(true)) }, [])

  useEffect(() => {
    const id = hash.replace('#', '')
    if (!id || !terms.length) return
    setOpen(id)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }, [hash, terms.length])

  const categories = useMemo(() => ['all', ...Array.from(new Set(terms.map((t) => t.category)))], [terms])
  const filtered = terms.filter((t) => (cat === 'all' || t.category === cat) &&
    (!q || `${t.term} ${t.short_definition}`.toLowerCase().includes(q.toLowerCase())))
  const letters = Array.from(new Set(filtered.map((t) => t.term[0].toUpperCase())))
  const termName = (id: string) => terms.find((t) => t.id === id)?.term ?? id

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="eyebrow mb-2">Glossary</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">The language of football</h1>
      <p className="text-chalk-300 mb-8">{terms.length || 'Every'} terms, from "assist" to "xG". Tap a term for the full explanation.</p>

      <label className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-full px-4 py-2.5 mb-4 focus-within:ring-grass-500/50">
        <Search size={15} className="text-chalk-400" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms" aria-label="Search terms" className="bg-transparent outline-none text-chalk-50 placeholder:text-chalk-400 w-full" />
      </label>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Category">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 transition-colors ${cat === c ? 'bg-grass-500 text-pitch-950 ring-grass-400' : 'ring-white/15 text-chalk-200 hover:bg-white/5'}`}>{CATEGORY_LABEL[c] ?? c}</button>
        ))}
      </div>

      {error && <p className="text-chalk-300">Couldn't load the glossary. Is the API running?</p>}
      {letters.map((L) => (
        <section key={L} className="mb-6" aria-label={`Terms starting with ${L}`}>
          <h2 className="font-display text-xl text-grass-400 mb-2">{L}</h2>
          <div className="surface divide-y divide-white/8 overflow-hidden">
            {filtered.filter((t) => t.term[0].toUpperCase() === L).map((t) => {
              const isOpen = open === t.id
              return (
                <div key={t.id} id={t.id}>
                  <button onClick={() => setOpen(isOpen ? null : t.id)} aria-expanded={isOpen} className="w-full text-left p-4 hover:bg-white/5 transition-colors">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium text-chalk-50">{t.term}</span>
                      <span className="text-[10px] uppercase tracking-wider text-chalk-400">{CATEGORY_LABEL[t.category] ?? t.category}</span>
                    </span>
                    {!isOpen && <span className="block text-sm text-chalk-400 mt-0.5">{t.short_definition}</span>}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 -mt-1 space-y-3">
                      <p className="text-chalk-200">{t.short_definition}</p>
                      {t.long_explanation && <p className="text-sm text-chalk-300 leading-relaxed">{t.long_explanation}</p>}
                      {t.example && <p className="text-sm text-chalk-400 italic">Example: {t.example}</p>}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {(t.related_terms ?? []).filter((r) => terms.some((x) => x.id === r)).map((r) => (
                          <Link key={r} to={`/glossary#${r}`} className="text-xs bg-white/5 ring-1 ring-white/10 rounded-full px-2.5 py-1 text-chalk-200 hover:ring-grass-500/50">{termName(r)}</Link>
                        ))}
                        <button onClick={() => me.toggleBookmark('glossary', t.id)} aria-pressed={me.isBookmarked('glossary', t.id)} className="ml-auto inline-flex items-center gap-1 text-xs text-chalk-400 hover:text-gold-400">
                          <Bookmark size={13} fill={me.isBookmarked('glossary', t.id) ? 'currentColor' : 'none'} /> {me.isBookmarked('glossary', t.id) ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
      {!error && filtered.length === 0 && terms.length > 0 && <p className="text-chalk-400">No terms match.</p>}
    </div>
  )
}
