import { PrismaService } from '../prisma/prisma.service';
import { CreateBotDto, UpdateBotDto, BotResponseDto } from './dto/bot.dto';
export declare class BotsService {
    private prisma;
    constructor(prisma: PrismaService);
    createBot(userId: string, createBotDto: CreateBotDto): Promise<BotResponseDto>;
    getBots(userId: string): Promise<BotResponseDto[]>;
    getBot(userId: string, botId: string): Promise<BotResponseDto>;
    updateBot(userId: string, botId: string, updateBotDto: UpdateBotDto): Promise<BotResponseDto>;
    deleteBot(userId: string, botId: string): Promise<void>;
    getEmbedCode(userId: string, botId: string): Promise<string>;
    private formatBotResponse;
}
