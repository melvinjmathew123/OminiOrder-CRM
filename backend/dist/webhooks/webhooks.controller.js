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
import { Controller, Post, Get, Headers, Body, UseGuards, HttpCode, HttpStatus, Query, } from '@nestjs/common';
import { WebhooksService } from './webhooks.service.js';
import { ShopifyHmacGuard } from './guards/shopify-hmac.guard.js';
let WebhooksController = class WebhooksController {
    webhooksService;
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    async handleShopifyWebhook(topic, webhookId, payload) {
        const eventTopic = topic || 'orders/updated';
        return this.webhooksService.processOrderWebhook(eventTopic, webhookId, payload);
    }
    async getWebhookLogs(limit) {
        return this.webhooksService.getWebhookLogs(limit ? Number(limit) : 25);
    }
};
__decorate([
    Post('shopify'),
    HttpCode(HttpStatus.OK),
    UseGuards(ShopifyHmacGuard),
    __param(0, Headers('x-shopify-topic')),
    __param(1, Headers('x-shopify-webhook-id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleShopifyWebhook", null);
__decorate([
    Get('logs'),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "getWebhookLogs", null);
WebhooksController = __decorate([
    Controller('webhooks'),
    __metadata("design:paramtypes", [WebhooksService])
], WebhooksController);
export { WebhooksController };
//# sourceMappingURL=webhooks.controller.js.map