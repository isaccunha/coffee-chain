import axios from 'axios'
import { CoffeeData, Transaction, LoginCredentials, RegisterData, AuthResponse, VerifyTokenResponse, SafraData } from '../types'

const GATEWAY_API_URL = import.meta.env.VITE_GATEWAY_API_URL || 'http://fallback:5002'

// auth API instance
const gateway = axios.create({
  baseURL: GATEWAY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// * add token to auth requests if available
gateway.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// handle auth errors for all APIs
const handleAuthError = (error: any) => {
  const originalRequest = error.config

  if (originalRequest?.url?.includes('/auth/login')) {
    return Promise.reject(error)
  }

  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

gateway.interceptors.response.use((response) => response, handleAuthError)

// safra/blockchain API - gateway endpoints
export const createSafra = async (safraData: SafraData): Promise<any> => {
  const response = await gateway.post('/safra', safraData)
  return response.data.data
}

export const getSafra = async (safraId: string): Promise<any> => {
  const response = await gateway.get(`/safra/${safraId}`)
  return response.data
}

export const getSafraHistory = async (safraId: string): Promise<any> => {
  const response = await gateway.get(`/safra/${safraId}/history`)
  return response.data
}

export const validateBlockchain = async (): Promise<any> => {
  const response = await gateway.get('/safra/validate')
  return response.data
}

// safra-29a4f8ac-29d3-4307-ada0-bd72ee45773b
export const trackCoffee = async (code: string): Promise<CoffeeData> => {
  try {
    const response = await getSafra(code)
    const safra = response.data.data;
    if (response.found === false) {
        throw new Error('Safra não encontrada')
    }
    return safra
  } catch (error) {
    throw new Error('Safra não encontrada')
  }
}

export const getHarvestById = async (id: number): Promise<CoffeeData> => {
  const data = await getSafra(String(id));
  return data
}

// blockchain API - gateway safra validation
export const getCreationLogs = async (limit = 10, email?: string) => {
  const params: any = { limit }
  if (email) params.email = email
  const response = await gateway.get('/safra/logs/creation', { params })
  return response.data
}

export const getAccessLogs = async (limit = 10, email?: string) => {
  const params: any = { limit }
  if (email) params.email = email
  const response = await gateway.get('/safra/logs/access', { params })
  return response.data
}

export const getUserStats = async () => {
  const response = await gateway.get('/safra/user/stats', {  })
  return response.data
}

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await validateBlockchain()
    return data?.data?.transactions || []
  } catch {
    return []
  }
}

export const verifyBlockchainHash = async (hash: string): Promise<boolean> => {
  try {
    const data = await getSafra(hash)
    return !!data?.data?.id
  } catch {
    return false
  }
}

// summary AI API - via gateway
export const generateSummary = async (safraData: SafraData): Promise<string> => {
  const response = await gateway.post('/summary', safraData)

  if (response.data.data.metadata.fallback_mode === true) {
    return 'Falha ao gerar resumo com IA, tente novamente mais tarde.'
  }

  return response.data.data.data.summary
}

// auth API - matches backend endpoints
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await gateway.post('/auth/login', credentials)
  return response.data
}

export const register = async (_data: RegisterData): Promise<AuthResponse> => {
  const response = await gateway.post('/auth/register', _data)
  return response.data
}

export const getCurrentUser = async (): Promise<VerifyTokenResponse> => {
  const response = await gateway.get('/auth/verify')
  return response.data
}

export { gateway }
export default gateway