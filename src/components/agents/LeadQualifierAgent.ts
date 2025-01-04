import { getGeminiModel } from '../../lib/gemini';
import type { Lead } from '../../types/agents';

export class LeadQualifierAgent {
  private model = getGeminiModel();

  async qualifyLead(lead: Lead): Promise<Lead> {
    try {
      const prompt = `Qualify this lead based on their profile:
        Name: ${lead.name}
        Company: ${lead.company}
        Position: ${lead.position}
        
        Analyze their suitability and provide a qualification score (0-100)
        and detailed notes about why they might be a good fit.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const qualification = JSON.parse(response.text());

      return {
        ...lead,
        status: 'qualified',
        score: qualification.score,
        notes: qualification.notes
      };
    } catch (error) {
      console.error('Error qualifying lead:', error);
      throw error;
    }
  }
}