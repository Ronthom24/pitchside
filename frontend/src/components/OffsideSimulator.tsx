import { useState } from 'react'

export default function OffsideSimulator() {
  const [attackerX, setAttackerX] = useState(70)
  const [defenderX, setDefenderX] = useState(55)
  const isOffside = attackerX > defenderX

  return (
    <div className="rounded-2xl ring-1 ring-white/10 bg-pitch-900 p-5 sm:p-6">
      <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-[#0f2018] mb-6">
        <div className="absolute inset-y-0 right-0 w-2 bg-white/40" />
        <div
          className="absolute inset-y-0 w-0.5 bg-gold-400/70"
          style={{ left: `${defenderX}%` }}
        >
          <span className="absolute -top-6 -translate-x-1/2 text-[10px] font-semibold text-gold-400 whitespace-nowrap">Last defender</span>
        </div>
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 top-[35%] flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-pitch-950 text-[10px] font-bold border-2 border-white"
          style={{ left: `${defenderX}%` }}
        >
          DEF
        </div>
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 top-[65%] flex items-center justify-center w-9 h-9 rounded-full text-[10px] font-bold border-2 transition-colors ${
            isOffside ? 'bg-red-500 border-red-300 text-white' : 'bg-grass-500 border-grass-300 text-pitch-950'
          }`}
          style={{ left: `${attackerX}%` }}
        >
          ATT
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex justify-between text-sm text-chalk-200 mb-1">
            <span>Attacker position</span><span className="text-chalk-400">{attackerX}%</span>
          </label>
          <input type="range" min={20} max={95} value={attackerX} onChange={(e) => setAttackerX(Number(e.target.value))} className="w-full accent-grass-500" />
        </div>
        <div>
          <label className="flex justify-between text-sm text-chalk-200 mb-1">
            <span>Last defender position</span><span className="text-chalk-400">{defenderX}%</span>
          </label>
          <input type="range" min={20} max={95} value={defenderX} onChange={(e) => setDefenderX(Number(e.target.value))} className="w-full accent-gold-500" />
        </div>
      </div>

      <div className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${isOffside ? 'bg-red-500/15 text-red-300' : 'bg-grass-500/15 text-grass-400'}`}>
        {isOffside
          ? 'Offside — the attacker is nearer the goal line than the last defender when the ball is played.'
          : 'Not offside — the attacker is level with or behind the last defender.'}
      </div>
    </div>
  )
}
