import { Link } from 'react-router-dom'

const difficultyStyles = {
  easy: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  medium: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  hard: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
}

export default function TopicCard({ id, title, explanation, difficulty, completed, onComplete }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40 transition hover:-translate-y-0.5 hover:border-cyan-400/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${difficultyStyles[difficulty]}`}
            >
              {difficulty}
            </span>
            {completed ? (
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Understood
              </span>
            ) : null}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>

        <Link
          to={`/topic/${id}`}
          aria-label={`Open details for ${title}`}
          className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
        >
          Open task
        </Link>
      </div>

      <p className="text-sm leading-6 text-slate-300">{explanation}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-400">Open the task to mark understanding and check your answer.</span>
      </div>
    </article>
  )
}