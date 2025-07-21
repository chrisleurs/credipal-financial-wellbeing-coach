import { supabase } from '@/integrations/supabase/client';
import { FinancialData } from '@/types';

export class ApiService {
  static async saveFinancialData(userId: string, data: FinancialData) {
    console.log('Saving financial data for user:', userId, data);
    return { success: true };
  }

  static async getFinancialData(userId: string) {
    console.log('Getting financial data for user:', userId);
    return null;
  }
}