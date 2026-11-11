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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      account_access: {
        Row: {
          suspended: boolean
          user_id: string
        }
        Insert: {
          suspended?: boolean
          user_id: string
        }
        Update: {
          suspended?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_content: {
        Row: {
          active: boolean
          created_at: string
          data: Json
          id: string
          kind: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          data?: Json
          id?: string
          kind: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          data?: Json
          id?: string
          kind?: string
          name?: string
        }
        Relationships: []
      }
      breaking_news: {
        Row: {
          created_at: string
          id: string
          minutes: number
          region: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          minutes?: number
          region: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          minutes?: number
          region?: string
          text?: string
        }
        Relationships: []
      }
      broadcast_settings: {
        Row: {
          data: Json
          id: string
        }
        Insert: {
          data?: Json
          id?: string
        }
        Update: {
          data?: Json
          id?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          ai_voice: boolean
          category: string
          clip_paths: Json
          constituency: string
          created_at: string
          district_id: string
          feedback: string | null
          headline: string
          id: string
          image: string
          importance: string
          reporter_id: string
          script: string
          status: string
          urgent: boolean
          views: number
        }
        Insert: {
          ai_voice?: boolean
          category: string
          clip_paths?: Json
          constituency: string
          created_at?: string
          district_id: string
          feedback?: string | null
          headline: string
          id?: string
          image?: string
          importance?: string
          reporter_id: string
          script: string
          status?: string
          urgent?: boolean
          views?: number
        }
        Update: {
          ai_voice?: boolean
          category?: string
          clip_paths?: Json
          constituency?: string
          created_at?: string
          district_id?: string
          feedback?: string | null
          headline?: string
          id?: string
          image?: string
          importance?: string
          reporter_id?: string
          script?: string
          status?: string
          urgent?: boolean
          views?: number
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount: number
          created_at: string
          id: string
          journalist_id: string
          month: string
          note: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          journalist_id: string
          month: string
          note?: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          journalist_id?: string
          month?: string
          note?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string
          avatar: string
          bio: string
          constituency: string
          contact_email: string
          created_at: string
          district_id: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          address?: string
          avatar?: string
          bio?: string
          constituency?: string
          contact_email?: string
          created_at?: string
          district_id?: string
          id: string
          name?: string
          phone?: string
        }
        Update: {
          address?: string
          avatar?: string
          bio?: string
          constituency?: string
          contact_email?: string
          created_at?: string
          district_id?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      account_enabled: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_editor: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "journalist"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "journalist"],
    },
  },
} as const
