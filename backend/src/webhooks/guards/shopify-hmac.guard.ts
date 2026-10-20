import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class ShopifyHmacGuard implements CanActivate {
  private readonly logger = new Logger(ShopifyHmacGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = this.configService.get<string>('SHOPIFY_WEBHOOK_SECRET');

    // Allow simulator / demo requests with header or if secret is not yet configured
    const isSimulated = request.headers['x-simulator'] === 'true';
    if (isSimulated) {
      this.logger.debug('Simulator webhook received - bypassing HMAC check');
      return true;
    }

    if (!secret) {
      this.logger.warn('SHOPIFY_WEBHOOK_SECRET is not configured. Allowing webhook in demo mode.');
      return true;
    }

    const hmacHeader = request.headers['x-shopify-hmac-sha256'] as string;
    if (!hmacHeader) {
      this.logger.error('Missing X-Shopify-Hmac-Sha256 header in webhook request');
      throw new UnauthorizedException('Missing Shopify HMAC signature');
    }

    // Must use raw body
    const rawBody = request.rawBody || JSON.stringify(request.body);
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    const generatedBuffer = Buffer.from(generatedHash, 'utf8');
    const headerBuffer = Buffer.from(hmacHeader, 'utf8');

    if (
      generatedBuffer.length !== headerBuffer.length ||
      !crypto.timingSafeEqual(generatedBuffer, headerBuffer)
    ) {
      this.logger.error('Invalid HMAC signature received for Shopify webhook');
      throw new UnauthorizedException('Invalid Shopify webhook signature');
    }

    return true;
  }
}
