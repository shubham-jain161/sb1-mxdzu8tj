export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  position: string;
  status: 'new' | 'qualified' | 'contacted' | 'responded';
  score: number;
  lastContact?: Date;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads: Lead[];
  template: string;
  followUps: string[];
  stats: {
    sent: number;
    opened: number;
    replied: number;
  };
}

export interface Conversation {
  id: string;
  leadId: string;
  campaignId: string;
  messages: {
    id: string;
    content: string;
    timestamp: Date;
    sender: 'agent' | 'lead';
  }[];
  status: 'active' | 'closed';
  lastActivity: Date;
}