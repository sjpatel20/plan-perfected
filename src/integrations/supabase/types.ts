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
      advisories: {
        Row: {
          audio_url: string | null
          category: string
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          message_local: Json | null
          severity: string | null
          target_crop: string | null
          target_region: string | null
          title: string
          user_id: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          audio_url?: string | null
          category: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          message_local?: Json | null
          severity?: string | null
          target_crop?: string | null
          target_region?: string | null
          title: string
          user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          audio_url?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          message_local?: Json | null
          severity?: string | null
          target_crop?: string | null
          target_region?: string | null
          title?: string
          user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_cycles: {
        Row: {
          actual_harvest_date: string | null
          actual_yield_kg: number | null
          created_at: string
          crop_name: string
          crop_variety: string | null
          current_stage: string | null
          expected_harvest_date: string | null
          expected_yield_kg: number | null
          health_status: string | null
          id: string
          notes: string | null
          plot_id: string
          season: string | null
          sowing_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_harvest_date?: string | null
          actual_yield_kg?: number | null
          created_at?: string
          crop_name: string
          crop_variety?: string | null
          current_stage?: string | null
          expected_harvest_date?: string | null
          expected_yield_kg?: number | null
          health_status?: string | null
          id?: string
          notes?: string | null
          plot_id: string
          season?: string | null
          sowing_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_harvest_date?: string | null
          actual_yield_kg?: number | null
          created_at?: string
          crop_name?: string
          crop_variety?: string | null
          current_stage?: string | null
          expected_harvest_date?: string | null
          expected_yield_kg?: number | null
          health_status?: string | null
          id?: string
          notes?: string | null
          plot_id?: string
          season?: string | null
          sowing_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_cycles_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_scans: {
        Row: {
          confidence_score: number | null
          created_at: string
          crop_cycle_id: string | null
          diagnosis_result: Json | null
          disease_detected: string | null
          id: string
          image_url: string
          latitude: number | null
          longitude: number | null
          recommendations: string[] | null
          scan_date: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          crop_cycle_id?: string | null
          diagnosis_result?: Json | null
          disease_detected?: string | null
          id?: string
          image_url: string
          latitude?: number | null
          longitude?: number | null
          recommendations?: string[] | null
          scan_date?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          crop_cycle_id?: string | null
          diagnosis_result?: Json | null
          disease_detected?: string | null
          id?: string
          image_url?: string
          latitude?: number | null
          longitude?: number | null
          recommendations?: string[] | null
          scan_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_scans_crop_cycle_id_fkey"
            columns: ["crop_cycle_id"]
            isOneToOne: false
            referencedRelation: "crop_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      govt_schemes: {
        Row: {
          application_url: string | null
          benefits: string | null
          created_at: string
          description: string
          description_local: Json | null
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          ministry: string | null
          scheme_name: string
          scheme_name_local: Json | null
          target_crops: string[] | null
          target_states: string[] | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          application_url?: string | null
          benefits?: string | null
          created_at?: string
          description: string
          description_local?: Json | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          ministry?: string | null
          scheme_name: string
          scheme_name_local?: Json | null
          target_crops?: string[] | null
          target_states?: string[] | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          application_url?: string | null
          benefits?: string | null
          created_at?: string
          description?: string
          description_local?: Json | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          ministry?: string | null
          scheme_name?: string
          scheme_name_local?: Json | null
          target_crops?: string[] | null
          target_states?: string[] | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          arrival_quantity: number | null
          commodity: string
          commodity_local: Json | null
          created_at: string
          id: string
          mandi_district: string | null
          mandi_name: string
          mandi_state: string
          max_price: number | null
          min_price: number | null
          modal_price: number | null
          price_date: string
          price_unit: string | null
          source: string | null
        }
        Insert: {
          arrival_quantity?: number | null
          commodity: string
          commodity_local?: Json | null
          created_at?: string
          id?: string
          mandi_district?: string | null
          mandi_name: string
          mandi_state: string
          max_price?: number | null
          min_price?: number | null
          modal_price?: number | null
          price_date: string
          price_unit?: string | null
          source?: string | null
        }
        Update: {
          arrival_quantity?: number | null
          commodity?: string
          commodity_local?: Json | null
          created_at?: string
          id?: string
          mandi_district?: string | null
          mandi_name?: string
          mandi_state?: string
          max_price?: number | null
          min_price?: number | null
          modal_price?: number | null
          price_date?: string
          price_unit?: string | null
          source?: string | null
        }
        Relationships: []
      }
      plots: {
        Row: {
          area_hectares: number | null
          created_at: string
          id: string
          irrigation_type: string | null
          latitude: number | null
          longitude: number | null
          ownership_type: string | null
          plot_name: string
          soil_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area_hectares?: number | null
          created_at?: string
          id?: string
          irrigation_type?: string | null
          latitude?: number | null
          longitude?: number | null
          ownership_type?: string | null
          plot_name: string
          soil_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area_hectares?: number | null
          created_at?: string
          id?: string
          irrigation_type?: string | null
          latitude?: number | null
          longitude?: number | null
          ownership_type?: string | null
          plot_name?: string
          soil_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_type: string
          commodity: string
          created_at: string
          id: string
          is_active: boolean
          last_checked_at: string | null
          last_known_price: number | null
          mandi_name: string | null
          mandi_state: string | null
          threshold_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type?: string
          commodity: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          last_known_price?: number | null
          mandi_name?: string | null
          mandi_state?: string | null
          threshold_percentage?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          commodity?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          last_known_price?: number | null
          mandi_name?: string | null
          mandi_state?: string | null
          threshold_percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_notifications: {
        Row: {
          alert_id: string
          change_percentage: number
          change_type: string
          commodity: string
          created_at: string
          id: string
          is_read: boolean
          mandi_name: string | null
          new_price: number
          old_price: number
          user_id: string
        }
        Insert: {
          alert_id: string
          change_percentage: number
          change_type: string
          commodity: string
          created_at?: string
          id?: string
          is_read?: boolean
          mandi_name?: string | null
          new_price: number
          old_price: number
          user_id: string
        }
        Update: {
          alert_id?: string
          change_percentage?: number
          change_type?: string
          commodity?: string
          created_at?: string
          id?: string
          is_read?: boolean
          mandi_name?: string | null
          new_price?: number
          old_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_notifications_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "price_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          district: string | null
          farmer_id: string | null
          full_name: string
          id: string
          mobile_number: string | null
          pincode: string | null
          preferred_language: string | null
          state: string | null
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          district?: string | null
          farmer_id?: string | null
          full_name: string
          id?: string
          mobile_number?: string | null
          pincode?: string | null
          preferred_language?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          district?: string | null
          farmer_id?: string | null
          full_name?: string
          id?: string
          mobile_number?: string | null
          pincode?: string | null
          preferred_language?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          village?: string | null
        }
        Relationships: []
      }
      soil_data: {
        Row: {
          boron: number | null
          copper: number | null
          created_at: string
          ec: number | null
          id: string
          iron: number | null
          manganese: number | null
          nitrogen: number | null
          organic_carbon: number | null
          ph: number | null
          phosphorus: number | null
          plot_id: string
          potassium: number | null
          shc_card_number: string | null
          sulphur: number | null
          test_date: string
          zinc: number | null
        }
        Insert: {
          boron?: number | null
          copper?: number | null
          created_at?: string
          ec?: number | null
          id?: string
          iron?: number | null
          manganese?: number | null
          nitrogen?: number | null
          organic_carbon?: number | null
          ph?: number | null
          phosphorus?: number | null
          plot_id: string
          potassium?: number | null
          shc_card_number?: string | null
          sulphur?: number | null
          test_date: string
          zinc?: number | null
        }
        Update: {
          boron?: number | null
          copper?: number | null
          created_at?: string
          ec?: number | null
          id?: string
          iron?: number | null
          manganese?: number | null
          nitrogen?: number | null
          organic_carbon?: number | null
          ph?: number | null
          phosphorus?: number | null
          plot_id?: string
          potassium?: number | null
          shc_card_number?: string | null
          sulphur?: number | null
          test_date?: string
          zinc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soil_data_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
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
