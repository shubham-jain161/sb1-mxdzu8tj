import { BaseAgent } from './BaseAgent';
import type { Lead, LeadSearchParams } from '../../types/agents';

export class LeadFinderAgent extends BaseAgent {
  async findLeads(userId: string, params: LeadSearchParams): Promise<Lead[]> {
    const hasTokens = await this.checkTokenAvailability(userId, 100);
    if (!hasTokens) {
      throw new Error('Insufficient tokens');
    }

    try {
      const prompt = `Find potential leads matching these criteria:
        Keywords: ${params.keywords.join(', ')}
        Industry: ${params.industry || 'Any'}
        Location: ${params.location || 'Any'}
        
        Format response as JSON array with properties:
        - name
        - email
        - company
        - position
        - industry`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const leads: Lead[] = JSON.parse(response.text());

      // Save leads to database
      const { data: savedLeads, error } = await this.supabase
        .from('leads')
        .insert(
          leads.map(lead => ({
            ...lead,
            user_id: userId,
            status: 'new',
            score: 0
          }))
        )
        .select();

      if (error) throw error;

      await this.trackTokenUsage(userId, 'find_leads', 100);
      return savedLeads;
    } catch (error) {
      console.error('Error finding leads:', error);
      throw error;
    }
  }

  async importLeadsFromCsv(userId: string, csvContent: string): Promise<Lead[]> {
    try {
      const rows = csvContent.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const leads = rows.slice(1).map(row => {
        const lead: Partial<Lead> = {};
        headers.forEach((header, index) => {
          lead[header.trim().toLowerCase()] = row[index]?.trim();
        });
        return lead;
      });

      const { data: savedLeads, error } = await this.supabase
        .from('leads')
        .insert(
          leads.map(lead => ({
            ...lead,
            user_id: userId,
            status: 'new',
            score: 0
          }))
        )
        .select();

      if (error) throw error;
      return savedLeads;
    } catch (error) {
      console.error('Error importing leads:', error);
      throw error;
    }
  }
}