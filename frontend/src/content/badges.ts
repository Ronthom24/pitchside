// Generated shield badges: each club's well-known home-kit pattern + palette and a three-letter code.
// Deliberately NOT the clubs' trademarked crests. Colours are approximations of the kit, not official brand values.
export type Pattern = 'solid' | 'stripes' | 'hoops' | 'halves' | 'band' | 'hband' | 'sash'

export interface BadgeSpec {
  code: string
  pattern: Pattern
  colors: [string, string]
  trim?: string
}

const W = '#F4F4F2'

export const BADGES: Record<string, BadgeSpec> = {
  arsenal: { code: 'ARS', pattern: 'solid', colors: ['#D5141C', W], trim: W },
  'manchester-united': { code: 'MUN', pattern: 'solid', colors: ['#C8102E', '#111'], trim: '#FBE122' },
  liverpool: { code: 'LIV', pattern: 'solid', colors: ['#C8102E', '#00B2A9'], trim: '#F6EB61' },
  'manchester-city': { code: 'MCI', pattern: 'solid', colors: ['#6CABDD', W], trim: '#1C2C5B' },
  chelsea: { code: 'CHE', pattern: 'solid', colors: ['#034694', W], trim: W },
  'tottenham-hotspur': { code: 'TOT', pattern: 'solid', colors: [W, '#132257'], trim: '#132257' },
  'newcastle-united': { code: 'NEW', pattern: 'stripes', colors: ['#111', W], trim: W },
  'aston-villa': { code: 'AVL', pattern: 'halves', colors: ['#7B003C', '#94BEE5'], trim: '#94BEE5' },
  everton: { code: 'EVE', pattern: 'solid', colors: ['#003399', W], trim: W },
  'west-ham-united': { code: 'WHU', pattern: 'solid', colors: ['#7A263A', '#1BB1E7'], trim: '#1BB1E7' },
  'real-madrid': { code: 'RMA', pattern: 'solid', colors: [W, '#FEBE10'], trim: '#FEBE10' },
  barcelona: { code: 'FCB', pattern: 'stripes', colors: ['#A50044', '#004D98'], trim: '#EDBB00' },
  'atletico-madrid': { code: 'ATM', pattern: 'stripes', colors: ['#CB3524', W], trim: '#1B2A5B' },
  sevilla: { code: 'SEV', pattern: 'solid', colors: [W, '#D4021D'], trim: '#D4021D' },
  'bayern-munich': { code: 'FCB', pattern: 'solid', colors: ['#DC052D', '#0066B2'], trim: W },
  'borussia-dortmund': { code: 'BVB', pattern: 'solid', colors: ['#FDE100', '#111'], trim: '#111' },
  'bayer-leverkusen': { code: 'B04', pattern: 'halves', colors: ['#E32221', '#111'], trim: W },
  juventus: { code: 'JUV', pattern: 'stripes', colors: [W, '#111'], trim: '#111' },
  'inter-milan': { code: 'INT', pattern: 'stripes', colors: ['#0068A8', '#111'], trim: '#C9A227' },
  'ac-milan': { code: 'MIL', pattern: 'stripes', colors: ['#FB090B', '#111'], trim: W },
  napoli: { code: 'NAP', pattern: 'solid', colors: ['#12A0D7', W], trim: W },
  'as-roma': { code: 'ROM', pattern: 'solid', colors: ['#8E1F2F', '#F0BC42'], trim: '#F0BC42' },
  'paris-saint-germain': { code: 'PSG', pattern: 'band', colors: ['#004170', '#DA291C'], trim: W },
  ajax: { code: 'AJX', pattern: 'band', colors: [W, '#D2122E'], trim: '#D2122E' },
  benfica: { code: 'SLB', pattern: 'solid', colors: ['#E30613', W], trim: W },
  porto: { code: 'FCP', pattern: 'stripes', colors: ['#003E7E', W], trim: W },
  celtic: { code: 'CEL', pattern: 'hoops', colors: ['#138A4B', W], trim: '#138A4B' },
  rangers: { code: 'RFC', pattern: 'solid', colors: ['#1B458F', W], trim: '#C8102E' },
  'boca-juniors': { code: 'BOC', pattern: 'hband', colors: ['#103F91', '#F7B500'], trim: '#F7B500' },
  'river-plate': { code: 'RIV', pattern: 'sash', colors: [W, '#E4002B'], trim: '#E4002B' },
  flamengo: { code: 'FLA', pattern: 'hoops', colors: ['#C52613', '#111'], trim: '#111' },
  'al-hilal': { code: 'HIL', pattern: 'solid', colors: ['#0057A8', W], trim: W },
  'al-nassr': { code: 'NAS', pattern: 'solid', colors: ['#FFD200', '#0B3A82'], trim: '#0B3A82' },
  'inter-miami': { code: 'MIA', pattern: 'solid', colors: ['#F7B5CD', '#231F20'], trim: '#231F20' },
  galatasaray: { code: 'GAL', pattern: 'halves', colors: ['#A90432', '#FDB912'], trim: '#FDB912' },
  'mohun-bagan-super-giant': { code: 'MBS', pattern: 'halves', colors: ['#7A1F2B', '#0E7A4E'], trim: W },
  'east-bengal': { code: 'EBE', pattern: 'halves', colors: ['#D2232A', '#FFCC00'], trim: W },
  'bengaluru-fc': { code: 'BFC', pattern: 'solid', colors: ['#0B3A8F', W], trim: '#F0B323' },
  'mumbai-city-fc': { code: 'MCF', pattern: 'solid', colors: ['#6CC4F0', W], trim: '#1B3F8B' },
  'kerala-blasters': { code: 'KBF', pattern: 'solid', colors: ['#FFCC00', '#1C3F94'], trim: '#1C3F94' },
  'fc-goa': { code: 'FCG', pattern: 'solid', colors: ['#F58220', '#1C1C1C'], trim: '#1C1C1C' },
}

export function relativeLuminance(hex: string): number {
  const m = hex.replace('#', '')
  const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
