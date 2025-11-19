import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LoginCredentials, RegisterData, AuthResponse, AuthenticatedUser } from '../types'
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api'

interface AuthContextValue {
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    if (token) {
      getCurrentUser()
        .then((userData) => {
            if (userData.success) {
                setUser(userData.user)
            } else {
                localStorage.removeItem('token')
            }
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response: AuthResponse = await apiLogin(credentials)
      localStorage.setItem('token', response.token)
      // fetches user data after login
      const userData = await getCurrentUser()
      if (userData.success) {
        setUser(userData.user)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response: AuthResponse = await apiRegister(data)
      localStorage.setItem('token', response.token)
      // fetches user data after registration
      const userData = await getCurrentUser()
      if (userData.success) {
        setUser(userData.user)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
