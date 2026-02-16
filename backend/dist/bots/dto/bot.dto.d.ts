export declare class CreateBotDto {
    name: string;
    description?: string;
    systemPrompt: string;
    model?: string;
    temperature?: number;
    tone?: string;
}
export declare class UpdateBotDto {
    name?: string;
    description?: string;
    systemPrompt?: string;
    model?: string;
    temperature?: number;
    tone?: string;
    status?: string;
}
export declare class BotResponseDto {
    id: string;
    organizationId: string;
    name: string;
    description?: string;
    systemPrompt: string;
    model: string;
    temperature: number;
    status: string;
    tone?: string;
    createdAt: Date;
    updatedAt: Date;
}
