import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetOrdersFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  financialStatus?: string;

  @IsOptional()
  @IsString()
  fulfillmentStatus?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @IsIn(['orderDate', 'totalPrice', 'orderNumber', 'createdAt'])
  sortBy?: string = 'orderDate';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
