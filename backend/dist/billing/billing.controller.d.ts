import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/billing.dto';
import { ConfigService } from '@nestjs/config';
export declare class BillingController {
    private billingService;
    private configService;
    private stripe;
    constructor(billingService: BillingService, configService: ConfigService);
    getSubscriptionStatus(req: any): Promise<{
        id: string;
        plan: import("@prisma/client").$Enums.SubscriptionPlan;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        messagesUsed: number;
        messagesLimit: number;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        stripeCustomerId: string | null;
    }>;
    createCheckoutSession(req: any, createCheckoutSessionDto: CreateCheckoutSessionDto): Promise<{
        sessionId: string;
        url: string | null;
    }>;
    handleWebhook(req: any): Promise<{
        received: boolean;
        error?: undefined;
    } | {
        error: string;
        received?: undefined;
    }>;
    recordUsage(botId: string, tokens?: number): Promise<{
        messagesUsed: number;
        messagesLimit: number;
        percentageUsed: number;
    }>;
}
