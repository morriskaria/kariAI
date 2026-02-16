import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  userIdentifier?: string;
}

export class RateConversationDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  satisfaction: number;
}

export class MessageResponseDto {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  timestamp: Date;
}

export class ConversationResponseDto {
  id: string;
  botId: string;
  userIdentifier: string;
  messages: MessageResponseDto[];
  satisfaction?: number;
  createdAt: Date;
  updatedAt: Date;
}
