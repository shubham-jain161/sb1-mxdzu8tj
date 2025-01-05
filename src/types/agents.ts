// Existing types remain...

export interface BatchOperationResult {
  successful: number;
  failed: number;
  total: number;
}

export interface TokenUsage {
  used: number;
  remaining: number;
}

export interface CampaignConfig {
  name: string;
  template: EmailTemplate;
  followUps?: {
    days: number;
    subject: string;
    body: string;
  }[];
  schedule?: {
    startDate: string;
    endDate?: string;
    timezone: string;
    sendingHours?: {
      start: number;
      end: number;
    };
  };
}

export interface AgentResponse<T> {
  data?: T;
  error?: string;
  tokenUsage: TokenUsage;
}