import { useState, useCallback } from 'react';
import { LeadFinderAgent } from '../lib/agents/LeadFinderAgent';
import { LeadQualifierAgent } from '../lib/agents/LeadQualifierAgent';
import { CommunicationAgent } from '../lib/agents/CommunicationAgent';
import type { 
  Lead, 
  LeadSearchParams, 
  EmailTemplate, 
  QualificationCriteria,
  BatchOperationResult,
  TokenUsage,
  CampaignConfig
} from '../types/agents';
import { useToast } from '../hooks/useToast'; // Assuming you have a toast hook
import { useSupabase } from '../hooks/useSupabase'; // Assuming you have a Supabase hook

export interface AgentOperationResult<T> {
  data?: T;
  error?: string;
  tokenUsage: TokenUsage;
}

export function useAgents(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage>({ used: 0, remaining: 0 });
  const { showToast } = useToast();
  const { supabase } = useSupabase();

  // Initialize agents with Supabase client
  const leadFinder = new LeadFinderAgent(supabase);
  const leadQualifier = new LeadQualifierAgent(supabase);
  const communicationAgent = new CommunicationAgent(supabase);

  // Helper function to handle operations
  const handleOperation = async <T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<AgentOperationResult<T>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      const usage = await updateTokenUsage(userId);
      setTokenUsage(usage);
      return { data: result, tokenUsage: usage };
    } catch (err) {
      const errorMsg = err.message || errorMessage;
      setError(errorMsg);
      showToast('error', errorMsg);
      return { error: errorMsg, tokenUsage };
    } finally {
      setLoading(false);
    }
  };

  // Update token usage
  const updateTokenUsage = async (userId: string): Promise<TokenUsage> => {
    const usage = await supabase
      .from('token_usage')
      .select('used, remaining')
      .eq('user_id', userId)
      .single();
    return usage.data;
  };

  // Find leads with batch support
  const findLeads = useCallback(async (
    params: LeadSearchParams,
    batchSize: number = 50
  ): Promise<AgentOperationResult<Lead[]>> => {
    return handleOperation(
      async () => {
        const leads = await leadFinder.findLeads(userId, params, batchSize);
        await saveLeadsToDatabase(leads);
        return leads;
      },
      'Failed to find leads'
    );
  }, [userId]);

  // Qualify leads in batch
  const qualifyLeads = useCallback(async (
    leads: Lead[],
    criteria: QualificationCriteria
  ): Promise<AgentOperationResult<BatchOperationResult>> => {
    return handleOperation(
      async () => {
        const results = await Promise.allSettled(
          leads.map(lead => leadQualifier.qualifyLead(userId, lead, criteria))
        );
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        return { successful, failed, total: leads.length };
      },
      'Failed to qualify leads'
    );
  }, [userId]);

  // Create and manage email campaigns
  const createCampaign = useCallback(async (
    config: CampaignConfig,
    leads: Lead[]
  ): Promise<AgentOperationResult<string>> => {
    return handleOperation(
      async () => {
        const campaignId = await communicationAgent.createCampaign(userId, config);
        await communicationAgent.addLeadsToCampaign(campaignId, leads);
        return campaignId;
      },
      'Failed to create campaign'
    );
  }, [userId]);

  // Send emails with retry logic and rate limiting
  const sendEmails = useCallback(async (
    campaignId: string,
    template: EmailTemplate,
    batchSize: number = 10
  ): Promise<AgentOperationResult<BatchOperationResult>> => {
    return handleOperation(
      async () => {
        const leads = await communicationAgent.getCampaignLeads(campaignId);
        let successful = 0;
        let failed = 0;

        // Process in batches with rate limiting
        for (let i = 0; i < leads.length; i += batchSize) {
          const batch = leads.slice(i, i + batchSize);
          const results = await Promise.allSettled(
            batch.map(async lead => {
              const content = await communicationAgent.generateEmailContent(
                userId,
                lead,
                template
              );
              return communicationAgent.sendEmail(
                userId,
                lead.email,
                template.subject,
                content
              );
            })
          );

          successful += results.filter(r => r.status === 'fulfilled').length;
          failed += results.filter(r => r.status === 'rejected').length;

          // Rate limiting
          if (i + batchSize < leads.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        return { successful, failed, total: leads.length };
      },
      'Failed to send emails'
    );
  }, [userId]);

  // Handle email responses and update conversation history
  const handleEmailResponse = useCallback(async (
    leadId: string,
    response: string
  ): Promise<AgentOperationResult<void>> => {
    return handleOperation(
      async () => {
        await communicationAgent.handleResponse(userId, leadId, response);
      },
      'Failed to handle email response'
    );
  }, [userId]);

  return {
    findLeads,
    qualifyLeads,
    createCampaign,
    sendEmails,
    handleEmailResponse,
    loading,
    error,
    tokenUsage
  };
}