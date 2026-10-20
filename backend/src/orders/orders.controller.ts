import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOrders(@Query() filter: GetOrdersFilterDto) {
    return this.ordersService.getOrders(filter);
  }

  @Get('stats')
  async getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Post('sync')
  async syncOrders() {
    return this.ordersService.syncOrdersFromShopify('MANUAL');
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }
}
