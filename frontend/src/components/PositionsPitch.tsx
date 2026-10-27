import PitchSurface from './PitchSurface'
import type { PositionInfo } from '../content/positions'

// Same mapping as FormationPitch: the team attacks left to right.
export default function PositionsPitch({
  positions, selected, onSelect,
}: {
  positions: PositionInfo[]
  selected: string | null
  onSelect: (code: string) => void
}) {
  return (
    <div className="relative w-full aspect-[560/363] rounded-2xl overflow-hidden ring-1 ring-white/10">
      <PitchSurface />
      {positions.map((p) => {
        const isSel = selected === p.code
        return (
          <button
            key={p.code}
            onClick={() => onSelect(p.code)}
            aria-pressed={isSel}
            aria-label={p.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
            style={{ left: `${(0.04 + p.y * 0.92) * 100}%`, top: `${p.x * 100}%` }}
          >
            <span
              className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full text-[11px] sm:text-xs font-bold border-2 transition-all ${
                isSel
                  ? 'bg-grass-500 text-pitch-950 border-grass-400 scale-110 shadow-lg shadow-grass-500/30'
                  : 'bg-pitch-900/90 text-chalk-50 border-white/25 group-hover:border-grass-400/70 group-hover:scale-105'
              }`}
            >
              {p.code}
            </span>
            <span className={`absolute bottom-full mb-1 text-[10px] font-semibold whitespace-nowrap ${isSel ? 'text-grass-400' : 'text-chalk-200 opacity-0 group-hover:opacity-100'} transition-opacity`}>
              {p.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
