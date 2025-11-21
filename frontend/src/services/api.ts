import axios from 'axios'
import { CoffeeData, Harvest, Transaction, LoginCredentials, RegisterData, AuthResponse, VerifyTokenResponse } from '../types'

const GATEWAY_API_URL = import.meta.env.GATEWAY_API_URL || 'http://localhost:5002'

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
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

gateway.interceptors.response.use((response) => response, handleAuthError)

// safra/blockchain API - gateway endpoints
export const createSafra = async (safraData: {
  farm_name: string
  location: string
  harvest_date: string
  coffee_variety: string
  altitude: string
  coffee_bags: number | string
  processing_method: string
  certifications: Array<{ name: string }>
  notes: string
}): Promise<any> => {
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
    const harvest_data = response.data.data;

    if (response.found === false) {
        throw new Error('Safra não encontrada')
    }

    return{
        id: harvest_data.id || code,
        altitude: harvest_data.altitude || 'N/A',
        certifications: harvest_data.certifications || [],
        coffee_bags: harvest_data.coffee_bags || 'N/A',
        coffee_variety: harvest_data.coffee_variety || 'N/A',
        farm_name: harvest_data.farm_name || 'Desconhecido',
        harvest_date: harvest_data.harvest_date || 'Desconhecido',
        inserted_at: harvest_data.inserted_at || 'Desconhecido',
        location: harvest_data.location || 'Desconhecido',
        notes: harvest_data.notes || 'Desconhecido',
        owner: harvest_data.owner || 'Desconhecido',
        processing_method: harvest_data.processing_method || 'Desconhecido',
    }
  } catch (error) {
    throw new Error('Safra não encontrada')
  }
}

// producer API - maps to gateway /safra endpoints
export const createHarvest = async (harvest: Partial<Harvest>): Promise<any> => {
  const safraPayload = {
    farm_name: harvest.farm_name || '',
    location: harvest.location || '',
    harvest_date: harvest.harvest_date || new Date().toISOString().split('T')[0],
    coffee_variety: harvest.coffee_variety || '',
    altitude: String(harvest.altitude || ''),
    coffee_bags: harvest.coffee_bags ?? 0, // ou '', se fizer sentido
    processing_method: harvest.processing_method || '',
    certifications: harvest.certifications ?? [], // garante array
    notes: harvest.notes || ''
  }
  return createSafra(safraPayload)
}

export const getHarvests = async (): Promise<CoffeeData[]> => {
  // Gateway doesn't have list all endpoint, return empty for now
  // In production, could fetch from blockchain directly
  return []
}

export const getHarvestById = async (id: number): Promise<CoffeeData> => {
  const data = await getSafra(String(id))
  return {
    id: data?.data?.id || '',
    altitude: String(data?.data?.altitude) || '',
    certifications: (data?.data?.certifications || []).map((c: any) => c.name),
    coffee_variety: data?.data?.coffee_variety || '',
    coffee_bags: data?.data?.coffee_bags || 0,
    farm_name: data?.data?.farm_name || '',
    harvest_date: data?.data?.harvest_date || '',
    inserted_at: data?.data?.inserted_at || '',
    location: data?.data?.location || '',
    notes: data?.data?.notes || '',
    owner: data?.data?.owner || '',
    processing_method: data?.data?.processing_method || '', 
  }
}

// blockchain API - gateway safra validation
export const getTransactions = async (): Promise<Transaction[]> => {
  // Would fetch from blockchain service or history endpoint
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
// safra-29a4f8ac-29d3-4307-ada0-bd72ee45773b
export const generateSummary = async (harvestData: any): Promise<string> => {
  const response = await gateway.post('/summary', harvestData)

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
  // ! backend doesn't have register endpoint yet. throw error?
  throw new Error('registration endpoint not implemented')
}

export const getCurrentUser = async (): Promise<VerifyTokenResponse> => {
  const response = await gateway.get('/auth/verify')
  return response.data
}

export { gateway }
export default gateway


