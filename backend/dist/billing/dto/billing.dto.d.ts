export declare class CreateCheckoutSessionDto {
    plan: string;
}
export declare class SubscriptionStatusDto {
    id: string;
    plan: string;
    status: string;
    messagesUsed: number;
    messagesLimit: number;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    stripeCustomerId?: string;
}
export declare class WebhookEventDto {
    id: string;
    type: string;
    data: Record<string, any>;
}
