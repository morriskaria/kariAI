import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  async getDashboardOverview(@Request() req) {
    return this.analyticsService.getDashboardOverview(req.user.sub);
  }

  @Get('bots/:botId')
  async getBotAnalytics(@Request() req, @Param('botId') botId: string) {
    return this.analyticsService.getBotAnalytics(req.user.sub, botId);
  }

  @Get('conversations')
  async getConversationAnalytics(@Request() req) {
    return this.analyticsService.getConversationAnalytics(req.user.sub);
  }
}
