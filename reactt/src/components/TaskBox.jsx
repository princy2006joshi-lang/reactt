import { useState } from 'react'

const taskChecks = {
  'jsx-basics': {
    required: ['function', 'props', 'return', '<h1>'],
    success: 'This looks correct. Your component accepts props and renders a greeting.',
    failure: 'Not quite yet. Make sure your solution accepts props and renders the name.',
  },
  'components-and-props': {
    required: ['title', 'subtitle', 'badge'],
    success: 'Correct. Your card uses props for all of the required values.',
    failure: 'Not yet. Include title, subtitle, and badge values through props.',
  },
  'state-with-usestate': {
    required: ['usestate', 'plus', 'minus'],
    success: 'Correct. Your counter uses state and both buttons.',
    failure: 'Not yet. Use useState and include plus and minus controls.',
  },
  'effects-and-timers': {
    required: ['useeffect', 'setinterval', 'clearinterval'],
    success: 'Correct. Your timer uses an effect and cleans up the interval.',
    failure: 'Not yet. Include useEffect, setInterval, and clearInterval.',
  },
  'context-api': {
    required: ['createcontext', 'usecontext', 'provider'],
    success: 'Correct. Your solution uses Context to share data across components.',
    failure: 'Not yet. Use createContext, Provider, and useContext.',
  },
  'react-router': {
    required: ['browserrouter', 'route', 'navigate'],
    success: 'Correct. Your routing solution includes a protected redirect flow.',
    failure: 'Not yet. Include BrowserRouter, Route, and Navigate in your answer.',
  },
  'custom-hooks': {
    required: ['usecounter', 'usestate', 'return'],
    success: 'Correct. Your custom hook keeps reusable counter logic in one place.',
    failure: 'Not yet. Include a useCounter hook with state and return values.',
  },
  'form-handling': {
    required: ['onsubmit', 'email', 'password', 'error'],
    success: 'Correct. Your form includes the key pieces of validation.',
    failure: 'Not yet. Include onSubmit handling, email/password fields, and error state.',
  },
  'api-integration': {
    required: ['fetch', 'loading', 'error'],
    success: 'Correct. Your API flow handles loading and error states.',
    failure: 'Not yet. Make sure your answer includes fetch, loading, and error handling.',
  },
  'performance-optimization': {
    required: ['usememo', 'usecallback'],
    success: 'Correct. Your solution uses memoization for the expensive parts.',
    failure: 'Not yet. Include both useMemo and useCallback in your answer.',
  },
}

function getTopicSlug(topicId) {
  const match = /^batch-\d+-(.+)$/.exec(topicId)
  return match ? match[1] : topicId
}

function evaluateCode(topicId, code) {
  const slug = getTopicSlug(topicId)
  const rule = taskChecks[slug]

  if (!rule) {
    return {
      correct: false,
      message: 'This task is open-ended, so there is no automatic checker for it yet.',
    }
  }

  const normalizedCode = code.toLowerCase().replace(/\s+/g, ' ')
  const isCorrect = rule.required.every((keyword) => normalizedCode.includes(keyword))

  return {
    correct: isCorrect,
    message: isCorrect ? rule.success : rule.failure,
  }
}

export default function TaskBox({ topicId, task, completed, onComplete }) {
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  const handleCheckCode = () => {
    const result = evaluateCode(topicId, code)
    setFeedback(result.message)
    setIsCorrect(result.correct)

    if (result.correct && !completed) {
      onComplete()
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40" aria-label="Practice task section">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Practice task</p>
      <p className="mt-3 text-base leading-7 text-slate-200">{task}</p>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Write your code here</span>
        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="min-h-40 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          placeholder="Type your solution here..."
          spellCheck={false}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheckCode}
          className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Check answer
        </button>

        {feedback ? (
          <p className={`text-sm ${isCorrect ? 'text-emerald-300' : 'text-amber-300'}`} role="status" aria-live="polite">
            {feedback}
          </p>
        ) : null}
      </div>

      {completed ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Completed
          </span>
        </div>
      ) : null}
    </section>
  )
}