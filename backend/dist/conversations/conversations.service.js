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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConversationsService = class ConversationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMessage(userId, botId, sendMessageDto) {
        const bot = await this.prisma.bot.findUnique({
            where: { id: botId },
        });
        if (!bot) {
            throw new common_1.NotFoundException('Bot not found');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization || bot.organizationId !== organization.id) {
            throw new common_1.ForbiddenException('You do not have access to this bot');
        }
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
        await this.prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: 'USER',
                content: sendMessageDto.content,
            },
        });
        const mockResponse = `Thank you for your message: "${sendMessageDto.content}". This is a mock response. In production, this would call your configured AI model.`;
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
    async getConversations(userId, botId, limit = 50, offset = 0) {
        const bot = await this.prisma.bot.findUnique({
            where: { id: botId },
        });
        if (!bot) {
            throw new common_1.NotFoundException('Bot not found');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization || bot.organizationId !== organization.id) {
            throw new common_1.ForbiddenException('You do not have access to this bot');
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
    async getConversation(userId, conversationId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { messages: true, bot: true },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization || conversation.bot.organizationId !== organization.id) {
            throw new common_1.ForbiddenException('You do not have access to this conversation');
        }
        return this.formatConversationResponse(conversation);
    }
    async rateConversation(userId, conversationId, rateDto) {
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
    async getConversationStats(userId, botId) {
        const bot = await this.prisma.bot.findUnique({
            where: { id: botId },
        });
        if (!bot) {
            throw new common_1.NotFoundException('Bot not found');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization || bot.organizationId !== organization.id) {
            throw new common_1.ForbiddenException('You do not have access to this bot');
        }
        const conversations = await this.prisma.conversation.findMany({
            where: { botId },
            include: { messages: true },
        });
        const totalConversations = conversations.length;
        const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
        const ratedConversations = conversations.filter((conv) => conv.satisfaction !== null);
        const avgSatisfaction = ratedConversations.length > 0
            ? ratedConversations.reduce((sum, conv) => sum + (conv.satisfaction || 0), 0) / ratedConversations.length
            : 0;
        return {
            totalConversations,
            totalMessages,
            avgSatisfaction: Math.round(avgSatisfaction * 100) / 100,
            ratedConversations: ratedConversations.length,
        };
    }
    formatMessageResponse(message) {
        return {
            id: message.id,
            conversationId: message.conversationId,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp,
        };
    }
    formatConversationResponse(conversation) {
        return {
            id: conversation.id,
            botId: conversation.botId,
            userIdentifier: conversation.userIdentifier,
            messages: conversation.messages.map((msg) => this.formatMessageResponse(msg)),
            satisfaction: conversation.satisfaction || undefined,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        };
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map