import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TaskBox from '../components/TaskBox.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { fetchTopicById } from '../services/topics.js'

const difficultyStyles = {
  easy: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  medium: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  hard: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
}

export default function TopicDetail() {
  const { id } = useParams()
  const {
    understoodTopicIds,
    completedTaskIds,
    markTopicUnderstood,
    markTaskCompleted,
  } = useAppContext()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadTopic() {
      setLoading(true)
      const fetchedTopic = await fetchTopicById(id)

      if (active) {
        setTopic(fetchedTopic)
        setLoading(false)
      }
    }

    loadTopic()

    return () => {
      active = false
    }
  }, [id])

  const handleMarkTopic = useCallback(() => {
    if (topic) {
      markTopicUnderstood(topic.id)
    }
  }, [markTopicUnderstood, topic])

  const handleMarkTask = useCallback(() => {
    if (topic) {
      markTaskCompleted(topic.id)
    }
  }, [markTaskCompleted, topic])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-sm text-slate-400">Loading topic...</p>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold text-white">Topic not found</h1>
        <p className="mt-3 text-sm text-slate-300">The topic you are looking for does not exist.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Back to dashboard
        </Link>
      </div>
    )
  }

  const understood = understoodTopicIds.includes(topic.id)
  const taskCompleted = completedTaskIds.includes(topic.id)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/dashboard" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
        Back to dashboard
      </Link>

      <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${difficultyStyles[topic.difficulty]}`}
          >
            {topic.difficulty}
          </span>
          {understood ? (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Understood
            </span>
          ) : null}
          {taskCompleted ? (
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              Task completed
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 text-3xl font-semibold text-white">{topic.title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-300">{topic.explanation}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleMarkTopic}
            disabled={understood}
            className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            {understood ? 'Marked as Understood' : 'Mark as Understood'}
          </button>
        </div>
      </article>

      <TaskBox
        topicId={topic.id}
        task={topic.task}
        completed={taskCompleted}
        onComplete={handleMarkTask}
      />
    </div>
  )
}