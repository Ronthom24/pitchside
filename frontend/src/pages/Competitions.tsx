import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Competition } from '../lib/types'
import Reveal from '../components/Reveal'

const SECTIONS: { key: string; title: string; blurb: string }[] = [
  { key: 'continental_club', title: 'Continental club competitions', blurb: "Europe's three-tier club ladder." },
  { key: 'domestic_league', title: 'Domestic leagues', blurb: "A country's season-long league." },
  { key: 'international', title: 'International tournaments', blurb: 'National teams, every four years.' },
]

export default function Competitions() {
  const [comps, setComps] = useState<Competition[]>([])
  const [error, setError] = useState(false)
  useEffect(() => { api.competitions().then(setComps).catch(() => setError(true)) }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <p className="eyebrow mb-2">Competitions</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3">How the major competitions work</h1>
      <p className="text-chalk-300 mb-12 max-w-2xl">Formats, history and, where a live data source covers them, current tables and fixtures.</p>
      {error && <p className="text-chalk-300">Couldn't load competitions. Is the API running?</p>}
      {SECTIONS.map((s) => {
        const list = comps.filter((c) => c.category === s.key)
        if (!list.length) return null
        return (
          <section key={s.key} className="mb-12">
            <h2 className="font-display text-2xl font-semibold">{s.title}</h2>
            <p className="text-sm text-chalk-400 mb-4">{s.blurb}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.05}>
                  <Link to={`/competitions/${c.id}`} className="surface surface-hover p-5 block h-full">
                    <p className="font-semibold text-chalk-50 text-lg">{c.name}</p>
                    <p className="text-xs text-chalk-400 mt-1">{c.founded_year ? `Since ${c.founded_year}` : ''}</p>
                    {c.live_data_available && <span className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-wider text-grass-400 bg-grass-500/10 rounded-full px-2 py-0.5">Live table and fixtures</span>}
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
