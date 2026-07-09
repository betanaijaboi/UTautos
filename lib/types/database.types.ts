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
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          customer_id: string
          id: string
          is_default: boolean
          label: string
          lat: number | null
          line1: string
          line2: string | null
          lng: number | null
          place_id: string | null
          postal_code: string
          state: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean
          label?: string
          lat?: number | null
          line1: string
          line2?: string | null
          lng?: number | null
          place_id?: string | null
          postal_code: string
          state: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean
          label?: string
          lat?: number | null
          line1?: string
          line2?: string | null
          lng?: number | null
          place_id?: string | null
          postal_code?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_services: {
        Row: {
          booking_id: string
          id: string
          price_cents_snapshot: number
          quantity: number
          service_id: string
        }
        Insert: {
          booking_id: string
          id?: string
          price_cents_snapshot: number
          quantity?: number
          service_id: string
        }
        Update: {
          booking_id?: string
          id?: string
          price_cents_snapshot?: number
          quantity?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_services_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address_id: string | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          consent_id: string | null
          created_at: string
          customer_id: string
          deposit_cents: number
          deposit_percent: number
          detailer_id: string | null
          express_window_end: string | null
          express_window_start: string | null
          face_blur_opt_in: boolean
          garage_item_id: string
          id: string
          notes: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: Database["public"]["Enums"]["booking_status"]
          subtotal_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          address_id?: string | null
          booking_type?: Database["public"]["Enums"]["booking_type"]
          consent_id?: string | null
          created_at?: string
          customer_id: string
          deposit_cents?: number
          deposit_percent?: number
          detailer_id?: string | null
          express_window_end?: string | null
          express_window_start?: string | null
          face_blur_opt_in?: boolean
          garage_item_id: string
          id?: string
          notes?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          address_id?: string | null
          booking_type?: Database["public"]["Enums"]["booking_type"]
          consent_id?: string | null
          created_at?: string
          customer_id?: string
          deposit_cents?: number
          deposit_percent?: number
          detailer_id?: string | null
          express_window_end?: string | null
          express_window_start?: string | null
          face_blur_opt_in?: boolean
          garage_item_id?: string
          id?: string
          notes?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "consents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_detailer_id_fkey"
            columns: ["detailer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_garage_item_id_fkey"
            columns: ["garage_item_id"]
            isOneToOne: false
            referencedRelation: "garage_items"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_brands: {
        Row: {
          created_at: string
          hero_style: Json
          id: string
          is_active: boolean
          monogram: string
          name: string
          slug: string
          sort_order: number
          type: Database["public"]["Enums"]["catalog_type"]
        }
        Insert: {
          created_at?: string
          hero_style?: Json
          id?: string
          is_active?: boolean
          monogram: string
          name: string
          slug: string
          sort_order?: number
          type: Database["public"]["Enums"]["catalog_type"]
        }
        Update: {
          created_at?: string
          hero_style?: Json
          id?: string
          is_active?: boolean
          monogram?: string
          name?: string
          slug?: string
          sort_order?: number
          type?: Database["public"]["Enums"]["catalog_type"]
        }
        Relationships: []
      }
      catalog_models: {
        Row: {
          brand_id: string
          created_at: string
          hero_style: Json
          id: string
          is_active: boolean
          model_year_range: string | null
          name: string
          slug: string
          sort_order: number
          specs: Json
          tagline: string | null
          type: Database["public"]["Enums"]["catalog_type"]
        }
        Insert: {
          brand_id: string
          created_at?: string
          hero_style?: Json
          id?: string
          is_active?: boolean
          model_year_range?: string | null
          name: string
          slug: string
          sort_order?: number
          specs?: Json
          tagline?: string | null
          type: Database["public"]["Enums"]["catalog_type"]
        }
        Update: {
          brand_id?: string
          created_at?: string
          hero_style?: Json
          id?: string
          is_active?: boolean
          model_year_range?: string | null
          name?: string
          slug?: string
          sort_order?: number
          specs?: Json
          tagline?: string | null
          type?: Database["public"]["Enums"]["catalog_type"]
        }
        Relationships: [
          {
            foreignKeyName: "catalog_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "catalog_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          accepted: boolean
          accepted_at: string
          consent_type: Database["public"]["Enums"]["consent_type"]
          customer_id: string
          id: string
          user_agent: string | null
          version: string
        }
        Insert: {
          accepted?: boolean
          accepted_at?: string
          consent_type: Database["public"]["Enums"]["consent_type"]
          customer_id: string
          id?: string
          user_agent?: string | null
          version?: string
        }
        Update: {
          accepted?: boolean
          accepted_at?: string
          consent_type?: Database["public"]["Enums"]["consent_type"]
          customer_id?: string
          id?: string
          user_agent?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      detailer_locations: {
        Row: {
          detailer_id: string
          id: string
          lat: number
          lng: number
          recorded_at: string
        }
        Insert: {
          detailer_id: string
          id?: string
          lat: number
          lng: number
          recorded_at?: string
        }
        Update: {
          detailer_id?: string
          id?: string
          lat?: number
          lng?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "detailer_locations_detailer_id_fkey"
            columns: ["detailer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      garage_items: {
        Row: {
          catalog_model_id: string
          created_at: string
          customer_id: string
          id: string
          is_active: boolean
          nickname: string | null
          removed_at: string | null
          removed_reason: Database["public"]["Enums"]["removal_reason"] | null
          removed_reason_note: string | null
        }
        Insert: {
          catalog_model_id: string
          created_at?: string
          customer_id: string
          id?: string
          is_active?: boolean
          nickname?: string | null
          removed_at?: string | null
          removed_reason?: Database["public"]["Enums"]["removal_reason"] | null
          removed_reason_note?: string | null
        }
        Update: {
          catalog_model_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_active?: boolean
          nickname?: string | null
          removed_at?: string | null
          removed_reason?: Database["public"]["Enums"]["removal_reason"] | null
          removed_reason_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garage_items_catalog_model_id_fkey"
            columns: ["catalog_model_id"]
            isOneToOne: false
            referencedRelation: "catalog_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "garage_items_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          booking_id: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          currency: string
          dev_mode: boolean
          id: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_reference: string | null
          raw_payload: Json | null
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string
        }
        Insert: {
          amount_cents: number
          booking_id: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency?: string
          dev_mode?: boolean
          id?: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_reference?: string | null
          raw_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          booking_id?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency?: string
          dev_mode?: boolean
          id?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_reference?: string | null
          raw_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          default_face_blur_opt_in: boolean
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          default_face_blur_opt_in?: boolean
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          default_face_blur_opt_in?: boolean
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          is_express: boolean
          name: string
          price_cents: number
          sort_order: number
          type: Database["public"]["Enums"]["catalog_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          is_express?: boolean
          name: string
          price_cents: number
          sort_order?: number
          type: Database["public"]["Enums"]["catalog_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          is_express?: boolean
          name?: string
          price_cents?: number
          sort_order?: number
          type?: Database["public"]["Enums"]["catalog_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_dev_payment: {
        Args: { p_booking_id: string; p_provider: string }
        Returns: undefined
      }
    }
    Enums: {
      booking_status:
        | "pending_payment"
        | "deposit_paid"
        | "confirmed"
        | "detailer_assigned"
        | "en_route"
        | "in_progress"
        | "completed"
        | "cancelled"
      booking_type: "scheduled" | "express"
      catalog_type: "car" | "jet"
      consent_type: "smart_glasses_recording" | "terms" | "privacy"
      payment_provider:
        | "stripe"
        | "paystack"
        | "paypal"
        | "apple_pay"
        | "bank_transfer"
      payment_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "manually_confirmed"
        | "refunded"
      payment_type: "deposit" | "remainder"
      removal_reason:
        | "sold"
        | "accident"
        | "upgrade"
        | "none_of_your_business"
        | "other"
      user_role: "customer" | "detailer" | "admin"
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
    Enums: {
      booking_status: [
        "pending_payment",
        "deposit_paid",
        "confirmed",
        "detailer_assigned",
        "en_route",
        "in_progress",
        "completed",
        "cancelled",
      ],
      booking_type: ["scheduled", "express"],
      catalog_type: ["car", "jet"],
      consent_type: ["smart_glasses_recording", "terms", "privacy"],
      payment_provider: [
        "stripe",
        "paystack",
        "paypal",
        "apple_pay",
        "bank_transfer",
      ],
      payment_status: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "manually_confirmed",
        "refunded",
      ],
      payment_type: ["deposit", "remainder"],
      removal_reason: [
        "sold",
        "accident",
        "upgrade",
        "none_of_your_business",
        "other",
      ],
      user_role: ["customer", "detailer", "admin"],
    },
  },
} as const
