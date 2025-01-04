import { emailClient } from '../../lib/azure-email';
import { getGeminiModel } from '../../lib/gemini';
import type { Lead, Campaign } from '../../types/agents';

export class CommunicationAgent {
  private model = getGeminiModel();

  async generateEmailContent(lead: Lead, campaign: Campaign): Promise<string> {
    try {
      const prompt = `Create a personalized email for:
        Name: ${lead.name}
        Company: ${lead.company}
        Position: ${lead.position}
        
        Using this template:
        ${campaign.template}
        
        Make it personal and engaging while maintaining the core message.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating email:', error);
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
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
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}