import { IsString, IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';

export enum BotModel {
  GPT4_TURBO = 'gpt-4-turbo',
  GPT4 = 'gpt-4',
  GPT35_TURBO = 'gpt-3.5-turbo',
  CLAUDE_3_OPUS = 'claude-3-opus',
  CLAUDE_3_SONNET = 'claude-3-sonnet',
  CLAUDE_3_HAIKU = 'claude-3-haiku',
  GEMINI_2_0 = 'gemini-2.0-pro',
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
}

export enum BotTone {
  PROFESSIONAL = 'professional',
  FRIENDLY = 'friendly',
  CASUAL = 'casual',
  FORMAL = 'formal',
  TECHNICAL = 'technical',
  HUMOROUS = 'humorous',
}

export enum BotStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateBotDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  systemPrompt: string;

  @IsOptional()
  @IsEnum(BotModel)
  model?: BotModel = BotModel.GPT4_TURBO;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number = 0.7;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(4096)
  maxTokens?: number = 2048;

  @IsOptional()
  @IsEnum(BotTone)
  tone?: BotTone = BotTone.PROFESSIONAL;

  @IsOptional()
  @IsString()
  welcomeMessage?: string;

  @IsOptional()
  @IsString()
  placeholderMessage?: string;
}

export class UpdateBotDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsEnum(BotModel)
  model?: BotModel;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(4096)
  maxTokens?: number;

  @IsOptional()
  @IsEnum(BotTone)
  tone?: BotTone;

  @IsOptional()
  @IsString()
  welcomeMessage?: string;

  @IsOptional()
  @IsString()
  placeholderMessage?: string;

  @IsOptional()
  @IsEnum(BotStatus)
  status?: BotStatus;
}

export class BotResponseDto {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tone: string;
  status: string;
  organizationId: string;
  embedCode?: string;
  conversationCount?: number;
  messageCount?: number;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class BotListResponseDto {
  id: string;
  name: string;
  description?: string;
  model: string;
  status: string;
  conversationCount: number;
  messageCount: number;
  lastActivity?: Date;
  createdAt: Date;
}

export class BotEmbedCodeDto {
  botId: string;
  embedCode: string;
  embedUrl: string;
  scriptUrl: string;
}

export class BotStatsDto {
  botId: string;
  conversationCount: number;
  messageCount: number;
  avgResponseTime: number;
  avgSatisfaction: number;
  uniqueUsers: number;
  lastActivity?: Date;
}
