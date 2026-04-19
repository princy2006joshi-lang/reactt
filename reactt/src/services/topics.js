export const difficultyOptions = ['all', 'easy', 'medium', 'hard']

const topicBlueprints = [
  {
    slug: 'jsx-basics',
    title: 'JSX Basics',
    explanation:
      'JSX is the syntax React uses to describe what the user interface should look like. It lets you mix HTML-like tags with JavaScript.',
    difficulty: 'easy',
    task: 'Create a small greeting component that receives a name through props and displays it on screen.',
  },
  {
    slug: 'components-and-props',
    title: 'Components and Props',
    explanation:
      'Components are reusable UI pieces. Props are values passed into a component so it can show different data without changing the component itself.',
    difficulty: 'easy',
    task: 'Build a card component that can show a title, subtitle, and badge text using props only.',
  },
  {
    slug: 'state-with-usestate',
    title: 'State with useState',
    explanation:
      'useState stores changing data inside a component. When state updates, React re-renders the UI to match the new value.',
    difficulty: 'medium',
    task: 'Make a simple counter with plus and minus buttons using local state.',
  },
  {
    slug: 'effects-and-timers',
    title: 'Effects and Timers',
    explanation:
      'useEffect runs side effects such as timers, data fetching, and subscriptions after the UI renders.',
    difficulty: 'medium',
    task: 'Create a timer that shows how many seconds have passed since the component loaded.',
  },
  {
    slug: 'context-api',
    title: 'Context API',
    explanation:
      'Context helps share data like auth, theme, and progress across many components without passing props through every level.',
    difficulty: 'hard',
    task: 'Move a value from a parent component into deeply nested children using Context API.',
  },
  {
    slug: 'react-router',
    title: 'React Router',
    explanation:
      'React Router lets a single-page application show different screens based on the URL, like login, dashboard, and detail pages.',
    difficulty: 'hard',
    task: 'Add two routes and make one protected route that redirects unauthenticated users.',
  },
  {
    slug: 'custom-hooks',
    title: 'Building Custom Hooks',
    explanation:
      'Custom hooks let you extract component logic into reusable functions. They follow the rules of hooks and can call other hooks.',
    difficulty: 'hard',
    task: 'Create a useCounter custom hook that encapsulates counter state and handlers, then use it in two different components.',
  },
  {
    slug: 'form-handling',
    title: 'Form Handling and Validation',
    explanation:
      'Forms in React use controlled components where state mirrors input values. Validation ensures data quality before submission.',
    difficulty: 'medium',
    task: 'Build a login form with email and password fields that validates input and displays error messages.',
  },
  {
    slug: 'api-integration',
    title: 'API Integration and Error Handling',
    explanation:
      'useEffect with async functions lets you fetch data from APIs. Always handle loading, error, and success states gracefully.',
    difficulty: 'hard',
    task: 'Fetch a list of users from a public API, display them, and handle loading and error states.',
  },
  {
    slug: 'performance-optimization',
    title: 'Performance Optimization',
    explanation:
      'useMemo memoizes expensive calculations, and useCallback memoizes functions. They prevent unnecessary re-renders and improve app speed.',
    difficulty: 'hard',
    task: 'Use useMemo to cache a filtered list and useCallback to cache an event handler, then measure the performance impact.',
  },
]

const batchThemes = [
  'foundation',
  'composition',
  'state',
  'effects',
  'context',
  'routing',
  'hooks',
  'forms',
  'data',
  'performance',
]

function buildTopic(batchNumber, blueprint, index) {
  return {
    id: `batch-${batchNumber}-${blueprint.slug}`,
    title: blueprint.title,
    explanation: blueprint.explanation,
    difficulty: blueprint.difficulty,
    task: blueprint.task,
  }
}

export function generateTopicBatch(batchNumber) {
  return topicBlueprints.map((blueprint, index) => buildTopic(batchNumber, blueprint, index))
}

export function getTopicById(id) {
  const batchMatch = /^batch-(\d+)-(.+)$/.exec(id)
  const batchNumber = batchMatch ? Number.parseInt(batchMatch[1], 10) : 1
  const slug = batchMatch ? batchMatch[2] : id
  const blueprint = topicBlueprints.find((item) => item.slug === slug)

  if (!Number.isInteger(batchNumber) || batchNumber <= 0 || !blueprint) {
    return null
  }

  return buildTopic(batchNumber, blueprint, 0)
}

// API-like function to fetch topics (can be replaced with real backend API)
export async function fetchTopics(batch = 1) {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateTopicBatch(batch))
    }, 100)
  })
}

// API-like function to fetch a single topic
export async function fetchTopicById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const topic = getTopicById(id)
      resolve(topic || null)
    }, 50)
  })
}