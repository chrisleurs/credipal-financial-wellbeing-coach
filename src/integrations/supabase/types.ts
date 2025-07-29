export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          created_at: string
          id: string
          is_implemented: boolean
          priority: number
          recommendation_text: string
          recommendation_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_implemented?: boolean
          priority?: number
          recommendation_text: string
          recommendation_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_implemented?: boolean
          priority?: number
          recommendation_text?: string
          recommendation_type?: string
          user_id?: string
        }
        Relationships: []
      }
      budget: {
        Row: {
          created_at: string
          emergency_allocation: number
          entertainment_budget: number
          fixed_expenses: number
          food_budget: number
          id: string
          savings_allocation: number
          transport_budget: number
          updated_at: string
          user_id: string
          variable_expenses: number
        }
        Insert: {
          created_at?: string
          emergency_allocation?: number
          entertainment_budget?: number
          fixed_expenses?: number
          food_budget?: number
          id?: string
          savings_allocation?: number
          transport_budget?: number
          updated_at?: string
          user_id: string
          variable_expenses?: number
        }
        Update: {
          created_at?: string
          emergency_allocation?: number
          entertainment_budget?: number
          fixed_expenses?: number
          food_budget?: number
          id?: string
          savings_allocation?: number
          transport_budget?: number
          updated_at?: string
          user_id?: string
          variable_expenses?: number
        }
        Relationships: []
      }
      debt_payments: {
        Row: {
          amount: number
          created_at: string
          debt_id: string
          id: string
          notes: string | null
          payment_date: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          debt_id: string
          id?: string
          notes?: string | null
          payment_date?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          debt_id?: string
          id?: string
          notes?: string | null
          payment_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debt_payments_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
      debt_reminders: {
        Row: {
          created_at: string
          days_before: number
          debt_id: string
          id: string
          is_active: boolean
          reminder_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_before: number
          debt_id: string
          id?: string
          is_active?: boolean
          reminder_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_before?: number
          debt_id?: string
          id?: string
          is_active?: boolean
          reminder_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debt_reminders_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
      debts: {
        Row: {
          annual_interest_rate: number
          created_at: string
          creditor_name: string
          current_balance: number
          description: string | null
          due_day: number
          id: string
          minimum_payment: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_interest_rate?: number
          created_at?: string
          creditor_name: string
          current_balance: number
          description?: string | null
          due_day: number
          id?: string
          minimum_payment: number
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_interest_rate?: number
          created_at?: string
          creditor_name?: string
          current_balance?: number
          description?: string | null
          due_day?: number
          id?: string
          minimum_payment?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          expense_date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          expense_date?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_data: {
        Row: {
          created_at: string
          emergency_fund_goal: number
          id: string
          loan_amount: number
          monthly_balance: number
          monthly_expenses: number
          monthly_income: number
          monthly_payment: number
          savings_goal: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_fund_goal?: number
          id?: string
          loan_amount?: number
          monthly_balance?: number
          monthly_expenses?: number
          monthly_income?: number
          monthly_payment?: number
          savings_goal?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_fund_goal?: number
          id?: string
          loan_amount?: number
          monthly_balance?: number
          monthly_expenses?: number
          monthly_income?: number
          monthly_payment?: number
          savings_goal?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_amount: number
          goal_name: string
          goal_type: string
          id: string
          priority: string
          status: string
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          goal_name: string
          goal_type: string
          id?: string
          priority?: string
          status?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          goal_name?: string
          goal_type?: string
          id?: string
          priority?: string
          status?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string | null
          id: string
          transaction_date: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          transaction_date?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          transaction_date?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_action_plans: {
        Row: {
          actions: Json
          created_at: string
          financial_plan_id: string | null
          id: string
          next_review_date: string | null
          status: string
          updated_at: string
          user_id: string
          whatsapp_reminders: boolean
        }
        Insert: {
          actions?: Json
          created_at?: string
          financial_plan_id?: string | null
          id?: string
          next_review_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
          whatsapp_reminders?: boolean
        }
        Update: {
          actions?: Json
          created_at?: string
          financial_plan_id?: string | null
          id?: string
          next_review_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          whatsapp_reminders?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_action_plans_financial_plan_id_fkey"
            columns: ["financial_plan_id"]
            isOneToOne: false
            referencedRelation: "user_financial_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_financial_data: {
        Row: {
          ahorros: Json
          created_at: string
          deudas: Json
          gastos_categorizados: Json
          id: string
          ingresos: number
          ingresos_extras: number
          metas: Json
          updated_at: string
          user_data: Json
          user_id: string
        }
        Insert: {
          ahorros?: Json
          created_at?: string
          deudas?: Json
          gastos_categorizados?: Json
          id?: string
          ingresos?: number
          ingresos_extras?: number
          metas?: Json
          updated_at?: string
          user_data?: Json
          user_id: string
        }
        Update: {
          ahorros?: Json
          created_at?: string
          deudas?: Json
          gastos_categorizados?: Json
          id?: string
          ingresos?: number
          ingresos_extras?: number
          metas?: Json
          updated_at?: string
          user_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_financial_plans: {
        Row: {
          created_at: string
          id: string
          plan_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_loans: {
        Row: {
          created_at: string
          id: string
          loan_amount: number
          loan_interest_estimate: number
          loan_origin: string
          loan_payment_per_term: number
          loan_start_date: string
          loan_status: Database["public"]["Enums"]["loan_status"]
          loan_term_quincenas: number
          loan_total_payment: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          loan_amount: number
          loan_interest_estimate: number
          loan_origin: string
          loan_payment_per_term: number
          loan_start_date?: string
          loan_status?: Database["public"]["Enums"]["loan_status"]
          loan_term_quincenas: number
          loan_total_payment: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          loan_amount?: number
          loan_interest_estimate?: number
          loan_origin?: string
          loan_payment_per_term?: number
          loan_start_date?: string
          loan_status?: Database["public"]["Enums"]["loan_status"]
          loan_term_quincenas?: number
          loan_total_payment?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
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
      loan_status: "pending_plan" | "active" | "completed"
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
      loan_status: ["pending_plan", "active", "completed"],
    },
  },
} as const
