import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, tokenStore } from './api'
import { ACCOUNTS_ENABLED } from './flags'
import type { AuthUser } from './types'

interface Local {
  follows: { club_id: string; is_primary: boolean }[]
  progress: Record<string, { completed: boolean; best_quiz_score?: number | null }>
  bookmarks: { kind: string; ref_id: string }[]
}

const LOCAL_KEY = 'pitchside:local:v2'
const EMPTY: Local = { follows: [], progress: {}, bookmarks: [] }

function readLocal(): Local {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}
function writeLocal(l: Local) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(l)) } catch { /* storage unavailable */ }
}

interface MeContextValue {
  ready: boolean
  user: AuthUser | null
  follows: Local['follows']
  primaryClubId: string | null
  isFollowing: (clubId: string) => boolean
  follow: (clubId: string, primary?: boolean) => Promise<void>
  unfollow: (clubId: string) => Promise<void>
  progress: Local['progress']
  isComplete: (lessonId: string) => boolean
  completeLesson: (lessonId: string, quizScore?: number) => Promise<void>
  bookmarks: Local['bookmarks']
  isBookmarked: (kind: string, refId: string) => boolean
  toggleBookmark: (kind: string, refId: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<MeContextValue | null>(null)

export function MeProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [state, setState] = useState<Local>(readLocal)

  const loadServer = useCallback(async () => {
    const me = await api.me()
    setUser(me.user)
    setState({
      follows: me.followed_clubs,
      progress: Object.fromEntries(me.progress.map((p) => [p.lesson_id, { completed: p.completed, best_quiz_score: p.best_quiz_score }])),
      bookmarks: me.bookmarks,
    })
  }, [])

  useEffect(() => {
    if (!ACCOUNTS_ENABLED || !tokenStore.get()) { setReady(true); return }
    loadServer().catch(() => { tokenStore.clear() }).finally(() => setReady(true))
  }, [loadServer])

  // Anonymous visitors keep progress on-device; it is merged into the account on sign-in.
  const mutateLocal = (fn: (l: Local) => Local) => setState((s) => { const n = fn(s); if (!user) writeLocal(n); return n })

  const mergeLocalIntoAccount = useCallback(async () => {
    const local = readLocal()
    for (const f of local.follows) await api.follow(f.club_id, f.is_primary).catch(() => {})
    for (const [id, p] of Object.entries(local.progress)) await api.setProgress(id, p.completed, p.best_quiz_score ?? undefined).catch(() => {})
    for (const b of local.bookmarks) await api.addBookmark(b.kind, b.ref_id).catch(() => {})
    try { localStorage.removeItem(LOCAL_KEY) } catch { /* ignore */ }
  }, [])

  const value = useMemo<MeContextValue>(() => ({
    ready, user,
    follows: state.follows,
    primaryClubId: state.follows.find((f) => f.is_primary)?.club_id ?? state.follows[0]?.club_id ?? null,
    isFollowing: (id) => state.follows.some((f) => f.club_id === id),
    follow: async (clubId, primary = false) => {
      if (user) { await api.follow(clubId, primary); await loadServer(); return }
      mutateLocal((l) => {
        const had = l.follows.length > 0
        const rest = l.follows.filter((f) => f.club_id !== clubId).map((f) => (primary ? { ...f, is_primary: false } : f))
        return { ...l, follows: [...rest, { club_id: clubId, is_primary: primary || !had }] }
      })
    },
    unfollow: async (clubId) => {
      if (user) { await api.unfollow(clubId); await loadServer(); return }
      mutateLocal((l) => {
        const rest = l.follows.filter((f) => f.club_id !== clubId)
        if (rest.length && !rest.some((f) => f.is_primary)) rest[0] = { ...rest[0], is_primary: true }
        return { ...l, follows: rest }
      })
    },
    progress: state.progress,
    isComplete: (id) => !!state.progress[id]?.completed,
    completeLesson: async (lessonId, quizScore) => {
      if (user) { await api.setProgress(lessonId, true, quizScore); await loadServer(); return }
      mutateLocal((l) => ({ ...l, progress: { ...l.progress, [lessonId]: { completed: true, best_quiz_score: Math.max(l.progress[lessonId]?.best_quiz_score ?? 0, quizScore ?? 0) || null } } }))
    },
    bookmarks: state.bookmarks,
    isBookmarked: (kind, refId) => state.bookmarks.some((b) => b.kind === kind && b.ref_id === refId),
    toggleBookmark: async (kind, refId) => {
      const has = state.bookmarks.some((b) => b.kind === kind && b.ref_id === refId)
      if (user) { await (has ? api.removeBookmark(kind, refId) : api.addBookmark(kind, refId)); await loadServer(); return }
      mutateLocal((l) => ({ ...l, bookmarks: has ? l.bookmarks.filter((b) => !(b.kind === kind && b.ref_id === refId)) : [...l.bookmarks, { kind, ref_id: refId }] }))
    },
    login: async (email, password) => {
      const res = await api.login(email, password)
      tokenStore.set(res.token)
      await mergeLocalIntoAccount()
      await loadServer()
    },
    register: async (email, password, name) => {
      const res = await api.register(email, password, name)
      tokenStore.set(res.token)
      await mergeLocalIntoAccount()
      await loadServer()
    },
    logout: () => { tokenStore.clear(); setUser(null); setState(EMPTY) },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [ready, user, state, loadServer, mergeLocalIntoAccount])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMe(): MeContextValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useMe must be used inside MeProvider')
  return v
}
