import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export interface ErrorResponse {
    success: false;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    error: string;
    message: string | string[];
}
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
