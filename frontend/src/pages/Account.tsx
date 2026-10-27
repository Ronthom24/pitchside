import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useMe } from '../lib/me'

export default function Account() {
  const { user, login, register } = useMe()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/my-pitchside" replace />

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password, name || undefined)
      navigate('/my-pitchside')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const field = 'w-full bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-3 text-chalk-50 placeholder:text-chalk-400 outline-none focus:ring-grass-500/60'

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <p className="eyebrow mb-2">Your football journey</p>
      <h1 className="font-display text-4xl font-semibold mb-2">{mode === 'register' ? 'Create your account' : 'Welcome back'}</h1>
      <p className="text-chalk-400 mb-8">An account keeps your followed clubs, lesson progress and bookmarks safe across devices. Anything you've already saved on this device is carried over.</p>

      <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-full mb-6" role="tablist">
        {(['register', 'login'] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setError(null) }}
            className={`py-2 rounded-full text-sm font-semibold transition-colors ${mode === m ? 'bg-grass-500 text-pitch-950' : 'text-chalk-200'}`}>
            {m === 'register' ? 'Create account' : 'Sign in'}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label htmlFor="name" className="block text-sm text-chalk-200 mb-1.5">Display name <span className="text-chalk-400">(optional)</span></label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="nickname" className={field} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm text-chalk-200 mb-1.5">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-chalk-200 mb-1.5">Password {mode === 'register' && <span className="text-chalk-400">(8+ characters)</span>}</label>
          <input id="password" type="password" required minLength={mode === 'register' ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'} className={field} />
        </div>
        {error && <p role="alert" className="text-sm text-red-300 bg-red-500/10 ring-1 ring-red-500/30 rounded-xl px-4 py-3">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-grass-500 text-pitch-950 font-semibold py-3 hover:bg-grass-400 transition-colors disabled:opacity-60">
          {busy ? 'One moment…' : mode === 'register' ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
