export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          read_time: string | null
          summary: string | null
          title: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id: string
          read_time?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          read_time?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      discussions: {
        Row: {
          category?: string | null
          content: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          note_id: string | null
          replies_count: number | null
          branch: string
          semester: string
          tags: string[] | null
          title: string
          university: string
          updated_at: string | null
          upvotes_count: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          note_id?: string | null
          replies_count?: number | null
          branch: string
          semester: string
          tags?: string[] | null
          title: string
          university: string
          updated_at?: string | null
          upvotes_count?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          note_id?: string | null
          replies_count?: number | null
          branch?: string
          semester?: string
          tags?: string[] | null
          title?: string
          university?: string
          updated_at?: string | null
          upvotes_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          is_accepted_answer: boolean | null
          updated_at: string | null
          upvotes_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          is_accepted_answer?: boolean | null
          updated_at?: string | null
          upvotes_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          is_accepted_answer?: boolean | null
          updated_at?: string | null
          upvotes_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      discussion_votes: {
        Row: {
          created_at: string | null
          discussion_id: string | null
          id: string
          reply_id: string | null
          user_id: string
          vote_type: number | null
        }
        Insert: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          reply_id?: string | null
          user_id: string
          vote_type?: number | null
        }
        Update: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          reply_id?: string | null
          user_id?: string
          vote_type?: number | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          branch: string
          created_at: string | null
          download_url: string | null
          id: string
          price: number | null
          semester: string
          title: string
          university: string | null
          video_url: string | null
          contributor_id?: string | null
          is_community_contributed?: boolean | null
          platform_commission_rate?: number | null
        }
        Insert: {
          branch: string
          created_at?: string | null
          download_url?: string | null
          id: string
          price?: number | null
          semester: string
          title: string
          university?: string | null
          video_url?: string | null
          contributor_id?: string | null
          is_community_contributed?: boolean | null
          platform_commission_rate?: number | null
        }
        Update: {
          branch?: string
          created_at?: string | null
          download_url?: string | null
          id?: string
          price?: number | null
          semester?: string
          title?: string
          university?: string | null
          video_url?: string | null
          contributor_id?: string | null
          is_community_contributed?: boolean | null
          platform_commission_rate?: number | null
        }
        Relationships: []
      }
      note_submissions: {
        Row: {
          admin_feedback: string | null
          branch: string
          created_at: string | null
          file_url: string
          id: string
          semester: string
          status: string
          suggested_price: number
          title: string
          university: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_feedback?: string | null
          branch: string
          created_at?: string | null
          file_url: string
          id?: string
          semester: string
          status?: string
          suggested_price?: number
          title: string
          university: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_feedback?: string | null
          branch?: string
          created_at?: string | null
          file_url?: string
          id?: string
          semester?: string
          status?: string
          suggested_price?: number
          title?: string
          university?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string | null
          id: string
          processed_at: string | null
          status: string
          upi_id: string
          user_id: string
          utr_reference: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          upi_id: string
          user_id: string
          utr_reference?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          upi_id?: string
          user_id?: string
          utr_reference?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          branch: string
          created_at: string | null
          description: string | null
          github_url: string | null
          id: string
          tech_stack: string[] | null
          title: string
        }
        Insert: {
          branch: string
          created_at?: string | null
          description?: string | null
          github_url?: string | null
          id: string
          tech_stack?: string[] | null
          title: string
        }
        Update: {
          branch?: string
          created_at?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          tech_stack?: string[] | null
          title?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          contributor_earnings: number | null
          contributor_id: string | null
          created_at: string | null
          email: string
          id: string
          note_id: string | null
          platform_commission: number | null
          razorpay_order_id: string
          razorpay_payment_id: string
          status: string
        }
        Insert: {
          amount: number
          contributor_earnings?: number | null
          contributor_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          note_id?: string | null
          platform_commission?: number | null
          razorpay_order_id: string
          razorpay_payment_id: string
          status: string
        }
        Update: {
          amount?: number
          contributor_earnings?: number | null
          contributor_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          note_id?: string | null
          platform_commission?: number | null
          razorpay_order_id?: string
          razorpay_payment_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          default_branch: string | null
          default_semester: string | null
          email: string
          full_name: string | null
          id: string
          university: string | null
          username: string | null
          upi_id?: string | null
          payout_name?: string | null
          badge_tier?: string | null
          approved_notes_count?: number | null
          total_downloads_count?: number | null
          role?: string | null
          status?: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          default_branch?: string | null
          default_semester?: string | null
          email: string
          full_name?: string | null
          id?: string
          university?: string | null
          username?: string | null
          upi_id?: string | null
          payout_name?: string | null
          badge_tier?: string | null
          approved_notes_count?: number | null
          total_downloads_count?: number | null
          role?: string | null
          status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          default_branch?: string | null
          default_semester?: string | null
          email?: string
          full_name?: string | null
          id?: string
          university?: string | null
          username?: string | null
          upi_id?: string | null
          payout_name?: string | null
          badge_tier?: string | null
          approved_notes_count?: number | null
          total_downloads_count?: number | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
