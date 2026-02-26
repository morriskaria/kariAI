import { ConfigService } from '@nestjs/config';
interface AIResponse {
    content: string;
    model: string;
    tokensUsed: number;
}
export declare class AiService {
    private configService;
    constructor(configService: ConfigService);
    generateResponse(botConfig: {
        model: string;
        systemPrompt: string;
        temperature: number;
    }, userMessage: string, conversationHistory?: Array<{
        role: string;
        content: string;
    }>): Promise<AIResponse>;
    private callOpenAI;
    private callClaude;
    private callGemini;
    getAvailableModels(): {
        openai: {
            id: string;
            name: string;
            costPer1kTokens: number;
        }[];
        anthropic: {
            id: string;
            name: string;
            costPer1kTokens: number;
        }[];
        google: {
            id: string;
            name: string;
            costPer1kTokens: number;
        }[];
    };
    estimateCost(model: string, tokensUsed: number): number;
}
export {};
