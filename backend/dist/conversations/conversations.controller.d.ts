import { ConversationsService } from './conversations.service';
import { SendMessageDto, RateConversationDto } from './dto/conversation.dto';
export declare class ConversationsController {
    private conversationsService;
    constructor(conversationsService: ConversationsService);
    sendMessage(req: any, botId: string, conversationId: string, sendMessageDto: SendMessageDto): Promise<{
        conversationId: string;
        message: import("./dto/conversation.dto").MessageResponseDto;
    }>;
    getConversations(req: any, botId: string, limit?: number, offset?: number): Promise<import("./dto/conversation.dto").ConversationResponseDto[]>;
    getStats(req: any, botId: string): Promise<{
        totalConversations: number;
        totalMessages: number;
        avgSatisfaction: number;
        ratedConversations: number;
    }>;
    getConversation(req: any, conversationId: string): Promise<import("./dto/conversation.dto").ConversationResponseDto>;
    rateConversation(req: any, conversationId: string, rateDto: RateConversationDto): Promise<{
        id: string;
        satisfaction: number | null;
        message: string;
    }>;
}
