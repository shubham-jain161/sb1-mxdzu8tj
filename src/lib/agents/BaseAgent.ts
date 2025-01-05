import { supabase } from '../supabase';
import { getGeminiModel } from '../gemini';

export class BaseAgent {
  protected model = getGeminiModel();
  protected supabase = supabase;

  protected async trackTokenUsage(userId: string, operation: string, tokens: number) {
    await this.supabase
      .from('token_usage')
      .insert({
        user_id: userId,
        operation_type: operation,
        tokens_used: tokens
      });
  }

  protected async checkTokenAvailability(userId: string, requiredTokens: number): Promise<boolean> {
    const { data: user } = await this.supabase
      .from('users')
      .select('tokens_remaining')
      .eq('id', userId)
      .single();

    return user?.tokens_remaining >= requiredTokens;
  }
}