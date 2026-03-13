'use client'

import type { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { authEnabled } from '@/lib/config/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(authEnabled)

  useEffect(() => {
    // Skip auth initialization entirely if auth is disabled
    if (!authEnabled) {
      return
    }

    let unsubscribe: (() => void) | undefined

    // Dynamic import to avoid loading Supabase when auth is disabled
    import('./client').then(({ getCurrentUser, onAuthStateChange }) => {
      getCurrentUser()
        .then((currentUser) => {
          setUser(currentUser)
          setLoading(false)
        })
        .catch(() => {
          setUser(null)
          setLoading(false)
        })

      const {
        data: { subscription }
      } = onAuthStateChange((authUser) => {
        setUser(authUser)
        setLoading(false)
      })

      unsubscribe = () => subscription?.unsubscribe()
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
