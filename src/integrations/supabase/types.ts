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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      deals: {
        Row: {
          active: boolean
          brand: string | null
          created_at: string
          description: string | null
          discount: string
          end_date: string | null
          id: string
          image_url: string | null
          start_date: string
          title: string
        }
        Insert: {
          active?: boolean
          brand?: string | null
          created_at?: string
          description?: string | null
          discount: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          start_date?: string
          title: string
        }
        Update: {
          active?: boolean
          brand?: string | null
          created_at?: string
          description?: string | null
          discount?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          points: number
          reference: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          points: number
          reference?: string | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          reference?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          barcode: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          points_balance: number
          profile_picture_url: string | null
          surname: string
          tier_id: string | null
          total_points_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          barcode?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          points_balance?: number
          profile_picture_url?: string | null
          surname?: string
          tier_id?: string | null
          total_points_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          barcode?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          points_balance?: number
          profile_picture_url?: string | null
          surname?: string
          tier_id?: string | null
          total_points_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string
          id: string
          points_earned: number
          store_id: string | null
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_earned?: number
          store_id?: string | null
          total_amount?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_earned?: number
          store_id?: string | null
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          points_required: number
          tier_required: string | null
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          points_required: number
          tier_required?: string | null
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          points_required?: number
          tier_required?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_tier_required_fkey"
            columns: ["tier_required"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string
          created_at: string
          hours: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          phone: string | null
        }
        Insert: {
          address: string
          created_at?: string
          hours?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          phone?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          hours?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      tiers: {
        Row: {
          benefits: string[] | null
          discount_percentage: number
          id: string
          min_points: number
          name: string
          sort_order: number
        }
        Insert: {
          benefits?: string[] | null
          discount_percentage?: number
          id?: string
          min_points?: number
          name: string
          sort_order?: number
        }
        Update: {
          benefits?: string[] | null
          discount_percentage?: number
          id?: string
          min_points?: number
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          deals_alerts: boolean
          email_enabled: boolean
          id: string
          points_alerts: boolean
          push_enabled: boolean
          sms_enabled: boolean
          tier_alerts: boolean
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean
        }
        Insert: {
          created_at?: string
          deals_alerts?: boolean
          email_enabled?: boolean
          id?: string
          points_alerts?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          tier_alerts?: boolean
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean
        }
        Update: {
          created_at?: string
          deals_alerts?: boolean
          email_enabled?: boolean
          id?: string
          points_alerts?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          tier_alerts?: boolean
          updated_at?: string
          user_id?: string
          whatsapp_enabled?: boolean
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
