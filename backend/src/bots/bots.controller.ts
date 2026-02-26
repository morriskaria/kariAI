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

  /**
   * Create a new bot
   * POST /bots
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBot(@Request() req: any, @Body() createBotDto: CreateBotDto) {
    return this.botsService.createBot(req.user.id, createBotDto);
  }

  /**
   * Get all bots for the user's organization
   * GET /bots
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getBots(@Request() req: any) {
    return this.botsService.getBots(req.user.id);
  }

  /**
   * Get a specific bot
   * GET /bots/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBot(@Request() req: any, @Param('id') botId: string) {
    return this.botsService.getBot(req.user.id, botId);
  }

  /**
   * Update a bot
   * PATCH /bots/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateBot(
    @Request() req: any,
    @Param('id') botId: string,
    @Body() updateBotDto: UpdateBotDto,
  ) {
    return this.botsService.updateBot(req.user.id, botId, updateBotDto);
  }

  /**
   * Delete a bot
   * DELETE /bots/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBot(@Request() req: any, @Param('id') botId: string) {
    return this.botsService.deleteBot(req.user.id, botId);
  }

  /**
   * Publish a bot (make it active)
   * POST /bots/:id/publish
   */
  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publishBot(@Request() req: any, @Param('id') botId: string) {
    return this.botsService.publishBot(req.user.id, botId);
  }

  /**
   * Pause a bot
   * POST /bots/:id/pause
   */
  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  async pauseBot(@Request() req: any, @Param('id') botId: string) {
    return this.botsService.pauseBot(req.user.id, botId);
  }

  /**
   * Generate embed code for a bot
   * POST /bots/:id/embed-code
   */
  @Post(':id/embed-code')
  @HttpCode(HttpStatus.OK)
  async generateEmbedCode(@Request() req: any, @Param('id') botId: string) {
    return this.botsService.generateEmbedCode(req.user.id, botId);
  }

  /**
   * Get embed code for a bot
   * GET /bots/:id/embed-code
   */
  @Get(':id/embed-code')
  @HttpCode(HttpStatus.OK)
  async getEmbedCode(@Param('id') botId: string) {
    return this.botsService.getEmbedCode(botId);
  }

  /**
   * Get bot statistics
   * GET /bots/:id/stats
   */
  @Get(':id/stats')
  @HttpCode(HttpStatus.OK)
  async getBotStats(@Request() req: any, @Param('id') botId: string) {
    return this.botsService.getBotStats(req.user.id, botId);
  }
}
