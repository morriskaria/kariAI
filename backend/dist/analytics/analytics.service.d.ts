import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardOverview(userId: string): Promise<{
        totalBots: number;
        totalConversations: number;
        totalMessages: number;
        avgSatisfaction: number;
        ratedConversations: number;
    }>;
    getBotAnalytics(userId: string, botId: string): Promise<{
        bot: {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.BotStatus;
        };
        metrics: {
            totalConversations: number;
            totalMessages: number;
            uniqueUsers: number;
            avgSatisfaction: number;
            ratedConversations: number;
        };
        dailyMetrics: {
            conversations: number;
            messages: number;
            date: string;
        }[];
    }>;
    getConversationAnalytics(userId: string): Promise<{
        totalConversations: number;
        satisfactionDistribution: {
            '5': number;
            '4': number;
            '3': number;
            '2': number;
            '1': number;
        };
        avgMessagesPerConversation: number;
        ratedConversations: number;
    }>;
    private calculateDailyMetrics;
}
