import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class BillingService {
    private configService;
    private prisma;
    private stripe;
    private readonly PLANS;
    constructor(configService: ConfigService, prisma: PrismaService);
    getSubscriptionStatus(userId: string): Promise<{
        id: string;
        plan: import("@prisma/client").$Enums.SubscriptionPlan;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        messagesUsed: number;
        messagesLimit: number;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        stripeCustomerId: string | null;
    }>;
    createCheckoutSession(userId: string, plan: string): Promise<{
        sessionId: string;
        url: string | null;
    }>;
    handleWebhookEvent(event: any): Promise<{
        received: boolean;
    }>;
    private handleSubscriptionUpdate;
    private handleSubscriptionCancellation;
    private handlePaymentSucceeded;
    recordMessageUsage(botId: string, tokens?: number): Promise<{
        messagesUsed: number;
        messagesLimit: number;
        percentageUsed: number;
    }>;
}
