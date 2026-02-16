import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  private readonly PLANS = {
    starter: {
      name: 'Starter',
      price: 2999, // $29.99 in cents
      messagesLimit: 10000,
      features: ['Up to 3 bots', '10,000 messages/month', 'Basic analytics'],
    },
    growth: {
      name: 'Growth',
      price: 9999, // $99.99 in cents
      messagesLimit: 100000,
      features: ['Up to 20 bots', '100,000 messages/month', 'Advanced analytics', 'Priority support'],
    },
    enterprise: {
      name: 'Enterprise',
      price: 0, // Custom pricing
      messagesLimit: 1000000,
      features: ['Unlimited bots', '1M+ messages/month', 'Custom integration', 'Dedicated support'],
    },
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey);
    }
  }

  async getSubscriptionStatus(userId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: organization.id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return {
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      messagesUsed: subscription.messagesUsed,
      messagesLimit: subscription.messagesLimit,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      stripeCustomerId: subscription.stripeCustomerId,
    };
  }

  async createCheckoutSession(userId: string, plan: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const planConfig = this.PLANS[plan];
    if (!planConfig) {
      throw new BadRequestException('Invalid plan');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: userId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: organization.id },
    });

    // Create or get Stripe customer
    let stripeCustomerId = subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: (await this.prisma.user.findUnique({ where: { id: userId } }))?.email,
        metadata: {
          organizationId: organization.id,
          userId,
        },
      });
      stripeCustomerId = customer.id;

      await this.prisma.subscription.update({
        where: { organizationId: organization.id },
        data: { stripeCustomerId },
      });
    }

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planConfig.name,
              description: planConfig.features.join(', '),
            },
            unit_amount: planConfig.price,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing?success=true`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing?canceled=true`,
      metadata: {
        plan,
        organizationId: organization.id,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async handleWebhookEvent(event: any) {
    if (!this.stripe) {
      return { received: true };
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancellation(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
    }

    return { received: true };
  }

  private async handleSubscriptionUpdate(stripeSubscription: any) {
    const organizationId = stripeSubscription.metadata?.organizationId;
    if (!organizationId) return;

    const plan = stripeSubscription.metadata?.plan || 'starter';
    const planConfig = this.PLANS[plan];

    await this.prisma.subscription.update({
      where: { organizationId },
      data: {
        plan: plan.toUpperCase(),
        status: 'ACTIVE',
        messagesLimit: planConfig.messagesLimit,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    });
  }

  private async handleSubscriptionCancellation(stripeSubscription: any) {
    const organizationId = stripeSubscription.metadata?.organizationId;
    if (!organizationId) return;

    await this.prisma.subscription.update({
      where: { organizationId },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  private async handlePaymentSucceeded(invoice: any) {
    const organizationId = invoice.metadata?.organizationId;
    if (!organizationId) return;

    // Update subscription status
    await this.prisma.subscription.update({
      where: { organizationId },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async recordMessageUsage(botId: string, tokens: number = 1) {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: bot.organizationId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Update message usage
    await this.prisma.subscription.update({
      where: { organizationId: bot.organizationId },
      data: {
        messagesUsed: subscription.messagesUsed + tokens,
      },
    });

    return {
      messagesUsed: subscription.messagesUsed + tokens,
      messagesLimit: subscription.messagesLimit,
      percentageUsed: Math.round(((subscription.messagesUsed + tokens) / subscription.messagesLimit) * 100),
    };
  }
}
