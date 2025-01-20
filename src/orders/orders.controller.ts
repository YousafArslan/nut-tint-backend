import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from './orders.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, GetOrdersDto, UpdateOrderDto } from './orders.dto';
import { SkipJwt } from 'src/exclude-jwt.decorator';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order
  @Post()
  async createOrder(
    @Body() orderData: CreateOrderDto,
    @Req() req: any,
  ): Promise<Orders> {
    const user = req.user;
    return this.ordersService.createOrder(orderData, user);
  }

  // Get all orders
  @Post('/getAll')
  // @SkipJwt()
  async getOrdersByDateRange(@Body() getOrdersDto: GetOrdersDto) {
    return this.ordersService.getAllOrders(getOrdersDto);
  }

  @Get('/pending-payments')
  async getPendingPayments(): Promise<Orders[]> {
    return await this.ordersService.getPendingPayments();
  }

  // Get a specific order by id
  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<Orders> {
    console.log('get by id');
    return this.ordersService.getOrderById(id);
  }

  // Update an order by id
  @Put(':id')
  async updateOrder(
    @Param('id') id: number,
    @Body() updateData: UpdateOrderDto,
    @Req() req: any,
  ): Promise<Orders> {
    const user = req.user;
    return this.ordersService.updateOrder(id, updateData, user);
  }

  // Delete an order by id
  @Delete(':id')
  async deleteOrder(@Param('id') id: number): Promise<void> {
    return this.ordersService.deleteOrder(id);
  }

 
}
