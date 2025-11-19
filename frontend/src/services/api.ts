import axios from 'axios'
import { CoffeeData, Harvest, Transaction, LoginCredentials, RegisterData, AuthResponse, VerifyTokenResponse } from '../types'

const GATEWAY_API_URL = import.meta.env.GATEWAY_API_URL || 'http://localhost:5002'

// auth API instance
const authApi = axios.create({
  baseURL: GATEWAY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ! blockchain API instance (not yet integrated)
const blockchainApi = axios.create({
  baseURL: GATEWAY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ! summarizer API instance (not yet integrated)
const summarizerApi = axios.create({
  baseURL: GATEWAY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// * add token to auth requests if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// * add token to blockchain requests if available
blockchainApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// handle auth errors for all APIs
const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

authApi.interceptors.response.use((response) => response, handleAuthError)
blockchainApi.interceptors.response.use((response) => response, handleAuthError)

// coffee tracking API (TODO: implement blockchain endpoints)
export const trackCoffee = async (code: string): Promise<CoffeeData> => {
  const response = await blockchainApi.get(`/track/${code}`)
  return response.data
}

// producer API (TODO: implement blockchain endpoints)

export const createHarvest = async (harvest: Partial<Harvest>): Promise<Harvest> => {
  const response = await blockchainApi.post('/harvest', harvest)
  return response.data
}

export const getHarvests = async (): Promise<Harvest[]> => {
  const response = await blockchainApi.get('/harvest')
  return response.data
}

export const getHarvestById = async (id: number): Promise<Harvest> => {
  const response = await blockchainApi.get(`/harvest/${id}`)
  return response.data
}

// blockchain API (TODO: implement blockchain endpoints)
export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await blockchainApi.get('/transactions')
  return response.data
}

export const verifyBlockchainHash = async (hash: string): Promise<boolean> => {
  const response = await blockchainApi.get(`/verify/${hash}`)
  return response.data.verified
}

// summary AI API
export const generateSummary = async (harvestData: any): Promise<string> => {
  const response = await summarizerApi.post('/api/summarize', harvestData)
  return response.data.summary
}

// auth API - matches backend endpoints
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await authApi.post('/auth/login', credentials)
  return response.data
}

export const register = async (_data: RegisterData): Promise<AuthResponse> => {
  // ! backend doesn't have register endpoint yet. throw error?
  throw new Error('registration endpoint not implemented')
}

export const getCurrentUser = async (): Promise<VerifyTokenResponse> => {
  const response = await authApi.get('/auth/verify')
  return response.data
}

export { authApi, blockchainApi, summarizerApi }
export default authApi
