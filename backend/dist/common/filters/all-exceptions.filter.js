var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
import { Catch, HttpException, HttpStatus, Logger, } from '@nestjs/common';
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'object' && res !== null) {
                const resObj = res;
                message = resObj.message || exception.message;
                error = resObj.error || exception.name;
            }
            else {
                message = String(res);
                error = exception.name;
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
        };
        if (status >= 500) {
            this.logger.error(`[${request.method}] ${request.url} - Status ${status} - Error: ${JSON.stringify(message)}`, exception instanceof Error ? exception.stack : undefined);
        }
        else {
            this.logger.warn(`[${request.method}] ${request.url} - Status ${status} - Message: ${JSON.stringify(message)}`);
        }
        response.status(status).json(errorResponse);
    }
};
AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    Catch()
], AllExceptionsFilter);
export { AllExceptionsFilter };
//# sourceMappingURL=all-exceptions.filter.js.map