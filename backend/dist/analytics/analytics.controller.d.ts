import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardOverview(req: any): Promise<{
        totalBots: number;
        totalConversations: number;
        totalMessages: number;
        avgSatisfaction: number;
        ratedConversations: number;
    }>;
    getBotAnalytics(req: any, botId: string): Promise<{
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
    getConversationAnalytics(req: any): Promise<{
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
}
