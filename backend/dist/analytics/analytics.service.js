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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardOverview(userId) {
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        const bots = await this.prisma.bot.findMany({
            where: { organizationId: organization.id, deletedAt: null },
        });
        const conversations = await this.prisma.conversation.findMany({
            where: {
                bot: {
                    organizationId: organization.id,
                },
            },
            include: { messages: true },
        });
        const totalBots = bots.length;
        const totalConversations = conversations.length;
        const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
        const ratedConversations = conversations.filter((conv) => conv.satisfaction !== null);
        const avgSatisfaction = ratedConversations.length > 0
            ? ratedConversations.reduce((sum, conv) => sum + (conv.satisfaction || 0), 0) / ratedConversations.length
            : 0;
        return {
            totalBots,
            totalConversations,
            totalMessages,
            avgSatisfaction: Math.round(avgSatisfaction * 100) / 100,
            ratedConversations: ratedConversations.length,
        };
    }
    async getBotAnalytics(userId, botId) {
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
        const uniqueUsers = new Set(conversations.map((conv) => conv.userIdentifier)).size;
        const ratedConversations = conversations.filter((conv) => conv.satisfaction !== null);
        const avgSatisfaction = ratedConversations.length > 0
            ? ratedConversations.reduce((sum, conv) => sum + (conv.satisfaction || 0), 0) / ratedConversations.length
            : 0;
        const dailyMetrics = this.calculateDailyMetrics(conversations);
        return {
            bot: {
                id: bot.id,
                name: bot.name,
                status: bot.status,
            },
            metrics: {
                totalConversations,
                totalMessages,
                uniqueUsers,
                avgSatisfaction: Math.round(avgSatisfaction * 100) / 100,
                ratedConversations: ratedConversations.length,
            },
            dailyMetrics,
        };
    }
    async getConversationAnalytics(userId) {
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        const conversations = await this.prisma.conversation.findMany({
            where: {
                bot: {
                    organizationId: organization.id,
                },
            },
            include: { messages: true },
        });
        const satisfactionDistribution = {
            '5': 0,
            '4': 0,
            '3': 0,
            '2': 0,
            '1': 0,
        };
        conversations.forEach((conv) => {
            if (conv.satisfaction) {
                satisfactionDistribution[conv.satisfaction.toString()]++;
            }
        });
        const avgMessagesPerConversation = conversations.length > 0
            ? Math.round((conversations.reduce((sum, conv) => sum + conv.messages.length, 0) / conversations.length) * 100) / 100
            : 0;
        return {
            totalConversations: conversations.length,
            satisfactionDistribution,
            avgMessagesPerConversation,
            ratedConversations: conversations.filter((conv) => conv.satisfaction !== null).length,
        };
    }
    calculateDailyMetrics(conversations) {
        const dailyData = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyData[dateStr] = { conversations: 0, messages: 0 };
        }
        conversations.forEach((conv) => {
            const dateStr = new Date(conv.createdAt).toISOString().split('T')[0];
            if (dailyData[dateStr]) {
                dailyData[dateStr].conversations++;
                dailyData[dateStr].messages += conv.messages.length;
            }
        });
        return Object.entries(dailyData).map(([date, data]) => ({
            date,
            ...data,
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map