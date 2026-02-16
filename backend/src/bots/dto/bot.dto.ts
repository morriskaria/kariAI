import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateBotDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  systemPrompt: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;

  @IsOptional()
  @IsString()
  tone?: string;
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
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class BotResponseDto {
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
