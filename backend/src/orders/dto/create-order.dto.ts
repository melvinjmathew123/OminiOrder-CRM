import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  variantTitle?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class OrderShippingAddressDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address1?: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  financialStatus?: string = 'pending';

  @IsOptional()
  @IsString()
  fulfillmentStatus?: string = 'unfulfilled';

  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  lineItems: OrderItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderShippingAddressDto)
  shippingAddress?: OrderShippingAddressDto;
}
