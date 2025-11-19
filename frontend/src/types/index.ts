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


//     "farm_name": "Sítio Vale Verde",
//     "location": "Lavras",
//     "harvest_date": "2025-11-10",
//     "coffee_variety": "Arábica",
//     "altitude": "960",
//     "coffee_bags": "1225",
//     "processing_method": "Manual",
//     "certifications": [
//         {
//             "name":  "Best Coffee"
//         }
//     ],
//     "notes": "hello world"
// }
export interface Harvest {
  farm_name: string
  location: string
  harvest_date: string
  coffee_variety: string
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
  role: UserRole
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