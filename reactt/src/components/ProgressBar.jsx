export default function ProgressBar({ completedCount, totalCount }) {
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Progress</p>
          <h2 className="text-xl font-semibold text-white">
            {completedCount} out of {totalCount} topics completed
          </h2>
        </div>
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
          {progressPercentage}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}