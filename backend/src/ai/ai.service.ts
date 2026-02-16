import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface AIResponse {
  content: string;
  model: string;
  tokensUsed: number;
}

@Injectable()
export class AiService {
  constructor(private configService: ConfigService) {}

  /**
   * Generate a response using the configured AI model
   */
  async generateResponse(
    botConfig: {
      model: string;
      systemPrompt: string;
      temperature: number;
    },
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
  ): Promise<AIResponse> {
    const model = botConfig.model || 'gpt-4-turbo';

    // Route to appropriate AI provider
    if (model.startsWith('gpt')) {
      return this.callOpenAI(botConfig, userMessage, conversationHistory);
    } else if (model.startsWith('claude')) {
      return this.callClaude(botConfig, userMessage, conversationHistory);
    } else if (model.startsWith('gemini')) {
      return this.callGemini(botConfig, userMessage, conversationHistory);
    } else {
      throw new BadRequestException(`Unsupported model: ${model}`);
    }
  }

  /**
   * Call OpenAI API (GPT-4, GPT-3.5, etc.)
   */
  private async callOpenAI(
    botConfig: any,
    userMessage: string,
    conversationHistory: any[],
  ): Promise<AIResponse> {
    const apiKey = this.configService.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    try {
      const messages = [
        { role: 'system', content: botConfig.systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: botConfig.model,
          messages,
          temperature: botConfig.temperature,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new BadRequestException(`OpenAI API error: ${error.error.message}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const tokensUsed = data.usage.total_tokens;

      return {
        content,
        model: botConfig.model,
        tokensUsed,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to call OpenAI: ${error.message}`);
    }
  }

  /**
   * Call Anthropic Claude API
   */
  private async callClaude(
    botConfig: any,
    userMessage: string,
    conversationHistory: any[],
  ): Promise<AIResponse> {
    const apiKey = this.configService.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('Anthropic API key not configured');
    }

    try {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: botConfig.model,
          max_tokens: 2000,
          system: botConfig.systemPrompt,
          messages,
          temperature: botConfig.temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new BadRequestException(`Anthropic API error: ${error.error.message}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      const tokensUsed = data.usage.input_tokens + data.usage.output_tokens;

      return {
        content,
        model: botConfig.model,
        tokensUsed,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to call Claude: ${error.message}`);
    }
  }

  /**
   * Call Google Gemini API
   */
  private async callGemini(
    botConfig: any,
    userMessage: string,
    conversationHistory: any[],
  ): Promise<AIResponse> {
    const apiKey = this.configService.get('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('Google API key not configured');
    }

    try {
      const contents = [
        ...conversationHistory.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${botConfig.model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: botConfig.systemPrompt }],
            },
            generationConfig: {
              temperature: botConfig.temperature,
              maxOutputTokens: 2000,
            },
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new BadRequestException(`Gemini API error: ${error.error.message}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      const tokensUsed = data.usageMetadata.totalTokenCount;

      return {
        content,
        model: botConfig.model,
        tokensUsed,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to call Gemini: ${error.message}`);
    }
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return {
      openai: [
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', costPer1kTokens: 0.01 },
        { id: 'gpt-4', name: 'GPT-4', costPer1kTokens: 0.03 },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', costPer1kTokens: 0.0005 },
      ],
      anthropic: [
        { id: 'claude-3-opus', name: 'Claude 3 Opus', costPer1kTokens: 0.015 },
        { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', costPer1kTokens: 0.003 },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', costPer1kTokens: 0.00025 },
      ],
      google: [
        { id: 'gemini-pro', name: 'Gemini Pro', costPer1kTokens: 0.0005 },
        { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', costPer1kTokens: 0.001 },
      ],
    };
  }

  /**
   * Estimate cost for message
   */
  estimateCost(model: string, tokensUsed: number): number {
    const allModels = Object.values(this.getAvailableModels()).flat();
    const modelConfig = allModels.find((m) => m.id === model);

    if (!modelConfig) {
      return 0;
    }

    return (tokensUsed / 1000) * modelConfig.costPer1kTokens;
  }
}
