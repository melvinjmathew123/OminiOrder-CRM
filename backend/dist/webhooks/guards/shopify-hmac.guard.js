var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ShopifyHmacGuard_1;
import { Injectable, UnauthorizedException, Logger, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
let ShopifyHmacGuard = ShopifyHmacGuard_1 = class ShopifyHmacGuard {
    configService;
    logger = new Logger(ShopifyHmacGuard_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const secret = this.configService.get('SHOPIFY_WEBHOOK_SECRET');
        const isSimulated = request.headers['x-simulator'] === 'true';
        if (isSimulated) {
            this.logger.debug('Simulator webhook received - bypassing HMAC check');
            return true;
        }
        if (!secret) {
            this.logger.warn('SHOPIFY_WEBHOOK_SECRET is not configured. Allowing webhook in demo mode.');
            return true;
        }
        const hmacHeader = request.headers['x-shopify-hmac-sha256'];
        if (!hmacHeader) {
            this.logger.error('Missing X-Shopify-Hmac-Sha256 header in webhook request');
            throw new UnauthorizedException('Missing Shopify HMAC signature');
        }
        const rawBody = request.rawBody || JSON.stringify(request.body);
        const generatedHash = crypto
            .createHmac('sha256', secret)
            .update(rawBody, 'utf8')
            .digest('base64');
        const generatedBuffer = Buffer.from(generatedHash, 'utf8');
        const headerBuffer = Buffer.from(hmacHeader, 'utf8');
        if (generatedBuffer.length !== headerBuffer.length ||
            !crypto.timingSafeEqual(generatedBuffer, headerBuffer)) {
            this.logger.error('Invalid HMAC signature received for Shopify webhook');
            throw new UnauthorizedException('Invalid Shopify webhook signature');
        }
        return true;
    }
};
ShopifyHmacGuard = ShopifyHmacGuard_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], ShopifyHmacGuard);
export { ShopifyHmacGuard };
//# sourceMappingURL=shopify-hmac.guard.js.map