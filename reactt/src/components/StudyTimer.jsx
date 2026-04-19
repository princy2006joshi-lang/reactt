import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { formatDuration } from '../hooks/useTimer.js'

export default function StudyTimer() {
  const { studySeconds, addStudySession, resetStudyTime } = useAppContext()
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)
  const startedAtRef = useRef(null)
  const baseSecondsRef = useRef(studySeconds)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleStart = useCallback(() => {
    if (timerRef.current) {
      return
    }

    baseSecondsRef.current = studySeconds
    startedAtRef.current = Date.now()
    setSessionSeconds(0)
    setIsRunning(true)

    timerRef.current = window.setInterval(() => {
      if (!startedAtRef.current) {
        return
      }

      setSessionSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000))
    }, 1000)
  }, [studySeconds])

  const handleStop = useCallback(() => {
    if (!timerRef.current || !startedAtRef.current) {
      return
    }

    const finalSessionSeconds = Math.floor((Date.now() - startedAtRef.current) / 1000)

    window.clearInterval(timerRef.current)
    timerRef.current = null
    startedAtRef.current = null
    setIsRunning(false)
    setSessionSeconds(0)
    addStudySession(finalSessionSeconds)
  }, [addStudySession])

  const totalSeconds = isRunning ? baseSecondsRef.current + sessionSeconds : studySeconds

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40" aria-label="Study timer">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Study timer</p>
      <h3 className="mt-2 text-lg font-semibold text-white">Focus time</h3>
      <p className="mt-2 text-sm text-slate-300" aria-live="polite">
        Total study time: {formatDuration(totalSeconds)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={isRunning}
          className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          Start
        </button>
        <button
          type="button"
          onClick={handleStop}
          disabled={!isRunning}
          className="rounded-full bg-rose-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-rose-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={resetStudyTime}
          disabled={isRunning}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-400"
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
        {isRunning ? 'Session running' : 'Session paused'}
      </p>

      {!isRunning && totalSeconds === 0 ? (
        <p className="mt-2 text-sm text-slate-400">Start your first focus session to begin tracking time.</p>
      ) : null}
    </section>
  )
}