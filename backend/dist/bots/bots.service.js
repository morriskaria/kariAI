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
exports.BotsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BotsService = class BotsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBot(userId, createBotDto) {
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
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
    async getBots(userId) {
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        const bots = await this.prisma.bot.findMany({
            where: { organizationId: organization.id, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
        return bots.map((bot) => this.formatBotResponse(bot));
    }
    async getBot(userId, botId) {
        const bot = await this.prisma.bot.findUnique({
            where: { id: botId },
        });
        if (!bot || bot.deletedAt) {
            throw new common_1.NotFoundException('Bot not found');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization || bot.organizationId !== organization.id) {
            throw new common_1.ForbiddenException('You do not have access to this bot');
        }
        return this.formatBotResponse(bot);
    }
    async updateBot(userId, botId, updateBotDto) {
        const bot = await this.getBot(userId, botId);
        const updateData = { ...updateBotDto };
        const updatedBot = await this.prisma.bot.update({
            where: { id: botId },
            data: updateData,
        });
        return this.formatBotResponse(updatedBot);
    }
    async deleteBot(userId, botId) {
        const bot = await this.getBot(userId, botId);
        await this.prisma.bot.update({
            where: { id: botId },
            data: { deletedAt: new Date() },
        });
    }
    async getEmbedCode(userId, botId) {
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
    formatBotResponse(bot) {
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
};
exports.BotsService = BotsService;
exports.BotsService = BotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BotsService);
//# sourceMappingURL=bots.service.js.map