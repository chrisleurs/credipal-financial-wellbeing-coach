
import OpenAI from 'openai';

// Tipos específicos para Credi (NO modificar types/index.ts)
interface CrediPlan {
  shortTermGoals: CrediGoal[];
  mediumTermGoals: CrediGoal[];
  longTermGoals: CrediGoal[];
  motivationalMessage: string;
}

interface CrediGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  deadline: string;
  reason: string;
}

export class CrediAIService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async generatePlan(monthlyIncome: number, monthlyExpenses: number): Promise<CrediPlan> {
    const prompt = `
    Eres "Credi", asesor financiero amigable.
    Usuario: Ingresos $${monthlyIncome}, Gastos $${monthlyExpenses}
    
    Crea plan 3-2-1: 3 metas corto plazo, 2 mediano, 1 largo plazo.
    
    Responde en JSON:
    {
      "shortTermGoals": [{"id": "1", "title": "...", "description": "...", "targetAmount": 500, "deadline": "2025-09-01", "reason": "..."}],
      "mediumTermGoals": [...],
      "longTermGoals": [...],
      "motivationalMessage": "..."
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

export const crediAI = new CrediAIService();
