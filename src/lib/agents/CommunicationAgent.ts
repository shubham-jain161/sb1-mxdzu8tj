import { BaseAgent } from './BaseAgent';
import { emailClient } from '../azure-email';
import type { Lead, EmailTemplate } from '../../types/agents';

export class CommunicationAgent extends BaseAgent {
  async generateEmailContent(
    userId: string,
    lead: Lead,
    template: EmailTemplate
  ): Promise<string> {
    const hasTokens = await this.checkTokenAvailability(userId, 30);
    if (!hasTokens) {
      throw new Error('Insufficient tokens');
    }

    try {
      const prompt = `Create a personalized email for:
        Name: ${lead.name}
        Company: ${lead.company}
        Position: ${lead.position}
        
        Using this template:
        ${template.body}
        
        Make it personal and engaging while maintaining the core message.
        Replace variables like {name}, {company} with actual values.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const emailContent = response.text();

      await this.trackTokenUsage(userId, 'generate_email', 30);
      return emailContent;
    } catch (error) {
      console.error('Error generating email:', error);
      throw error;
    }
  }

  async sendEmail(
    userId: string,
    to: string,
    subject: string,
    content: string
  ): Promise<void> {
    try {
      await emailClient.send({
        senderAddress: "ai-agents@your-domain.com",
        content: {
          subject,
          plainText: content
        },
        recipients: {
          to: [{ address: to }]
        }
      });

      // Log the email in conversations
      const { error } = await this.supabase
        .from('conversations')
        .insert({
          user_id: userId,
          lead_id: to,
          status: 'active',
          messages: [{
            sender: 'agent',
            content,
            sent_at: new Date().toISOString()
          }]
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async handleReply(
    userId: string,
    conversationId: string,
    replyContent: string
  ): Promise<string> {
    const hasTokens = await this.checkTokenAvailability(userId, 50);
    if (!hasTokens) {
      throw new Error('Insufficient tokens');
    }

    try {
      const prompt = `Generate a response to this email:
        ${replyContent}
        
        Keep the response professional, engaging, and focused on moving the conversation forward.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseContent = response.text();

      // Log the response in conversations
      const { error } = await this.supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender: 'agent',
          content: responseContent
        });

      if (error) throw error;

      await this.trackTokenUsage(userId, 'handle_reply', 50);
      return responseContent;
    } catch (error) {
      console.error('Error handling reply:', error);
      throw error;
    }
  }
}