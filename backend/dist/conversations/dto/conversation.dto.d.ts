export declare class SendMessageDto {
    content: string;
    userIdentifier?: string;
}
export declare class RateConversationDto {
    satisfaction: number;
}
export declare class MessageResponseDto {
    id: string;
    conversationId: string;
    role: string;
    content: string;
    timestamp: Date;
}
export declare class ConversationResponseDto {
    id: string;
    botId: string;
    userIdentifier: string;
    messages: MessageResponseDto[];
    satisfaction?: number;
    createdAt: Date;
    updatedAt: Date;
}
