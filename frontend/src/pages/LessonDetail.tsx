import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Bookmark, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { api } from '../lib/api'
import type { LessonTopic, GlossaryTerm, QuizQuestion } from '../lib/types'
import { useMe } from '../lib/me'
import Prose from '../components/Prose'
import OffsideSimulator from '../components/OffsideSimulator'

function Quiz({ questions, onFinish }: { questions: QuizQuestion[]; onFinish: (score: number) => void }) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const q = questions[step]

  function choose(i: number) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) setCorrect((c) => c + 1)
  }
  function next() {
    if (step + 1 < questions.length) { setStep(step + 1); setPicked(null) }
    else { setFinished(true); onFinish((correct) / questions.length) }
  }
  function restart() { setStep(0); setPicked(null); setCorrect(0); setFinished(false) }

  if (finished) {
    return (
      <div className="surface p-6 text-center">
        <p className="eyebrow mb-1">Result</p>
        <p className="font-display text-3xl mb-1">{correct} / {questions.length}</p>
        <p className="text-chalk-300 mb-4">{correct === questions.length ? 'Perfect. You have this one.' : 'Review the lesson and try again to improve your score.'}</p>
        <button onClick={restart} className="inline-flex items-center gap-2 text-sm text-grass-400 hover:text-grass-300"><RotateCcw size={14} /> Try again</button>
      </div>
    )
  }

  return (
    <div className="surface p-6">
      <p className="eyebrow mb-1">Test your understanding · {step + 1} of {questions.length}</p>
      <p className="font-medium text-chalk-50 text-lg mb-4">{q.question}</p>
      <div className="space-y-2" role="group" aria-label="Answers">
        {q.options.map((opt, i) => {
          const isRight = i === q.answer
          const state = picked === null ? 'idle' : isRight ? 'right' : i === picked ? 'wrong' : 'dim'
          return (
            <button key={i} onClick={() => choose(i)} disabled={picked !== null}
              className={`w-full text-left px-4 py-3 rounded-xl ring-1 transition-colors ${
                state === 'right' ? 'ring-grass-500 bg-grass-500/10 text-grass-400'
                : state === 'wrong' ? 'ring-red-500 bg-red-500/10 text-red-300'
                : state === 'dim' ? 'ring-white/10 text-chalk-400'
                : 'ring-white/12 hover:bg-white/5 text-chalk-200'}`}>
              {opt}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="text-sm text-chalk-300" aria-live="polite">{picked === q.answer ? 'Correct. ' : 'Not quite. '}{q.explanation}</p>
          <button onClick={next} className="shrink-0 rounded-full bg-grass-500 text-pitch-950 text-sm font-semibold px-4 py-2 hover:bg-grass-400">
            {step + 1 < questions.length ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function LessonDetail() {
  const { id } = useParams()
  const me = useMe()
  const [lesson, setLesson] = useState<LessonTopic | null>(null)
  const [all, setAll] = useState<LessonTopic[]>([])
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    setLesson(null); setError(false)
    if (!id) return
    api.lesson(id).then(setLesson).catch(() => setError(true))
  }, [id])
  useEffect(() => {
    api.lessons().then(setAll).catch(() => {})
    api.glossary().then(setTerms).catch(() => {})
  }, [])

  const { prev, next } = useMemo(() => {
    const i = all.findIndex((l) => l.id === id)
    return { prev: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null }
  }, [all, id])

  if (error) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-300">That lesson couldn't be found. <Link to="/learn" className="text-grass-400">Back to Learn</Link></div>
  if (!lesson) return <div className="max-w-3xl mx-auto px-4 py-20 text-chalk-400">Loading…</div>

  const complete = me.isComplete(lesson.id)
  const bookmarked = me.isBookmarked('lesson', lesson.id)
  const related = (lesson.related_glossary_ids ?? []).map((tid) => terms.find((t) => t.id === tid)).filter(Boolean) as GlossaryTerm[]

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <Link to="/learn" className="text-sm text-chalk-400 hover:text-chalk-50">← All lessons</Link>
      <div className="flex items-start justify-between gap-4 mt-4">
        <div>
          <p className="eyebrow mb-2">Level {lesson.level} · Lesson {lesson.order}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">{lesson.title}</h1>
        </div>
        <button onClick={() => me.toggleBookmark('lesson', lesson.id)} aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
          className={`mt-1 p-2.5 rounded-full ring-1 transition-colors ${bookmarked ? 'ring-gold-500 text-gold-400 bg-gold-500/10' : 'ring-white/15 text-chalk-400 hover:text-chalk-50'}`}>
          <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="text-chalk-300 text-xl mt-3 mb-8">{lesson.summary}</p>

      <Prose>{lesson.body_markdown}</Prose>

      {lesson.interactive_component === 'OffsideSimulator' && (
        <section className="mt-10"><h2 className="font-display text-2xl font-semibold mb-4">Try it yourself</h2><OffsideSimulator /></section>
      )}
      {lesson.interactive_component === 'PositionsPitch' && (
        <Link to="/positions" className="mt-10 block surface surface-hover p-5 text-grass-400 font-medium">Open the interactive positions pitch →</Link>
      )}
      {lesson.interactive_component === 'FormationExplorer' && (
        <Link to="/formations" className="mt-10 block surface surface-hover p-5 text-grass-400 font-medium">Open the formation explorer →</Link>
      )}
      {lesson.level === 3 && (
        <Link to="/tactics" className="mt-6 block surface surface-hover p-5 text-grass-400 font-medium">See this on an animated tactics diagram →</Link>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="eyebrow mb-3">Terms in this lesson</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((t) => (
              <Link key={t.id} to={`/glossary#${t.id}`} className="text-sm bg-white/5 ring-1 ring-white/10 rounded-full px-3 py-1.5 text-chalk-200 hover:ring-grass-500/50">{t.term}</Link>
            ))}
          </div>
        </section>
      )}

      {lesson.quiz && lesson.quiz.length > 0 && (
        <section className="mt-10">
          <Quiz key={lesson.id} questions={lesson.quiz} onFinish={(score) => { void me.completeLesson(lesson.id, score) }} />
        </section>
      )}

      <div className="mt-10 flex items-center justify-between">
        {complete ? (
          <span className="inline-flex items-center gap-2 text-grass-400 font-medium"><CheckCircle2 size={20} /> Lesson complete</span>
        ) : (
          <button onClick={() => void me.completeLesson(lesson.id)} className="rounded-full bg-grass-500 text-pitch-950 font-semibold px-6 py-3 hover:bg-grass-400 transition-colors">Mark as complete</button>
        )}
      </div>

      <nav className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-4" aria-label="Lesson navigation">
        {prev ? <Link to={`/learn/${prev.id}`} className="surface surface-hover p-4"><span className="text-xs text-chalk-400 flex items-center gap-1"><ChevronLeft size={14} /> Previous</span><span className="font-medium text-chalk-50">{prev.title}</span></Link> : <span />}
        {next ? <Link to={`/learn/${next.id}`} className="surface surface-hover p-4 text-right"><span className="text-xs text-chalk-400 flex items-center gap-1 justify-end">Next <ChevronRight size={14} /></span><span className="font-medium text-chalk-50">{next.title}</span></Link> : <span />}
      </nav>
    </article>
  )
}
