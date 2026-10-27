import { Clock } from 'lucide-react'
import { timeAgo } from '../lib/format'

export function Freshness({ updatedAt, source }: { updatedAt?: string | null; source?: string | null }) {
  const ago = timeAgo(updatedAt)
  if (!ago) return null
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-chalk-400">
      <Clock size={12} /> Updated {ago}{source ? ` · ${source}` : ''}
    </span>
  )
}

export function AsOf({ value, what = 'Details' }: { value?: string | null; what?: string }) {
  if (!value) return null
  return <p className="text-xs text-chalk-400">{what} as of the {value} season. Squads, managers and counts change; check the club's official site for the latest.</p>
}
