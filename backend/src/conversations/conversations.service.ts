import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, RateConversationDto, ConversationResponseDto, MessageResponseDto } from './dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(userId: string, botId: string, sendMessageDto: SendMessageDto) {
    // Verify bot ownership
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization || bot.organizationId !== organization.id) {
      throw new ForbiddenException('You do not have access to this bot');
    }

    // Create or get conversation
    const userIdentifier = sendMessageDto.userIdentifier || 'anonymous';
    
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        botId,
        userIdentifier,
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          botId,
          userIdentifier,
        },
      });
    }

    // Save user message
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: sendMessageDto.content,
      },
    });

    // TODO: Call AI API (OpenAI, Claude, etc.) to generate response
    // For now, return a mock response
    const mockResponse = `Thank you for your message: "${sendMessageDto.content}". This is a mock response. In production, this would call your configured AI model.`;

    // Save assistant response
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: mockResponse,
      },
    });

    return {
      conversationId: conversation.id,
      message: this.formatMessageResponse(assistantMessage),
    };
  }

  async getConversations(userId: string, botId: string, limit = 50, offset = 0) {
    // Verify bot ownership
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization || bot.organizationId !== organization.id) {
      throw new ForbiddenException('You do not have access to this bot');
    }

    const conversations = await this.prisma.conversation.findMany({
      where: { botId },
      include: { messages: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return conversations.map((conv) => this.formatConversationResponse(conv));
  }

  async getConversation(userId: string, conversationId: string): Promise<ConversationResponseDto> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: true, bot: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify access
    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization || conversation.bot.organizationId !== organization.id) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    return this.formatConversationResponse(conversation);
  }

  async rateConversation(userId: string, conversationId: string, rateDto: RateConversationDto) {
    const conversation = await this.getConversation(userId, conversationId);

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { satisfaction: rateDto.satisfaction },
    });

    return {
      id: updated.id,
      satisfaction: updated.satisfaction,
      message: 'Thank you for your feedback!',
    };
  }

  async getConversationStats(userId: string, botId: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization || bot.organizationId !== organization.id) {
      throw new ForbiddenException('You do not have access to this bot');
    }

    const conversations = await this.prisma.conversation.findMany({
      where: { botId },
      include: { messages: true },
    });

    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    const ratedConversations = conversations.filter((conv) => conv.satisfaction !== null);
    const avgSatisfaction =
      ratedConversations.length > 0
        ? ratedConversations.reduce((sum, conv) => sum + (conv.satisfaction || 0), 0) / ratedConversations.length
        : 0;

    return {
      totalConversations,
      totalMessages,
      avgSatisfaction: Math.round(avgSatisfaction * 100) / 100,
      ratedConversations: ratedConversations.length,
    };
  }

  private formatMessageResponse(message: any): MessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
    };
  }

  private formatConversationResponse(conversation: any): ConversationResponseDto {
    return {
      id: conversation.id,
      botId: conversation.botId,
      userIdentifier: conversation.userIdentifier,
      messages: conversation.messages.map((msg: any) => this.formatMessageResponse(msg)),
      satisfaction: conversation.satisfaction || undefined,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
}
