export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          subscription_tier: string
          tokens_remaining: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_tier?: string
          tokens_remaining?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_tier?: string
          tokens_remaining?: number
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          company: string | null
          position: string | null
          industry: string | null
          score: number
          status: string
          source: string | null
          last_contacted: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          company?: string | null
          position?: string | null
          industry?: string | null
          score?: number
          status?: string
          source?: string | null
          last_contacted?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          company?: string | null
          position?: string | null
          industry?: string | null
          score?: number
          status?: string
          source?: string | null
          last_contacted?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types here...
    }
  }
}