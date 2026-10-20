var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
let PrismaService = PrismaService_1 = class PrismaService extends PrismaClient {
    logger = new Logger(PrismaService_1.name);
    isConnected = false;
    async onModuleInit() {
        try {
            await this.$connect();
            this.isConnected = true;
            this.logger.log('Connected to PostgreSQL database successfully via Prisma');
        }
        catch (error) {
            this.isConnected = false;
            this.logger.error(`Failed to connect to PostgreSQL database: ${error?.message || error}`);
            this.logger.warn('Please check DATABASE_URL in .env or run PostgreSQL via Docker ("docker compose up -d")');
        }
    }
    async onModuleDestroy() {
        if (this.isConnected) {
            await this.$disconnect();
            this.logger.log('Disconnected from PostgreSQL');
        }
    }
};
PrismaService = PrismaService_1 = __decorate([
    Injectable()
], PrismaService);
export { PrismaService };
//# sourceMappingURL=prisma.service.js.map