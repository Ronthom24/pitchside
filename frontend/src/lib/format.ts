export function timeAgo(iso?: string | null): string | null {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(diff)) return null
  const mins = Math.max(0, Math.round(diff / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `${hours} h ago`
  return `${Math.round(hours / 24)} days ago`
}

export function formatKickoff(iso?: string | null): string {
  if (!iso) return 'TBC'
  return new Date(iso).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ageFrom(birth?: string | null, death?: string | null): number | null {
  if (!birth) return null
  const end = death ? new Date(death) : new Date()
  const b = new Date(birth)
  let age = end.getFullYear() - b.getFullYear()
  if (end.getMonth() < b.getMonth() || (end.getMonth() === b.getMonth() && end.getDate() < b.getDate())) age--
  return age
}
