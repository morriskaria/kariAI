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
exports.ConversationResponseDto = exports.MessageResponseDto = exports.RateConversationDto = exports.SendMessageDto = void 0;
const class_validator_1 = require("class-validator");
class SendMessageDto {
    content;
    userIdentifier;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "userIdentifier", void 0);
class RateConversationDto {
    satisfaction;
}
exports.RateConversationDto = RateConversationDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], RateConversationDto.prototype, "satisfaction", void 0);
class MessageResponseDto {
    id;
    conversationId;
    role;
    content;
    timestamp;
}
exports.MessageResponseDto = MessageResponseDto;
class ConversationResponseDto {
    id;
    botId;
    userIdentifier;
    messages;
    satisfaction;
    createdAt;
    updatedAt;
}
exports.ConversationResponseDto = ConversationResponseDto;
//# sourceMappingURL=conversation.dto.js.map