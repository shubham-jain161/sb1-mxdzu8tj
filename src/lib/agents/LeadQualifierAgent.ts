import { BaseAgent } from './BaseAgent';
import type { Lead, QualificationCriteria } from '../../types/agents';

export class LeadQualifierAgent extends BaseAgent {
  async qualifyLead(userId: string, lead: Lead): Promise<Lead> {
    const hasTokens = await this.checkTokenAvailability(userId, 50);
    if (!hasTokens) {
      throw new Error('Insufficient tokens');
    }

    try {
      const prompt = `Analyze and score this lead:
        Name: ${lead.name}
        Company: ${lead.company}
        Position: ${lead.position}
        Industry: ${lead.industry}
        
        Provide a JSON response with:
        - score (0-100)
        - criteria {industryFit, companySize, budget, timeline, technicalFit}
        - notes (qualification reasoning)`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const qualification = JSON.parse(response.text());

      const { data: updatedLead, error } = await this.supabase
        .from('leads')
        .update({
          score: qualification.score,
          status: 'qualified',
          notes: qualification.notes
        })
        .eq('id', lead.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      await this.trackTokenUsage(userId, 'qualify_lead', 50);
      return updatedLead;
    } catch (error) {
      console.error('Error qualifying lead:', error);
      throw error;
    }
  }

  async batchQualifyLeads(userId: string, leads: Lead[]): Promise<Lead[]> {
    const totalTokens = leads.length * 50;
    const hasTokens = await this.checkTokenAvailability(userId, totalTokens);
    if (!hasTokens) {
      throw new Error('Insufficient tokens');
    }

    const qualifiedLeads = await Promise.all(
      leads.map(lead => this.qualifyLead(userId, lead))
    );

    return qualifiedLeads;
  }
}