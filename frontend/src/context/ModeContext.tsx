import { createContext, useContext, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { UserRole } from '../types'

type Mode = UserRole

interface ModeContextValue {
  mode: Mode
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined)

export const ModeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  
  // Mode is now determined by the user's role
  const mode = user?.role || 'comprador'

  const value = useMemo(() => ({ mode }), [mode])

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export const useMode = () => {
  const context = useContext(ModeContext)

  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }

  return context
}
