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
      debts: {
        Row: {
          created_at: string
          creditor: string
          current_balance: number
          due_date: string | null
          id: string
          interest_rate: number
          monthly_payment: number
          original_amount: number
          status: Database["public"]["Enums"]["debt_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creditor: string
          current_balance?: number
          due_date?: string | null
          id?: string
          interest_rate?: number
          monthly_payment?: number
          original_amount?: number
          status?: Database["public"]["Enums"]["debt_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          creditor?: string
          current_balance?: number
          due_date?: string | null
          id?: string
          interest_rate?: number
          monthly_payment?: number
          original_amount?: number
          status?: Database["public"]["Enums"]["debt_status"]
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
          date: string
          description: string | null
          id: string
          is_recurring: boolean
          subcategory: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          subcategory?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          subcategory?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_plans: {
        Row: {
          created_at: string
          id: string
          plan_data: Json
          plan_type: string
          status: Database["public"]["Enums"]["plan_status"]
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          plan_data?: Json
          plan_type?: string
          status?: Database["public"]["Enums"]["plan_status"]
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          plan_data?: Json
          plan_type?: string
          status?: Database["public"]["Enums"]["plan_status"]
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      financial_summary: {
        Row: {
          emergency_fund: number
          id: string
          last_calculated: string
          monthly_debt_payments: number
          savings_capacity: number
          total_debt: number
          total_monthly_expenses: number
          total_monthly_income: number
          updated_at: string
          user_id: string
        }
        Insert: {
          emergency_fund?: number
          id?: string
          last_calculated?: string
          monthly_debt_payments?: number
          savings_capacity?: number
          total_debt?: number
          total_monthly_expenses?: number
          total_monthly_income?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          emergency_fund?: number
          id?: string
          last_calculated?: string
          monthly_debt_payments?: number
          savings_capacity?: number
          total_debt?: number
          total_monthly_expenses?: number
          total_monthly_income?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_amount: number
          deadline: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["goal_priority"]
          status: Database["public"]["Enums"]["goal_status"]
          target_amount: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["goal_priority"]
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["goal_priority"]
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      income_sources: {
        Row: {
          amount: number
          created_at: string
          frequency: Database["public"]["Enums"]["frequency_type"]
          id: string
          is_active: boolean
          source_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          frequency?: Database["public"]["Enums"]["frequency_type"]
          id?: string
          is_active?: boolean
          source_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          frequency?: Database["public"]["Enums"]["frequency_type"]
          id?: string
          is_active?: boolean
          source_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          created_at: string | null
          date: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          source: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          source: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          source?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loans: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          lender: string
          next_payment_date: string
          payment_amount: number
          payment_dates: number[]
          remaining_payments: number
          status: string
          total_payments: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          lender: string
          next_payment_date: string
          payment_amount: number
          payment_dates: number[]
          remaining_payments: number
          status?: string
          total_payments: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          lender?: string
          next_payment_date?: string
          payment_amount?: number
          payment_dates?: number[]
          remaining_payments?: number
          status?: string
          total_payments?: number
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
          onboarding_data: Json | null
          onboarding_step: number | null
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
          onboarding_data?: Json | null
          onboarding_step?: number | null
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
          onboarding_data?: Json | null
          onboarding_step?: number | null
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
        Relationships: []
      }
      user_categories: {
        Row: {
          created_at: string
          id: string
          main_category: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          main_category: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          main_category?: string
          name?: string
          updated_at?: string
          user_id?: string
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
      calculate_financial_summary: {
        Args: { target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      debt_status: "active" | "paid" | "delinquent"
      frequency_type: "monthly" | "biweekly" | "weekly" | "yearly"
      goal_priority: "high" | "medium" | "low"
      goal_status: "active" | "completed" | "paused"
      loan_status: "pending_plan" | "active" | "completed"
      plan_status: "draft" | "active" | "completed"
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
      debt_status: ["active", "paid", "delinquent"],
      frequency_type: ["monthly", "biweekly", "weekly", "yearly"],
      goal_priority: ["high", "medium", "low"],
      goal_status: ["active", "completed", "paused"],
      loan_status: ["pending_plan", "active", "completed"],
      plan_status: ["draft", "active", "completed"],
    },
  },
} as const
