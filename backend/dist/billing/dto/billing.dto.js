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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventDto = exports.SubscriptionStatusDto = exports.CreateCheckoutSessionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCheckoutSessionDto {
    plan;
}
exports.CreateCheckoutSessionDto = CreateCheckoutSessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCheckoutSessionDto.prototype, "plan", void 0);
class SubscriptionStatusDto {
    id;
    plan;
    status;
    messagesUsed;
    messagesLimit;
    currentPeriodStart;
    currentPeriodEnd;
    stripeCustomerId;
}
exports.SubscriptionStatusDto = SubscriptionStatusDto;
class WebhookEventDto {
    id;
    type;
    data;
}
exports.WebhookEventDto = WebhookEventDto;
//# sourceMappingURL=billing.dto.js.map