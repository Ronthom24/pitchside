import { useId } from 'react'
import type { Club } from '../lib/types'
import { BADGES, relativeLuminance, type BadgeSpec } from '../content/badges'

const SHIELD = 'M7 5 H93 V56 C93 86 72 105 50 116 C28 105 7 86 7 56 Z'

function fallbackSpec(club: Club): BadgeSpec {
  const name = (club.short_name || club.name).replace(/[^A-Za-z ]/g, '')
  const words = name.split(' ').filter(Boolean)
  const code = (words.length > 1 ? words.map((w) => w[0]).join('') : name).slice(0, 3).toUpperCase()
  return { code, pattern: 'solid', colors: [club.primary_color || '#1f3327', club.secondary_color || '#F4F4F2'] }
}

function Pattern({ spec }: { spec: BadgeSpec }) {
  const [a, b] = spec.colors
  switch (spec.pattern) {
    case 'stripes':
      return <>{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={i * 14.3} y="0" width="14.4" height="120" fill={i % 2 ? b : a} />)}</>
    case 'hoops':
      return <>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x="0" y={i * 15} width="100" height="15.1" fill={i % 2 ? b : a} />)}</>
    case 'halves':
      return <><rect width="100" height="120" fill={a} /><rect x="50" width="50" height="120" fill={b} /></>
    case 'band':
      return <><rect width="100" height="120" fill={a} /><rect x="39" width="22" height="120" fill={b} /></>
    case 'hband':
      return <><rect width="100" height="120" fill={a} /><rect y="42" width="100" height="30" fill={b} /></>
    case 'sash':
      return <><rect width="100" height="120" fill={a} /><polygon points="-10,10 18,-10 112,98 84,128" fill={b} /></>
    default:
      return <rect width="100" height="120" fill={a} />
  }
}

export default function ClubBadge({ club, size = 44 }: { club: Club; size?: number }) {
  const uid = useId().replace(/:/g, '')
  const spec = BADGES[club.id] ?? fallbackSpec(club)
  const trim = spec.trim ?? spec.colors[1]
  // Pick the text colour with the best contrast against the busiest area of the pattern.
  const lum = spec.pattern === 'solid' || spec.pattern === 'band' || spec.pattern === 'sash' || spec.pattern === 'hband'
    ? relativeLuminance(spec.colors[0]) : (relativeLuminance(spec.colors[0]) + relativeLuminance(spec.colors[1])) / 2
  const light = lum > 0.38
  const fill = light ? '#10151a' : '#ffffff'
  const halo = light ? 'rgba(255,255,255,0.0)' : 'rgba(0,0,0,0.55)'
  const fontSize = spec.code.length > 3 ? 25 : 31
  const busy = spec.pattern === 'stripes' || spec.pattern === 'hoops' || spec.pattern === 'halves' || spec.pattern === 'sash'

  return (
    <svg viewBox="0 0 100 121" width={size * 0.84} height={size} className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]" role="img" aria-label={`${club.name} badge`}>
      <defs>
        <clipPath id={`${uid}c`}><path d={SHIELD} /></clipPath>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" /><stop offset="0.45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill="#0b0f0d" transform="translate(0 0)" stroke="#0b0f0d" strokeWidth="9" strokeLinejoin="round" />
      <g clipPath={`url(#${uid}c)`}><Pattern spec={spec} /><rect width="100" height="121" fill={`url(#${uid}g)`} /></g>
      <path d={SHIELD} fill="none" stroke={trim} strokeWidth="4" strokeLinejoin="round" />
      <path d="M13 11 H87" stroke={trim} strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
      {busy && <rect x="7" y="41" width="86" height="30" fill="#0b0f0d" fillOpacity="0.86" stroke={trim} strokeWidth="1.5" />}
      <text x="50" y="62" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontWeight="800" fontSize={fontSize} letterSpacing="0.5"
        fill={busy ? '#ffffff' : fill} stroke={busy ? 'none' : halo} strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">{spec.code}</text>
    </svg>
  )
}
