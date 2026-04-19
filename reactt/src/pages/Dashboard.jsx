import { useCallback, useMemo, useState } from 'react'
import { difficultyOptions, getTopicById } from '../services/topics.js'
import { useAppContext } from '../context/AppContext.jsx'
import TopicCard from '../components/TopicCard.jsx'
import StudyTimer from '../components/StudyTimer.jsx'

export default function Dashboard() {
  const {
    understoodTopicIds,
    markTopicUnderstood,
    completedTaskIds,
    completedHistoryIds,
    topics,
    topicsLoading,
  } = useAppContext()
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [activeView, setActiveView] = useState('todo')

  const isFullyCompleted = useCallback(
    (topicId) => understoodTopicIds.includes(topicId) && completedTaskIds.includes(topicId),
    [understoodTopicIds, completedTaskIds],
  )

  const todoTopics = useMemo(() => {
    let visibleTopics = topics.filter((topic) => !isFullyCompleted(topic.id))

    if (selectedDifficulty !== 'all') {
      visibleTopics = visibleTopics.filter((topic) => topic.difficulty === selectedDifficulty)
    }

    return visibleTopics
  }, [selectedDifficulty, topics, isFullyCompleted])

  const completedTopics = useMemo(() => {
    let visibleTopics = [...new Set(completedHistoryIds)]
      .map((topicId) => getTopicById(topicId))
      .filter(Boolean)

    if (selectedDifficulty !== 'all') {
      visibleTopics = visibleTopics.filter((topic) => topic.difficulty === selectedDifficulty)
    }

    return visibleTopics
  }, [selectedDifficulty, completedHistoryIds])

  const handleFilterChange = useCallback((event) => {
    setSelectedDifficulty(event.target.value)
  }, [])

  const handleMarkTopic = useCallback(
    (topicId) => {
      markTopicUnderstood(topicId)
    },
    [markTopicUnderstood],
  )

  const completedCount = topics.filter((topic) => isFullyCompleted(topic.id)).length
  const completionRate = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">React learning module</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">DevTrack dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Learn React one topic at a time. Open a topic, read the explanation, then mark both learning and task completion to move forward.
              </p>
            </div>

            <label className="flex min-w-0 flex-col gap-2 text-sm text-slate-300">
              Difficulty filter
              <select
                value={selectedDifficulty}
                onChange={handleFilterChange}
                aria-label="Filter topics by difficulty"
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              >
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All difficulties' : option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Batch progress: {completedCount} / {topics.length} topics fully completed ({completionRate}%).
          </p>

          <div className="mt-4 rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">Quick start</p>
            <p className="mt-1">1) Open any topic. 2) Mark it as understood. 3) Complete the practice task.</p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('todo')}
              aria-pressed={activeView === 'todo'}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeView === 'todo'
                  ? 'bg-cyan-400 text-slate-950'
                  : 'border border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400 hover:text-cyan-300'
              }`}
            >
              To-Do
            </button>
            <button
              type="button"
              onClick={() => setActiveView('completed')}
              aria-pressed={activeView === 'completed'}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeView === 'completed'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'border border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400 hover:text-emerald-300'
              }`}
            >
              Completed
            </button>
          </div>

          <h2 className="text-xl font-semibold text-white">
            {activeView === 'todo' ? 'To-Do Topics' : 'Completed Topics'}
          </h2>

          <div className="grid gap-4">
            {activeView === 'todo' && topicsLoading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">
                Loading topics...
              </div>
            ) : activeView === 'todo' && todoTopics.length > 0 ? (
              todoTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  id={topic.id}
                  title={topic.title}
                  explanation={topic.explanation}
                  difficulty={topic.difficulty}
                  completed={false}
                  onComplete={() => handleMarkTopic(topic.id)}
                />
              ))
            ) : activeView === 'completed' && completedTopics.length > 0 ? (
              completedTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  id={topic.id}
                  title={topic.title}
                  explanation={topic.explanation}
                  difficulty={topic.difficulty}
                  completed={true}
                  onComplete={() => handleMarkTopic(topic.id)}
                />
              ))
            ) : activeView === 'todo' ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center">
                <p className="text-sm font-semibold text-emerald-300">
                  ✓ No to-do topics left for this filter.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Great work. Switch to Completed to review finished topics.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400" role="status" aria-live="polite">
                No completed topics for this filter yet. Complete a topic and its task to see it here.
              </div>
            )}
          </div>
        </section>

      </section>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <StudyTimer />
      </aside>
    </div>
  )
}