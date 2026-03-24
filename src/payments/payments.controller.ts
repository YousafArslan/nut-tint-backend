import { Controller, Get, Post, Body, Param, Put, Delete, Query, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, GetPaymentsDto, UpdatePaymentDto } from './payments.dto';
import { User } from 'src/user/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    const user: User = req.user; // Assume user info is available via JWT
    return this.paymentsService.createPayment(createPaymentDto, user);
  }

  @Post('/getAll')
  async getAllPayments(@Body() getPaymentsDto: GetPaymentsDto) {
    return this.paymentsService.getAllPayments(getPaymentsDto);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: number) {
    return this.paymentsService.getPaymentById(id);
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Req() req: any,
  ) {
    const user: User = req.user;
    return this.paymentsService.updatePayment(id, updatePaymentDto, user);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: number) {
    return this.paymentsService.deletePayment(id);
  }


  @Post('/ordersByPaymentDateRange')
  async getOrdersByPaymentDateRange(@Body() getPaymentsDto: GetPaymentsDto ) {
    // Call the service method to get orders based on the date range
    return this.paymentsService.getOrdersByPaymentDateRange(getPaymentsDto);
  }
}
