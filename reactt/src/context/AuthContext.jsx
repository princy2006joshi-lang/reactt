import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, isFirebaseReady } from '../services/firebase.js'

const AuthContext = createContext(null)

async function saveUserProfile(user, extras = {}) {
  const profile = {
    uid: user.uid,
    email: user.email ?? extras.email ?? '',
    displayName: user.displayName ?? extras.displayName ?? '',
    photoURL: user.photoURL ?? extras.photoURL ?? '',
    updatedAt: Date.now(),
    ...extras,
  }

  if (!db) {
    return profile
  }

  try {
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true })
  } catch {
    // Keep auth usable even if profile sync fails.
  }

  return profile
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return undefined
    }

    let active = true
    let unsubscribe

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
      } catch {
        // Continue with default persistence if setting local persistence fails.
      }

      if (!active) {
        return
      }

      unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
        if (!nextUser) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        const savedProfile = await saveUserProfile(nextUser, {
          email: nextUser.email ?? '',
          displayName: nextUser.displayName ?? '',
        })

        if (!active) {
          return
        }

        setUser(nextUser)
        setProfile(savedProfile)
        setLoading(false)
      })
    }

    initializeAuth()

    return () => {
      active = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const signup = useCallback(async ({ name, email, password }) => {
    if (!auth) {
      throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* environment variables.')
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (name) {
      await updateProfile(credential.user, { displayName: name })
    }

    const savedProfile = await saveUserProfile(credential.user, {
      email,
      displayName: name ?? '',
    })

    setUser(credential.user)
    setProfile(savedProfile)

    return credential.user
  }, [])

  const login = useCallback(async ({ email, password }) => {
    if (!auth) {
      throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* environment variables.')
    }

    const credential = await signInWithEmailAndPassword(auth, email, password)

    const savedProfile = await saveUserProfile(credential.user, {
      email,
      displayName: credential.user.displayName ?? '',
    })

    setUser(credential.user)
    setProfile(savedProfile)

    return credential.user
  }, [])

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth)
    }

    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signup,
      login,
      logout,
      firebaseReady: isFirebaseReady,
    }),
    [user, profile, loading, signup, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}