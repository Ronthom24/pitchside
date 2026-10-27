import { useEffect, useId, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Pause, Play, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { DIAGRAMS, buildFrames, type P } from '../content/diagrams'

const L = 154 // pitch length in drawing units (105 m); width is 100 units (68 m)
const W = 100

function Pitch() {
  const line = 'rgba(255,255,255,0.3)'
  return (
    <g fill="none" stroke={line} strokeWidth="0.4">
      <rect x="0" y="0" width={L} height={W} />
      <line x1={L / 2} y1="0" x2={L / 2} y2={W} />
      <circle cx={L / 2} cy={W / 2} r="13.5" />
      <circle cx={L / 2} cy={W / 2} r="0.6" fill={line} />
      {/* attacking end (right) */}
      <rect x={L - 24.3} y="20.4" width="24.3" height="59.2" />
      <rect x={L - 8.1} y="36.5" width="8.1" height="27" />
      <path d={`M ${L - 24.3} 39.2 A 13.5 13.5 0 0 0 ${L - 24.3} 60.8`} />
      <circle cx={L - 16.2} cy={W / 2} r="0.6" fill={line} />
      {/* own end (left) */}
      <rect x="0" y="20.4" width="24.3" height="59.2" />
      <rect x="0" y="36.5" width="8.1" height="27" />
      <path d="M 24.3 39.2 A 13.5 13.5 0 0 1 24.3 60.8" />
      <circle cx="16.2" cy={W / 2} r="0.6" fill={line} />
    </g>
  )
}

function Goal({ flash, id }: { flash: boolean; id: string }) {
  return (
    <g>
      <defs>
        <pattern id={`${id}net`} width="1.6" height="1.6" patternUnits="userSpaceOnUse">
          <path d="M0 0 L1.6 0 M0 0 L0 1.6" stroke="rgba(255,255,255,0.55)" strokeWidth="0.15" />
        </pattern>
      </defs>
      <rect x={L} y="44.6" width="3.2" height="10.8" fill={flash ? 'rgba(243,209,138,0.55)' : `url(#${id}net)`} stroke="#fff" strokeWidth="0.5" />
      <rect x="-3.2" y="44.6" width="3.2" height="10.8" fill={`url(#${id}net)`} stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
    </g>
  )
}

export default function TacticDiagram({ id }: { id: string }) {
  const spec = DIAGRAMS[id]
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const frames = useMemo(() => (spec ? buildFrames(spec) : []), [spec])
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => { setI(0); setPlaying(true) }, [id])
  const current = frames[i]
  useEffect(() => {
    if (!playing || reduce || frames.length < 2) return
    const t = setTimeout(() => setI((n) => (n + 1) % frames.length), current?.goal ? 4600 : 3400)
    return () => clearTimeout(t)
  }, [playing, reduce, frames.length, i, current?.goal])

  if (!spec || !current) return null
  const f = current
  // 'half' diagrams are authored on the attacking half, so they are stretched along the pitch.
  const stretch = spec.view === 'half' ? 1.36 : 1
  const T = ([x, y]: P): P => [L - y * stretch, x]
  const tween = { duration: reduce ? 0 : 0.95, ease: [0.45, 0, 0.2, 1] as [number, number, number, number] }
  const go = (n: number) => { setPlaying(false); setI((n + frames.length) % frames.length) }
  const last = i === frames.length - 1

  return (
    <div className="surface p-4 sm:p-5">
      <div className="relative">
        <svg viewBox={`-6 -4 ${L + 12} ${W + 8}`} className="w-full rounded-xl bg-[#0e1f17]" role="img" aria-label={f.caption}>
          <defs>
            {(['pass', 'run', 'shot'] as const).map((k) => (
              <marker key={k} id={`${uid}-${k}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M0,0 L6,3 L0,6 z" fill={k === 'pass' ? '#f3d18a' : k === 'run' ? '#6ee7a0' : '#ffffff'} />
              </marker>
            ))}
          </defs>
          {Array.from({ length: 14 }).map((_, k) => (
            <rect key={k} x={k * (L / 14)} y="0" width={L / 14 + 0.05} height={W} fill={k % 2 ? '#102319' : '#0e1f17'} />
          ))}
          <Pitch />
          <Goal flash={f.goal} id={uid} />

          {f.zones.map((z, k) => {
            const [x1, y1] = T([z.x, z.y])
            const [x2, y2] = T([z.x + z.w, z.y + z.h])
            const rx = Math.min(x1, x2), ry = Math.min(y1, y2), rw = Math.abs(x2 - x1), rh = Math.abs(y2 - y1)
            const warn = z.tone === 'warn'
            return (
              <g key={`${i}-${k}`}>
                <rect x={rx} y={ry} width={rw} height={rh} rx="1.5" fill={warn ? 'rgba(239,68,68,0.14)' : 'rgba(61,220,132,0.14)'}
                  stroke={warn ? 'rgba(239,68,68,0.55)' : 'rgba(61,220,132,0.55)'} strokeWidth="0.35" strokeDasharray="1.5 1.5" />
                {z.label && <text x={rx + rw / 2} y={ry + rh / 2 + 1} textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.8)">{z.label}</text>}
              </g>
            )
          })}

          {f.arrows.map((ar, k) => {
            const [x1, y1] = T(ar.from), [x2, y2] = T(ar.to)
            return (
              <line key={`${i}-a${k}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={ar.kind === 'pass' ? '#f3d18a' : ar.kind === 'run' ? '#6ee7a0' : '#ffffff'} strokeWidth={ar.kind === 'shot' ? 0.9 : 0.6}
                className={ar.kind === 'run' ? 'arrow-run' : undefined} markerEnd={`url(#${uid}-${ar.kind})`} opacity="0.95" />
            )
          })}

          {Object.entries(f.b).map(([k, p]) => {
            const [cx, cy] = T(p)
            return <motion.circle key={`b${k}`} r={k === 'GK' ? 3.1 : 2.9} fill={k === 'GK' ? '#f3d18a' : '#e9ecea'} stroke="#7d867f" strokeWidth="0.4" initial={false} animate={{ cx, cy }} transition={tween} />
          })}
          {Object.entries(f.a).map(([k, p]) => {
            const [cx, cy] = T(p)
            return (
              <g key={`a${k}`}>
                <motion.circle r="3.1" fill="#3ddc84" stroke="#0b120e" strokeWidth="0.4" initial={false} animate={{ cx, cy }} transition={tween} />
                <motion.text fontSize="2.3" fontWeight="700" fill="#06110b" textAnchor="middle" initial={false} animate={{ x: cx, y: cy + 0.85 }} transition={tween}>
                  {k.replace(/\d/g, '')}
                </motion.text>
              </g>
            )
          })}
          {(() => {
            const [bx, by] = T(f.ball)
            return <motion.circle r="1.5" fill="#fff" stroke="#111" strokeWidth="0.3" initial={false} animate={{ cx: bx, cy: by }} transition={{ ...tween, duration: reduce ? 0 : f.goal ? 0.45 : 0.95 }} />
          })()}
        </svg>

        <AnimatePresence>
          {f.goal && (
            <motion.div key="goal" initial={reduce ? false : { opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-gold-400 px-5 py-1.5 font-display text-lg font-bold tracking-wide text-pitch-950 shadow-lg">
              GOAL!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 min-h-[3.2rem] text-sm sm:text-[0.95rem] text-chalk-200" aria-live="polite">{f.caption}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Diagram steps">
          {frames.map((fr, k) => (
            <button key={k} onClick={() => go(k)} aria-label={`Step ${k + 1}${fr.goal ? ' (goal)' : ''}`} role="tab" aria-selected={k === i}
              className={`h-1.5 rounded-full transition-all ${k === i ? 'w-6' : 'w-3 hover:bg-white/40'} ${k === i ? (fr.goal ? 'bg-gold-400' : 'bg-grass-500') : fr.goal ? 'bg-gold-400/40' : 'bg-white/20'}`} />
          ))}
        </div>
        <div className="flex items-center gap-1 text-chalk-200">
          <button onClick={() => go(0)} className="p-2 rounded-full hover:bg-white/10" aria-label="Restart"><RotateCcw size={15} /></button>
          <button onClick={() => go(i - 1)} className="p-2 rounded-full hover:bg-white/10" aria-label="Previous step"><ChevronLeft size={18} /></button>
          <button onClick={() => setPlaying((p) => !p)} className="p-2 rounded-full hover:bg-white/10" aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={() => go(last ? 0 : i + 1)} className="p-2 rounded-full hover:bg-white/10" aria-label="Next step"><ChevronRight size={18} /></button>
        </div>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-chalk-400">
        <span><span className="inline-block w-2 h-2 rounded-full bg-grass-500 mr-1" />Team in focus (attacking right)</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-chalk-50 mr-1" />Opponent</span>
        <span><span className="inline-block w-3 border-t-2 border-dashed border-grass-400 mr-1 align-middle" />Run</span>
        <span><span className="inline-block w-3 border-t-2 border-gold-400 mr-1 align-middle" />Pass</span>
        <span><span className="inline-block w-3 border-t-2 border-white mr-1 align-middle" />Shot</span>
      </p>
    </div>
  )
}
