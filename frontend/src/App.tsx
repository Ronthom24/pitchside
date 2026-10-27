import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Layout from './components/Layout'
import { ACCOUNTS_ENABLED } from './lib/flags'
import Home from './pages/Home'
const Learn = lazy(() => import('./pages/Learn'))
const LessonDetail = lazy(() => import('./pages/LessonDetail'))
const Positions = lazy(() => import('./pages/Positions'))
const Formations = lazy(() => import('./pages/Formations'))
const Tactics = lazy(() => import('./pages/Tactics'))
const Clubs = lazy(() => import('./pages/Clubs'))
const ClubDetail = lazy(() => import('./pages/ClubDetail'))
const Competitions = lazy(() => import('./pages/Competitions'))
const CompetitionDetail = lazy(() => import('./pages/CompetitionDetail'))
const Players = lazy(() => import('./pages/Players'))
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'))
const Glossary = lazy(() => import('./pages/Glossary'))
const History = lazy(() => import('./pages/History'))
const FindYourClub = lazy(() => import('./pages/FindYourClub'))
const Search = lazy(() => import('./pages/Search'))
const MyPitchside = lazy(() => import('./pages/MyPitchside'))
const Account = lazy(() => import('./pages/Account'))

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-28 text-center">
      <p className="eyebrow mb-3">Offside</p>
      <h1 className="font-display text-4xl font-semibold mb-3">That page isn't on the pitch.</h1>
      <p className="text-chalk-400 mb-8">The link may be old, or the page may have moved.</p>
      <Link to="/" className="inline-flex rounded-full bg-grass-500 text-pitch-950 font-semibold px-6 py-3">Back to the home page</Link>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <Layout>
      <motion.div key={location.pathname}
          initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}>
          <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-chalk-400" role="status">Loading…</div>}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:id" element={<LessonDetail />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/formations/:id" element={<Formations />} />
            <Route path="/tactics" element={<Tactics />} />
            <Route path="/tactics/:id" element={<Tactics />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:id" element={<ClubDetail />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/:id" element={<CompetitionDetail />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerDetail />} />
            <Route path="/history" element={<History />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/find-your-club" element={<FindYourClub />} />
            <Route path="/search" element={<Search />} />
            <Route path="/my-pitchside" element={<MyPitchside />} />
            {ACCOUNTS_ENABLED && <Route path="/account" element={<Account />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
      </motion.div>
    </Layout>
  )
}
