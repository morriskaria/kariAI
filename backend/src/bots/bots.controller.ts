import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import { CreateBotDto, UpdateBotDto, BotResponseDto } from './dto/bot.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('bots')
@UseGuards(JwtAuthGuard)
export class BotsController {
  constructor(private botsService: BotsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBot(@Request() req, @Body() createBotDto: CreateBotDto): Promise<BotResponseDto> {
    return this.botsService.createBot(req.user.sub, createBotDto);
  }

  @Get()
  async getBots(@Request() req): Promise<BotResponseDto[]> {
    return this.botsService.getBots(req.user.sub);
  }

  @Get(':id')
  async getBot(@Request() req, @Param('id') botId: string): Promise<BotResponseDto> {
    return this.botsService.getBot(req.user.sub, botId);
  }

  @Patch(':id')
  async updateBot(
    @Request() req,
    @Param('id') botId: string,
    @Body() updateBotDto: UpdateBotDto,
  ): Promise<BotResponseDto> {
    return this.botsService.updateBot(req.user.sub, botId, updateBotDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBot(@Request() req, @Param('id') botId: string): Promise<void> {
    return this.botsService.deleteBot(req.user.sub, botId);
  }

  @Get(':id/embed-code')
  async getEmbedCode(@Request() req, @Param('id') botId: string): Promise<{ embedCode: string }> {
    const embedCode = await this.botsService.getEmbedCode(req.user.sub, botId);
    return { embedCode };
  }
}
