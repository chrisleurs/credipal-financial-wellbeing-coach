
/**
 * Database Types - Tipos base para entidades de base de datos
 */

import { Currency } from './core.types'

export interface DatabaseRecord {
  id: string
  created_at: string
  updated_at: string
}

export interface UserScopedRecord extends DatabaseRecord {
  user_id: string
}

// User types
export interface UserProfile {
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  created_at: string
  updated_at: string
}
