export interface CoffeeCertification {
  name: string
}

export interface CoffeeData {
  id: string
  altitude: string
  certifications: CoffeeCertification[]
  coffee_bags: number
  coffee_variety: string
  farm_name: string
  harvest_date: string
  inserted_at: string
  location: string
  notes: string
  owner: string
  processing_method: string
}

export interface Transaction {
  id: number
  type: 'Registro' | 'Processamento' | 'Colheita' | 'Transporte'
  farm: string
  location: string
  date: string
  quantity: string
  status: 'Verificado' | 'Em andamento' | 'Pendente'
  blockchainHash?: string
}

// Auth types
export type UserRole = 'BUYER' | 'INSPECTOR'

export interface User {
  sub: string
  name: string
  email: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  organization?: string
}

export interface AuthResponse {
  token: string
}

export interface AuthenticatedUser {
  sub: string        
  name: string
  email: string
  role: UserRole
}

export interface VerifyTokenResponse {
  success: boolean
  user: AuthenticatedUser
}

export interface SafraData {
  farm_name: string
  location: string
  harvest_date: string
  coffee_variety: string
  altitude: string
  coffee_bags: number | string
  processing_method: string
  certifications: Array<{ name: string }>
  notes: string
}