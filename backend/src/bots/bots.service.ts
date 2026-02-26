import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotDto, UpdateBotDto, BotResponseDto, BotListResponseDto, BotEmbedCodeDto } from './dto/bot.dto';
import * as crypto from 'crypto';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new bot
   */
  async createBot(userId: string, createBotDto: CreateBotDto): Promise<BotResponseDto> {
    // Get user's organization
    const organization = await this.prisma.organization.findFirst({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    // Create bot
    const bot = await this.prisma.bot.create({
      data: {
        name: createBotDto.name,
        description: createBotDto.description,
        systemPrompt: createBotDto.systemPrompt,
        model: createBotDto.model || 'gpt-4-turbo',
        temperature: createBotDto.temperature || 0.7,
        tone: createBotDto.tone || 'professional',
        organizationId: organization.id,
        status: 'DRAFT',
      },
    });

    return this.formatBotResponse(bot);
  }

  /**
   * Get all bots for user's organization
   */
  async getBots(userId: string): Promise<BotListResponseDto[]> {
    // Get user's organization
    const organization = await this.prisma.organization.findFirst({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    // Get all bots with conversation counts
    const bots = await this.prisma.bot.findMany({
      where: { organizationId: organization.id, deletedAt: null },
      include: {
        conversations: {
          where: { deletedAt: null },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bots.map((bot) => ({
      id: bot.id,
      name: bot.name,
      description: bot.description,
      model: bot.model,
      status: bot.status,
      conversationCount: bot.conversations.length,
      messageCount: 0, // TODO: Count messages
      lastActivity: bot.updatedAt,
      createdAt: bot.createdAt,
    }));
  }

  /**
   * Get a specific bot
   */
  async getBot(userId: string, botId: string): Promise<BotResponseDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
      include: {
        conversations: {
          where: { deletedAt: null },
        },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Verify ownership
    await this.verifyBotOwnership(userId, bot.organizationId);

    return this.formatBotResponse(bot, bot.conversations.length);
  }

  /**
   * Update a bot
   */
  async updateBot(userId: string, botId: string, updateBotDto: UpdateBotDto): Promise<BotResponseDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Verify ownership
    await this.verifyBotOwnership(userId, bot.organizationId);

    // Update bot
    const updatedBot = await this.prisma.bot.update({
      where: { id: botId },
      data: {
        ...(updateBotDto.name && { name: updateBotDto.name }),
        ...(updateBotDto.description && { description: updateBotDto.description }),
        ...(updateBotDto.systemPrompt && { systemPrompt: updateBotDto.systemPrompt }),
        ...(updateBotDto.model && { model: updateBotDto.model }),
        ...(updateBotDto.temperature !== undefined && { temperature: updateBotDto.temperature }),
        ...(updateBotDto.tone && { tone: updateBotDto.tone }),
        ...(updateBotDto.status && { status: updateBotDto.status }),
      },
    });

    return this.formatBotResponse(updatedBot);
  }

  /**
   * Delete a bot
   */
  async deleteBot(userId: string, botId: string): Promise<{ message: string }> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Verify ownership
    await this.verifyBotOwnership(userId, bot.organizationId);

    // Soft delete bot
    await this.prisma.bot.update({
      where: { id: botId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Bot deleted successfully' };
  }

  /**
   * Publish a bot (make it active)
   */
  async publishBot(userId: string, botId: string): Promise<BotResponseDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Verify ownership
    await this.verifyBotOwnership(userId, bot.organizationId);

    // Validate bot has required fields
    if (!bot.name || !bot.systemPrompt) {
      throw new BadRequestException('Bot must have name and system prompt to publish');
    }

    // Update status to ACTIVE
    const updatedBot = await this.prisma.bot.update({
      where: { id: botId },
      data: { status: 'ACTIVE' },
    });

    return this.formatBotResponse(updatedBot);
  }

  /**
   * Pause a bot
   */
  async pauseBot(userId: string, botId: string): Promise<BotResponseDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Verify ownership
    await this.verifyBotOwnership(userId, bot.organizationId);

    // Update status to PAUSED
    const updatedBot = await this.prisma.bot.update({
      where: { id: botId },
      data: { status: 'PAUSED' },
    });

    return this.formatBotResponse(updatedBot);
  }

  /**
   * Generate embed code for a bot
   */
  async generateEmbedCode(userId: string, botId: string): Promise<BotEmbedCodeDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Verify ownership
    await this.verifyBotOwnership(userId, bot.organizationId);

    // Generate embed code
    const embedCode = this.generateEmbedScript(botId);
    const embedUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/embed/${botId}`;
    const scriptUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/embed.js`;

    // Store embed code in database
    await this.prisma.bot.update({
      where: { id: botId },
      data: { embedCode },
    });

    return {
      botId,
      embedCode,
      embedUrl,
      scriptUrl,
    };
  }

  /**
   * Get embed code for a bot
   */
  async getEmbedCode(botId: string): Promise<BotEmbedCodeDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    if (!bot.embedCode) {
      const embedCode = this.generateEmbedScript(botId);
      const embedUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/embed/${botId}`;
      const scriptUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/embed.js`;

      return {
        botId,
        embedCode,
        embedUrl,
        scriptUrl,
      };
    }

    const embedUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/embed/${botId}`;
    const scriptUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/embed.js`;

    return {
      botId,
      embedCode: bot.embedCode,
      embedUrl,
      scriptUrl,
    };
  }

  /**
   * Get bot statistics
   */
  async getBotStats(userId: string, botId: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
      include: {
        conversations: {
          where: { deletedAt: null },
          include: {
            messages: true,
          },
        },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Verify ownership
    await this.verifyBotOwnership(userId, bot.organizationId);

    const conversationCount = bot.conversations.length;
    const messageCount = bot.conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    const avgSatisfaction = this.calculateAverageSatisfaction(bot.conversations);

    return {
      botId: bot.id,
      conversationCount,
      messageCount,
      avgResponseTime: 1.2, // TODO: Calculate from actual data
      avgSatisfaction,
      uniqueUsers: conversationCount,
      lastActivity: bot.updatedAt,
    };
  }

  /**
   * Helper: Format bot response
   */
  private formatBotResponse(bot: any, conversationCount: number = 0): BotResponseDto {
    return {
      id: bot.id,
      name: bot.name,
      description: bot.description,
      systemPrompt: bot.systemPrompt,
      model: bot.model,
      temperature: bot.temperature,
      tone: bot.tone,
      status: bot.status,
      organizationId: bot.organizationId,
      embedCode: bot.embedCode,
      conversationCount,
      createdAt: bot.createdAt,
      updatedAt: bot.updatedAt,
    };
  }

  /**
   * Helper: Verify bot ownership
   */
  private async verifyBotOwnership(userId: string, organizationId: string): Promise<void> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id: organizationId,
        ownerId: userId,
      },
    });

    if (!organization) {
      throw new ForbiddenException('You do not have permission to access this bot');
    }
  }

  /**
   * Helper: Generate embed script
   */
  private generateEmbedScript(botId: string): string {
    return `<script>
  (function() {
    const botId = '${botId}';
    const scriptUrl = '${process.env.FRONTEND_URL || 'http://localhost:3000'}/embed.js';
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = function() {
      if (window.KariaAI) {
        window.KariaAI.init({ botId: botId });
      }
    };
    document.head.appendChild(script);
  })();
</script>`;
  }

  /**
   * Helper: Calculate average satisfaction
   */
  private calculateAverageSatisfaction(conversations: any[]): number {
    const satisfactions = conversations
      .map((c) => c.satisfaction)
      .filter((s) => s !== null && s !== undefined);

    if (satisfactions.length === 0) return 0;

    const sum = satisfactions.reduce((a, b) => a + b, 0);
    return Math.round((sum / satisfactions.length) * 10) / 10;
  }
}
