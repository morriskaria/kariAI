import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotDto, UpdateBotDto, BotResponseDto } from './dto/bot.dto';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  async createBot(userId: string, createBotDto: CreateBotDto): Promise<BotResponseDto> {
    // Get user's organization
    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const bot = await this.prisma.bot.create({
      data: {
        ...createBotDto,
        organizationId: organization.id,
        model: createBotDto.model || 'gpt-4-turbo',
        temperature: createBotDto.temperature || 0.7,
      },
    });

    return this.formatBotResponse(bot);
  }

  async getBots(userId: string): Promise<BotResponseDto[]> {
    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const bots = await this.prisma.bot.findMany({
      where: { organizationId: organization.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return bots.map((bot) => this.formatBotResponse(bot));
  }

  async getBot(userId: string, botId: string): Promise<BotResponseDto> {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot || bot.deletedAt) {
      throw new NotFoundException('Bot not found');
    }

    // Check authorization
    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization || bot.organizationId !== organization.id) {
      throw new ForbiddenException('You do not have access to this bot');
    }

    return this.formatBotResponse(bot);
  }

  async updateBot(userId: string, botId: string, updateBotDto: UpdateBotDto): Promise<BotResponseDto> {
    const bot = await this.getBot(userId, botId);

    const updateData: any = { ...updateBotDto };
    const updatedBot = await this.prisma.bot.update({
      where: { id: botId },
      data: updateData,
    });

    return this.formatBotResponse(updatedBot);
  }

  async deleteBot(userId: string, botId: string): Promise<void> {
    const bot = await this.getBot(userId, botId);

    await this.prisma.bot.update({
      where: { id: botId },
      data: { deletedAt: new Date() },
    });
  }

  async getEmbedCode(userId: string, botId: string): Promise<string> {
    const bot = await this.getBot(userId, botId);

    const embedCode = `
<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://kariaai.com/embed.js';
    script.setAttribute('data-bot-id', '${botId}');
    script.setAttribute('data-position', 'bottom-right');
    document.head.appendChild(script);
  })();
</script>
    `.trim();

    return embedCode;
  }

  private formatBotResponse(bot: any): BotResponseDto {
    return {
      id: bot.id,
      organizationId: bot.organizationId,
      name: bot.name,
      description: bot.description,
      systemPrompt: bot.systemPrompt,
      model: bot.model,
      temperature: bot.temperature,
      status: bot.status,
      tone: bot.tone,
      createdAt: bot.createdAt,
      updatedAt: bot.updatedAt,
    };
  }
}
