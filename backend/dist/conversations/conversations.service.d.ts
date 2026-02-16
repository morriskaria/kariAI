import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, RateConversationDto, ConversationResponseDto, MessageResponseDto } from './dto/conversation.dto';
export declare class ConversationsService {
    private prisma;
    constructor(prisma: PrismaService);
    sendMessage(userId: string, botId: string, sendMessageDto: SendMessageDto): Promise<{
        conversationId: string;
        message: MessageResponseDto;
    }>;
    getConversations(userId: string, botId: string, limit?: number, offset?: number): Promise<ConversationResponseDto[]>;
    getConversation(userId: string, conversationId: string): Promise<ConversationResponseDto>;
    rateConversation(userId: string, conversationId: string, rateDto: RateConversationDto): Promise<{
        id: string;
        satisfaction: number | null;
        message: string;
    }>;
    getConversationStats(userId: string, botId: string): Promise<{
        totalConversations: number;
        totalMessages: number;
        avgSatisfaction: number;
        ratedConversations: number;
    }>;
    private formatMessageResponse;
    private formatConversationResponse;
}
