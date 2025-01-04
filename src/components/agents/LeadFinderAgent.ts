import { getGeminiModel } from '../../lib/gemini';
import type { Lead } from '../../types/agents';

export class LeadFinderAgent {
  private model = getGeminiModel();

  async findLeads(keywords: string[], filters: Record<string, any>): Promise<Lead[]> {
    try {
      const prompt = `Find potential leads matching these keywords: ${keywords.join(', ')}
        Consider these filters: ${JSON.stringify(filters)}
        Format the response as JSON array of leads with name, company, position, and email.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const leads = JSON.parse(response.text());

      return leads.map((lead: any) => ({
        ...lead,
        id: crypto.randomUUID(),
        status: 'new',
        score: 0
      }));
    } catch (error) {
      console.error('Error finding leads:', error);
      throw error;
    }
  }
}