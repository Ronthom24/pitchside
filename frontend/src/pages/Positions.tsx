import { useState } from 'react'
import PositionsPitch from '../components/PositionsPitch'
import { POSITIONS } from '../content/positions'

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

export default function Positions() {
  const [selected, setSelected] = useState<string | null>('ST')
  const pos = POSITIONS.find((p) => p.code === selected)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-5">
        <p className="eyebrow">Positions</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">Tap a position to learn the role</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr] items-start">
        <div>
          <PositionsPitch positions={POSITIONS} selected={selected} onSelect={setSelected} />
          <p className="text-xs text-chalk-400 mt-2">The team attacks from left to right.</p>
        </div>

        {pos && (
          <div className="surface p-5">
            <p className="eyebrow">{pos.group}</p>
            <h2 className="font-display text-3xl font-semibold mb-1">{pos.name}</h2>
            <p className="text-chalk-200 text-sm mb-4">{pos.whereTheyPlay}</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
              <Block title="Without the ball"><ul className={list}>{pos.defensiveResponsibilities.map((d) => <li key={d}>{d}</li>)}</ul></Block>
              <Block title="With the ball"><ul className={list}>{pos.attackingResponsibilities.map((d) => <li key={d}>{d}</li>)}</ul></Block>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/10">
              <Block title="Typical attributes"><div className="flex flex-wrap gap-1.5">{pos.typicalAttributes.map((a) => <span key={a} className="text-xs bg-white/5 ring-1 ring-white/10 rounded-full px-2.5 py-1 text-chalk-200">{a}</span>)}</div></Block>
              <Block title="Variations"><p className={para}>{pos.variations}</p></Block>
              <Block title="Famous examples"><div className="flex flex-wrap gap-1.5">{pos.famousExamples.map((f) => <span key={f} className="text-xs bg-grass-500/10 text-grass-400 ring-1 ring-grass-500/20 rounded-full px-2.5 py-1">{f}</span>)}</div></Block>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
