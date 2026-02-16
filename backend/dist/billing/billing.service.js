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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let BillingService = class BillingService {
    configService;
    prisma;
    stripe;
    PLANS = {
        starter: {
            name: 'Starter',
            price: 2999,
            messagesLimit: 10000,
            features: ['Up to 3 bots', '10,000 messages/month', 'Basic analytics'],
        },
        growth: {
            name: 'Growth',
            price: 9999,
            messagesLimit: 100000,
            features: ['Up to 20 bots', '100,000 messages/month', 'Advanced analytics', 'Priority support'],
        },
        enterprise: {
            name: 'Enterprise',
            price: 0,
            messagesLimit: 1000000,
            features: ['Unlimited bots', '1M+ messages/month', 'Custom integration', 'Dedicated support'],
        },
    };
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeSecretKey) {
            this.stripe = new stripe_1.default(stripeSecretKey);
        }
    }
    async getSubscriptionStatus(userId) {
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        const subscription = await this.prisma.subscription.findUnique({
            where: { organizationId: organization.id },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
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
    async createCheckoutSession(userId, plan) {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Stripe is not configured');
        }
        const planConfig = this.PLANS[plan];
        if (!planConfig) {
            throw new common_1.BadRequestException('Invalid plan');
        }
        const organization = await this.prisma.organization.findUnique({
            where: { ownerId: userId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        const subscription = await this.prisma.subscription.findUnique({
            where: { organizationId: organization.id },
        });
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
    async handleWebhookEvent(event) {
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
    async handleSubscriptionUpdate(stripeSubscription) {
        const organizationId = stripeSubscription.metadata?.organizationId;
        if (!organizationId)
            return;
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
    async handleSubscriptionCancellation(stripeSubscription) {
        const organizationId = stripeSubscription.metadata?.organizationId;
        if (!organizationId)
            return;
        await this.prisma.subscription.update({
            where: { organizationId },
            data: {
                status: 'CANCELLED',
            },
        });
    }
    async handlePaymentSucceeded(invoice) {
        const organizationId = invoice.metadata?.organizationId;
        if (!organizationId)
            return;
        await this.prisma.subscription.update({
            where: { organizationId },
            data: {
                status: 'ACTIVE',
            },
        });
    }
    async recordMessageUsage(botId, tokens = 1) {
        const bot = await this.prisma.bot.findUnique({
            where: { id: botId },
        });
        if (!bot) {
            throw new common_1.NotFoundException('Bot not found');
        }
        const subscription = await this.prisma.subscription.findUnique({
            where: { organizationId: bot.organizationId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
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
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map