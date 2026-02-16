import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/billing.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('billing')
export class BillingController {
  private stripe: Stripe;

  constructor(
    private billingService: BillingService,
    private configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey);
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getSubscriptionStatus(@Request() req) {
    return this.billingService.getSubscriptionStatus(req.user.sub);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(@Request() req, @Body() createCheckoutSessionDto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession(req.user.sub, createCheckoutSessionDto.plan);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Req() req: any) {
    if (!this.stripe) {
      return { received: true };
    }

    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      return { received: true };
    }

    try {
      const event = this.stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
      return this.billingService.handleWebhookEvent(event);
    } catch (err) {
      return { error: 'Webhook signature verification failed' };
    }
  }

  @Post('usage/:botId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async recordUsage(@Param('botId') botId: string, @Body('tokens') tokens: number = 1) {
    return this.billingService.recordMessageUsage(botId, tokens);
  }
}
