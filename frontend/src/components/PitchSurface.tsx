// Landscape pitch, 105 x 68 m drawn at 5.33 px per metre. The team in focus attacks left to right.
export default function PitchSurface() {
  const line = 'rgba(255,255,255,0.32)'
  return (
    <svg viewBox="0 0 560 363" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
      <rect width="560" height="363" fill="#0f2018" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={i * 56} y="0" width="56" height="363" fill={i % 2 === 0 ? '#122619' : '#0f2018'} />
      ))}
      <g stroke={line} strokeWidth="2" fill="none">
        <rect x="6" y="6" width="548" height="351" />
        <line x1="280" y1="6" x2="280" y2="357" />
        <circle cx="280" cy="181.5" r="49" />
        <circle cx="280" cy="181.5" r="2.5" fill={line} />
        <rect x="6" y="74" width="88" height="215" />
        <rect x="6" y="132" width="29" height="99" />
        <path d="M 94 150 A 49 49 0 0 1 94 213" />
        <circle cx="65" cy="181.5" r="2.5" fill={line} />
        <rect x="466" y="74" width="88" height="215" />
        <rect x="525" y="132" width="29" height="99" />
        <path d="M 466 150 A 49 49 0 0 0 466 213" />
        <circle cx="495" cy="181.5" r="2.5" fill={line} />
      </g>
    </svg>
  )
}
