export interface CoffeeData {
  id: string
  origin: string
  location: string
  producer: string
  harvestDate: string
  variety: string
  altitude: string
  process: string
  certification: string
  blockchainHash: string
}

export interface Harvest {
  id: number
  farm: string
  location: string
  date: string
  variety: string
  altitude: number
  process: string
  quantity: number
  certifications: string[]
  notes?: string
  status: 'pending' | 'verified' | 'processing'
  blockchainHash?: string
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
export type UserRole = 'comprador' | 'fiscal'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organization?: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  organization?: string
}

export interface AuthResponse {
  user: User
  token: string
}
