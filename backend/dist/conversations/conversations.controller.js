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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsController = void 0;
const common_1 = require("@nestjs/common");
const conversations_service_1 = require("./conversations.service");
const conversation_dto_1 = require("./dto/conversation.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let ConversationsController = class ConversationsController {
    conversationsService;
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    async sendMessage(req, botId, conversationId, sendMessageDto) {
        return this.conversationsService.sendMessage(req.user.sub, botId, sendMessageDto);
    }
    async getConversations(req, botId, limit = 50, offset = 0) {
        return this.conversationsService.getConversations(req.user.sub, botId, limit, offset);
    }
    async getStats(req, botId) {
        return this.conversationsService.getConversationStats(req.user.sub, botId);
    }
    async getConversation(req, conversationId) {
        return this.conversationsService.getConversation(req.user.sub, conversationId);
    }
    async rateConversation(req, conversationId, rateDto) {
        return this.conversationsService.rateConversation(req.user.sub, conversationId, rateDto);
    }
};
exports.ConversationsController = ConversationsController;
__decorate([
    (0, common_1.Post)(':conversationId/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('botId')),
    __param(2, (0, common_1.Param)('conversationId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, conversation_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('botId')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('botId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':conversationId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)(':conversationId/rate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, conversation_dto_1.RateConversationDto]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "rateConversation", null);
exports.ConversationsController = ConversationsController = __decorate([
    (0, common_1.Controller)('bots/:botId/conversations'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ConversationsController);
//# sourceMappingURL=conversations.controller.js.map