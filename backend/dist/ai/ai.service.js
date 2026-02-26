"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AiService = class AiService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async generateResponse(botConfig, userMessage, conversationHistory = []) {
        const model = botConfig.model || 'gpt-4-turbo';
        if (model.startsWith('gpt')) {
            return this.callOpenAI(botConfig, userMessage, conversationHistory);
        }
        else if (model.startsWith('claude')) {
            return this.callClaude(botConfig, userMessage, conversationHistory);
        }
        else if (model.startsWith('gemini')) {
            return this.callGemini(botConfig, userMessage, conversationHistory);
        }
        else {
            throw new common_1.BadRequestException(`Unsupported model: ${model}`);
        }
    }
    async callOpenAI(botConfig, userMessage, conversationHistory) {
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            throw new common_1.BadRequestException('OpenAI API key not configured');
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
                throw new common_1.BadRequestException(`OpenAI API error: ${error.error.message}`);
            }
            const data = await response.json();
            const content = data.choices[0].message.content;
            const tokensUsed = data.usage.total_tokens;
            return {
                content,
                model: botConfig.model,
                tokensUsed,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to call OpenAI: ${error.message}`);
        }
    }
    async callClaude(botConfig, userMessage, conversationHistory) {
        const apiKey = this.configService.get('ANTHROPIC_API_KEY');
        if (!apiKey) {
            throw new common_1.BadRequestException('Anthropic API key not configured');
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
                throw new common_1.BadRequestException(`Anthropic API error: ${error.error.message}`);
            }
            const data = await response.json();
            const content = data.content[0].text;
            const tokensUsed = data.usage.input_tokens + data.usage.output_tokens;
            return {
                content,
                model: botConfig.model,
                tokensUsed,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to call Claude: ${error.message}`);
        }
    }
    async callGemini(botConfig, userMessage, conversationHistory) {
        const apiKey = this.configService.get('GOOGLE_API_KEY');
        if (!apiKey) {
            throw new common_1.BadRequestException('Google API key not configured');
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
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${botConfig.model}:generateContent?key=${apiKey}`, {
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
            });
            if (!response.ok) {
                const error = await response.json();
                throw new common_1.BadRequestException(`Gemini API error: ${error.error.message}`);
            }
            const data = await response.json();
            const content = data.candidates[0].content.parts[0].text;
            const tokensUsed = data.usageMetadata.totalTokenCount;
            return {
                content,
                model: botConfig.model,
                tokensUsed,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to call Gemini: ${error.message}`);
        }
    }
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
    estimateCost(model, tokensUsed) {
        const allModels = Object.values(this.getAvailableModels()).flat();
        const modelConfig = allModels.find((m) => m.id === model);
        if (!modelConfig) {
            return 0;
        }
        return (tokensUsed / 1000) * modelConfig.costPer1kTokens;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map