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
exports.BotsController = void 0;
const common_1 = require("@nestjs/common");
const bots_service_1 = require("./bots.service");
const bot_dto_1 = require("./dto/bot.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let BotsController = class BotsController {
    botsService;
    constructor(botsService) {
        this.botsService = botsService;
    }
    async createBot(req, createBotDto) {
        return this.botsService.createBot(req.user.sub, createBotDto);
    }
    async getBots(req) {
        return this.botsService.getBots(req.user.sub);
    }
    async getBot(req, botId) {
        return this.botsService.getBot(req.user.sub, botId);
    }
    async updateBot(req, botId, updateBotDto) {
        return this.botsService.updateBot(req.user.sub, botId, updateBotDto);
    }
    async deleteBot(req, botId) {
        return this.botsService.deleteBot(req.user.sub, botId);
    }
    async getEmbedCode(req, botId) {
        const embedCode = await this.botsService.getEmbedCode(req.user.sub, botId);
        return { embedCode };
    }
};
exports.BotsController = BotsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bot_dto_1.CreateBotDto]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "createBot", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "getBots", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "getBot", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, bot_dto_1.UpdateBotDto]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "updateBot", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "deleteBot", null);
__decorate([
    (0, common_1.Get)(':id/embed-code'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "getEmbedCode", null);
exports.BotsController = BotsController = __decorate([
    (0, common_1.Controller)('bots'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bots_service_1.BotsService])
], BotsController);
//# sourceMappingURL=bots.controller.js.map