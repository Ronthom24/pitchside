import PitchSurface from './PitchSurface'
import type { FormationPlayer } from '../content/formations'

// Data is stored as x = across the pitch (0 = left flank), y = up the pitch (0 = own goal).
// On the landscape pitch the team attacks left to right: screen x = y, screen y = x (their left flank is the top).
export default function FormationPitch({ players }: { players: FormationPlayer[] }) {
  return (
    <div className="relative w-full aspect-[560/363] rounded-2xl overflow-hidden ring-1 ring-white/10">
      <PitchSurface />
      {players.map((p, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full text-[11px] sm:text-xs font-bold bg-grass-500 text-pitch-950 border-2 border-grass-400 shadow-lg shadow-grass-500/20 transition-all duration-500"
          style={{ left: `${(0.04 + p.y * 0.92) * 100}%`, top: `${p.x * 100}%` }}
        >
          {p.code}
        </div>
      ))}
    </div>
  )
}
