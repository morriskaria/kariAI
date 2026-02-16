import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardOverview(userId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
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
    const avgSatisfaction =
      ratedConversations.length > 0
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

  async getBotAnalytics(userId: string, botId: string) {
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
    const uniqueUsers = new Set(conversations.map((conv) => conv.userIdentifier)).size;
    const ratedConversations = conversations.filter((conv) => conv.satisfaction !== null);
    const avgSatisfaction =
      ratedConversations.length > 0
        ? ratedConversations.reduce((sum, conv) => sum + (conv.satisfaction || 0), 0) / ratedConversations.length
        : 0;

    // Calculate daily metrics for the last 7 days
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

  async getConversationAnalytics(userId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
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

    const avgMessagesPerConversation =
      conversations.length > 0
        ? Math.round((conversations.reduce((sum, conv) => sum + conv.messages.length, 0) / conversations.length) * 100) / 100
        : 0;

    return {
      totalConversations: conversations.length,
      satisfactionDistribution,
      avgMessagesPerConversation,
      ratedConversations: conversations.filter((conv) => conv.satisfaction !== null).length,
    };
  }

  private calculateDailyMetrics(conversations: any[]) {
    const dailyData: Record<string, { conversations: number; messages: number }> = {};

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
}
