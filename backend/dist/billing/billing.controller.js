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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const billing_service_1 = require("./billing.service");
const billing_dto_1 = require("./dto/billing.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let BillingController = class BillingController {
    billingService;
    configService;
    stripe;
    constructor(billingService, configService) {
        this.billingService = billingService;
        this.configService = configService;
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeSecretKey) {
            this.stripe = new stripe_1.default(stripeSecretKey);
        }
    }
    async getSubscriptionStatus(req) {
        return this.billingService.getSubscriptionStatus(req.user.sub);
    }
    async createCheckoutSession(req, createCheckoutSessionDto) {
        return this.billingService.createCheckoutSession(req.user.sub, createCheckoutSessionDto.plan);
    }
    async handleWebhook(req) {
        if (!this.stripe) {
            return { received: true };
        }
        const sig = req.headers['stripe-signature'];
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            return { received: true };
        }
        try {
            const event = this.stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
            return this.billingService.handleWebhookEvent(event);
        }
        catch (err) {
            return { error: 'Webhook signature verification failed' };
        }
    }
    async recordUsage(botId, tokens = 1) {
        return this.billingService.recordMessageUsage(botId, tokens);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getSubscriptionStatus", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, billing_dto_1.CreateCheckoutSessionDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('usage/:botId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('botId')),
    __param(1, (0, common_1.Body)('tokens')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "recordUsage", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService,
        config_1.ConfigService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map