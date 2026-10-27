import type {
  Club, ClubDetail, ClubLive, Player, PlayerDetail, Competition, GlossaryTerm, LessonTopic, ClubMatch,
  SearchResults, HistoryEvent, HistoryEra, LiveMatches, Standings, MyState, AuthUser,
} from './types'

// In dev, Vite proxies /api to the backend. In production set VITE_API_URL to the deployed API origin.
const API_BASE = `${(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')}/api`
const TOKEN_KEY = 'pitchside:token'

export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } },
  set: (t: string) => { try { localStorage.setItem(TOKEN_KEY, t) } catch { /* storage unavailable */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY) } catch { /* storage unavailable */ } },
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = tokenStore.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body) headers.set('Content-Type', 'application/json')
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (typeof body.detail === 'string') detail = body.detail
      else if (Array.isArray(body.detail)) detail = body.detail.map((d: { msg: string }) => d.msg).join('; ')
    } catch { /* non-JSON error body */ }
    throw new ApiError(res.status, detail)
  }
  return res.json()
}

const qs = (params?: Record<string, string>) => (params && Object.keys(params).length ? '?' + new URLSearchParams(params) : '')

export const api = {
  clubs: (params?: Record<string, string>) => request<Club[]>(`/clubs${qs(params)}`),
  club: (id: string) => request<ClubDetail>(`/clubs/${id}`),
  clubSquad: (id: string) => request<Player[]>(`/clubs/${id}/squad`),
  clubAlumni: (id: string) => request<{ player: Player; start_year?: number | null; end_year?: number | null }[]>(`/clubs/${id}/alumni`),
  clubLive: (id: string) => request<ClubLive>(`/live/clubs/${id}/matches`),
  matchClubs: (preferences: Record<string, boolean>) =>
    request<ClubMatch[]>('/clubs/match', { method: 'POST', body: JSON.stringify(preferences) }),
  players: (params?: Record<string, string>) => request<Player[]>(`/players${qs(params)}`),
  player: (id: string) => request<PlayerDetail>(`/players/${id}`),
  competitions: (params?: Record<string, string>) => request<Competition[]>(`/competitions${qs(params)}`),
  competition: (id: string) => request<Competition>(`/competitions/${id}`),
  competitionClubs: (id: string) => request<Club[]>(`/competitions/${id}/clubs`),
  standings: (id: string) => request<Standings>(`/live/competitions/${id}/standings`),
  competitionMatches: (id: string) => request<LiveMatches>(`/live/competitions/${id}/matches`),
  glossary: (params?: Record<string, string>) => request<GlossaryTerm[]>(`/glossary${qs(params)}`),
  lessons: (level?: number) => request<LessonTopic[]>(`/lessons${level ? `?level=${level}` : ''}`),
  lesson: (id: string) => request<LessonTopic>(`/lessons/${id}`),
  history: (params?: Record<string, string>) =>
    request<{ eras: HistoryEra[]; events: HistoryEvent[] }>(`/history${qs(params)}`),
  search: (q: string) => request<SearchResults>(`/search?q=${encodeURIComponent(q)}`),

  register: (email: string, password: string, display_name?: string) =>
    request<{ token: string; user: AuthUser }>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, display_name }) }),
  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request<MyState>('/me'),
  follow: (clubId: string, primary = false) => request<unknown>(`/me/follows/${clubId}?primary=${primary}`, { method: 'PUT' }),
  unfollow: (clubId: string) => request<unknown>(`/me/follows/${clubId}`, { method: 'DELETE' }),
  setProgress: (lessonId: string, completed: boolean, quizScore?: number) =>
    request<unknown>(`/me/progress/${lessonId}`, { method: 'PUT', body: JSON.stringify({ completed, quiz_score: quizScore }) }),
  addBookmark: (kind: string, refId: string) => request<unknown>('/me/bookmarks', { method: 'POST', body: JSON.stringify({ kind, ref_id: refId }) }),
  removeBookmark: (kind: string, refId: string) => request<unknown>(`/me/bookmarks/${kind}/${refId}`, { method: 'DELETE' }),
}
