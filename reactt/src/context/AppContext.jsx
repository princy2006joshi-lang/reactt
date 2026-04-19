import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuth } from './AuthContext.jsx'
import { db } from '../services/firebase.js'
import { fetchTopics } from '../services/topics.js'

const AppContext = createContext(null)

const defaultState = {
  understoodTopicIds: [],
  completedTaskIds: [],
  completedHistoryIds: [],
  studySeconds: 0,
  topicBatch: 1,
}

function getProgressCacheKey(uid) {
  return `devtrack-progress-${uid}`
}

function readProgressFromCache(uid) {
  if (!uid || typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(getProgressCacheKey(uid))
    if (!raw) {
      return null
    }

    return normalizeProgress(JSON.parse(raw))
  } catch {
    return null
  }
}

function writeProgressToCache(uid, progress) {
  if (!uid || typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(getProgressCacheKey(uid), JSON.stringify(progress))
  } catch {
    // Ignore cache write failures.
  }
}

function normalizeProgress(data) {
  const understoodTopicIds = Array.isArray(data?.understoodTopicIds) ? data.understoodTopicIds : []
  const completedTaskIds = Array.isArray(data?.completedTaskIds) ? data.completedTaskIds : []
  const savedCompletedHistoryIds = Array.isArray(data?.completedHistoryIds) ? data.completedHistoryIds : null
  const fallbackHistoryIds = understoodTopicIds.filter((topicId) => completedTaskIds.includes(topicId))

  return {
    understoodTopicIds,
    completedTaskIds,
    completedHistoryIds: [...new Set(savedCompletedHistoryIds ?? fallbackHistoryIds)],
    studySeconds: Number.isFinite(data?.studySeconds) ? data.studySeconds : 0,
    topicBatch: Number.isInteger(data?.topicBatch) && data.topicBatch > 0 ? data.topicBatch : 1,
  }
}

export function AppProvider({ children }) {
  const { user } = useAuth()
  const [state, setState] = useState(defaultState)
  const [topics, setTopics] = useState([])
  const [hydrated, setHydrated] = useState(false)
  const [topicsLoading, setTopicsLoading] = useState(true)

  // Load current topic batch from API
  useEffect(() => {
    let active = true

    async function loadTopics() {
      setTopicsLoading(true)
      const fetchedTopics = await fetchTopics(state.topicBatch)

      if (active) {
        setTopics(fetchedTopics)
        setTopicsLoading(false)
      }
    }

    loadTopics()

    return () => {
      active = false
    }
  }, [state.topicBatch])

  // Automatically move to the next API topic batch when current topics are fully completed.
  useEffect(() => {
    if (topicsLoading || topics.length === 0) {
      return
    }

    const allCurrentTopicsCompleted = topics.every(
      (topic) =>
        state.understoodTopicIds.includes(topic.id) && state.completedTaskIds.includes(topic.id),
    )

    if (!allCurrentTopicsCompleted) {
      return
    }

    setState((current) => {
      return {
        ...current,
        topicBatch: current.topicBatch + 1,
      }
    })
  }, [topics, topicsLoading, state.understoodTopicIds, state.completedTaskIds])

  // Load progress from Firestore
  useEffect(() => {
    let active = true

    async function loadProgress() {
      if (!user) {
        setState(defaultState)
        setHydrated(true)
        return
      }

      setHydrated(false)

      const cachedProgress = readProgressFromCache(user.uid)

      if (!db) {
        setState(cachedProgress ?? defaultState)
        setHydrated(true)
        return
      }

      try {
        const snapshot = await getDoc(doc(db, 'progress', user.uid))

        if (!active) {
          return
        }

        if (snapshot.exists()) {
          const normalized = normalizeProgress(snapshot.data())
          setState(normalized)
          writeProgressToCache(user.uid, normalized)
        } else {
          setState(cachedProgress ?? defaultState)
        }
      } catch {
        if (!active) {
          return
        }

        setState(cachedProgress ?? defaultState)
      }

      if (!active) {
        return
      }

      setHydrated(true)
    }

    loadProgress()

    return () => {
      active = false
    }
  }, [user])

  useEffect(() => {
    if (!user || !hydrated) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      const payload = {
        ...state,
        updatedAt: Date.now(),
      }

      writeProgressToCache(user.uid, payload)

      if (db) {
        setDoc(doc(db, 'progress', user.uid), payload, { merge: true }).catch(() => {
          // Cache already has the latest progress when remote sync fails.
        })
      }
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [user, state, hydrated])

  const markTopicUnderstood = useCallback((topicId) => {
    setState((current) => {
      if (current.understoodTopicIds.includes(topicId)) {
        return current
      }

      const nextState = {
        ...current,
        understoodTopicIds: [...current.understoodTopicIds, topicId],
      }

      if (
        current.completedTaskIds.includes(topicId) &&
        !current.completedHistoryIds.includes(topicId)
      ) {
        nextState.completedHistoryIds = [...current.completedHistoryIds, topicId]
      }

      return nextState
    })
  }, [])

  const markTaskCompleted = useCallback((topicId) => {
    setState((current) => {
      if (current.completedTaskIds.includes(topicId)) {
        return current
      }

      const nextState = {
        ...current,
        completedTaskIds: [...current.completedTaskIds, topicId],
      }

      if (
        current.understoodTopicIds.includes(topicId) &&
        !current.completedHistoryIds.includes(topicId)
      ) {
        nextState.completedHistoryIds = [...current.completedHistoryIds, topicId]
      }

      return nextState
    })
  }, [])

  const addStudySession = useCallback((seconds) => {
    if (seconds <= 0) {
      return
    }

    setState((current) => ({
      ...current,
      studySeconds: current.studySeconds + seconds,
    }))
  }, [])

  const resetStudyTime = useCallback(() => {
    setState((current) => ({
      ...current,
      studySeconds: 0,
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      topics,
      topicsLoading,
      topicBatch: state.topicBatch,
      markTopicUnderstood,
      markTaskCompleted,
      addStudySession,
      resetStudyTime,
    }),
    [
      state,
      hydrated,
      topics,
      topicsLoading,
      state.topicBatch,
      markTopicUnderstood,
      markTaskCompleted,
      addStudySession,
      resetStudyTime,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}