import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { UserRole } from '../types'

type Mode = UserRole

interface ModeContextValue {
  mode: Mode
  setMode: (mode: Mode) => void
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined)

export const ModeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [mode, setMode] = useState<Mode>('BUYER')

  // mode defaults to the authenticated user's role but can be temporarily overridden
  // default role is buyer (less privilege)
  useEffect(() => {
    if (user?.role) {
      setMode(user.role)
    } else {
      setMode('BUYER')
    }
  }, [user?.role])

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export const useMode = () => {
  const context = useContext(ModeContext)

  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }

  return context
}
