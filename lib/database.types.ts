export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          user_id: string
          title_id: string
          content: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title_id: string
          content: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title_id?: string
          content?: string
          status?: string
          created_at?: string
        }
      }
      titles: {
        Row: {
          id: string
          user_id: string
          topic: string
          title_text: string
          is_used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic: string
          title_text: string
          is_used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic?: string
          title_text?: string
          is_used?: boolean
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          posts_count: number
          created_at: string
        }
        Insert: {
          id: string
          posts_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          posts_count?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_posts_count: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

