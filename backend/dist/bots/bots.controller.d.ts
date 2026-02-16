import { BotsService } from './bots.service';
import { CreateBotDto, UpdateBotDto, BotResponseDto } from './dto/bot.dto';
export declare class BotsController {
    private botsService;
    constructor(botsService: BotsService);
    createBot(req: any, createBotDto: CreateBotDto): Promise<BotResponseDto>;
    getBots(req: any): Promise<BotResponseDto[]>;
    getBot(req: any, botId: string): Promise<BotResponseDto>;
    updateBot(req: any, botId: string, updateBotDto: UpdateBotDto): Promise<BotResponseDto>;
    deleteBot(req: any, botId: string): Promise<void>;
    getEmbedCode(req: any, botId: string): Promise<{
        embedCode: string;
    }>;
}
