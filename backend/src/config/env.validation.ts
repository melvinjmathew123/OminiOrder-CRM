import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 4000;

  @IsString()
  @IsOptional()
  DATABASE_URL: string = 'postgresql://postgres:postgres@localhost:5432/mom_crm?schema=public';

  @IsString()
  @IsOptional()
  SHOPIFY_SHOP_DOMAIN: string = '';

  @IsString()
  @IsOptional()
  SHOPIFY_ADMIN_ACCESS_TOKEN: string = '';

  @IsString()
  @IsOptional()
  SHOPIFY_API_VERSION: string = '2024-01';

  @IsString()
  @IsOptional()
  SHOPIFY_WEBHOOK_SECRET: string = '';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Config validation error: ${errors.toString()}`);
  }

  return validatedConfig;
}
