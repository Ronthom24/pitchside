import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormationPitch from '../components/FormationPitch'
import { FORMATIONS } from '../content/formations'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-grass-400 mb-1">{title}</h3>
      {children}
    </div>
  )
}

const list = 'text-[13px] leading-snug text-chalk-300 space-y-1 list-disc pl-4'
const para = 'text-[13px] leading-snug text-chalk-300'

export default function Formations() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [compareId, setCompareId] = useState<string | null>(null)
  const active = FORMATIONS.find((f) => f.id === id) || FORMATIONS[1]
  const compare = FORMATIONS.find((f) => f.id === compareId)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 mb-5">
        <div>
          <p className="eyebrow">Formations</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">Same eleven, different shapes</h1>
        </div>
        <div className="flex flex-wrap gap-1.5 lg:ml-auto" role="group" aria-label="Formation">
          {FORMATIONS.map((f) => (
            <button key={f.id} onClick={() => navigate(`/formations/${f.id}`)} aria-pressed={active.id === f.id}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold ring-1 transition-colors ${active.id === f.id ? 'bg-grass-500 text-pitch-950 ring-grass-400' : 'ring-white/15 text-chalk-200 hover:bg-white/5'}`}>{f.name}</button>
          ))}
        </div>
      </div>

      {compare ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {[active, compare].map((f) => (
            <div key={f.id}>
              <p className="font-display text-xl mb-2">{f.name}</p>
              <FormationPitch players={f.players} />
              <p className="text-[13px] text-chalk-300 mt-2">{f.shapeSummary}</p>
            </div>
          ))}
          <button onClick={() => setCompareId(null)} className="lg:col-span-2 justify-self-start text-sm text-grass-400 hover:text-grass-300">← Back to {active.name} details</button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr] items-start">
          <FormationPitch players={active.players} />
          <div className="surface p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
              <h2 className="font-display text-3xl font-semibold">{active.name}</h2>
              <label className="text-sm text-chalk-400">
                Compare with{' '}
                <select onChange={(e) => setCompareId(e.target.value || null)} defaultValue="" className="bg-pitch-800 ring-1 ring-white/10 rounded-lg px-2 py-1 text-chalk-50 ml-1">
                  <option value="">choose…</option>
                  {FORMATIONS.filter((f) => f.id !== active.id).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </label>
            </div>
            <p className="text-chalk-200 text-sm mb-4">{active.shapeSummary}</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
              <Block title="Strengths"><ul className={list}>{active.strengths.map((s) => <li key={s}>{s}</li>)}</ul></Block>
              <Block title="Weaknesses"><ul className={list}>{active.weaknesses.map((s) => <li key={s}>{s}</li>)}</ul></Block>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/10">
              <Block title="Build-up"><p className={para}>{active.buildUp}</p></Block>
              <Block title="Pressing"><p className={para}>{active.pressing}</p></Block>
              <Block title="Famous users"><p className={para}>{active.famousUsers}</p></Block>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
