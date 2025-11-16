import axios from 'axios'
import { CoffeeData, Harvest, Transaction, LoginCredentials, RegisterData, AuthResponse, User } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Coffee Tracking API
export const trackCoffee = async (code: string): Promise<CoffeeData> => {
  const response = await api.get(`/track/${code}`)
  return response.data
}

// Producer API
export const createHarvest = async (harvest: Partial<Harvest>): Promise<Harvest> => {
  const response = await api.post('/harvest', harvest)
  return response.data
}

export const getHarvests = async (): Promise<Harvest[]> => {
  const response = await api.get('/harvest')
  return response.data
}

export const getHarvestById = async (id: number): Promise<Harvest> => {
  const response = await api.get(`/harvest/${id}`)
  return response.data
}

// Blockchain API
export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/transactions')
  return response.data
}

export const verifyBlockchainHash = async (hash: string): Promise<boolean> => {
  const response = await api.get(`/verify/${hash}`)
  return response.data.verified
}

// Summary AI API
export const generateSummary = async (harvestData: any): Promise<string> => {
  const response = await api.post('/api/summarize', harvestData)
  return response.data.summary
}

// Auth API
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me')
  return response.data
}

export default api
