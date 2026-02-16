import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { SendMessageDto, RateConversationDto } from './dto/conversation.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('bots/:botId/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post(':conversationId/messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Request() req,
    @Param('botId') botId: string,
    @Param('conversationId') conversationId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.conversationsService.sendMessage(req.user.sub, botId, sendMessageDto);
  }

  @Get()
  async getConversations(
    @Request() req,
    @Param('botId') botId: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    return this.conversationsService.getConversations(req.user.sub, botId, limit, offset);
  }

  @Get('stats')
  async getStats(@Request() req, @Param('botId') botId: string) {
    return this.conversationsService.getConversationStats(req.user.sub, botId);
  }

  @Get(':conversationId')
  async getConversation(@Request() req, @Param('conversationId') conversationId: string) {
    return this.conversationsService.getConversation(req.user.sub, conversationId);
  }

  @Post(':conversationId/rate')
  @HttpCode(HttpStatus.OK)
  async rateConversation(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Body() rateDto: RateConversationDto,
  ) {
    return this.conversationsService.rateConversation(req.user.sub, conversationId, rateDto);
  }
}
