import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payments } from './payments.entity';
import { CreatePaymentDto, GetPaymentsDto, UpdatePaymentDto } from './payments.dto';
import { validate } from 'class-validator'; // Validate DTO
import { errorResponse, successResponse } from 'src/response.utils';
import { User } from 'src/user/user.entity';
import { Orders } from 'src/orders/orders.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payments) // Inject the TypeORM repository for Payments
    private readonly paymentsRepository: Repository<Payments>,
    @InjectRepository(Orders) // Inject the TypeORM repository for Payments
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto, user: User): Promise<any> {
    try {
      const { orderId, cashIn } = createPaymentDto;
  
      // Fetch the related order
      const order : any = await this.ordersRepository.findOne({
        where: { id: orderId },
        relations: ['payments'], // Include payments relation
      });
  
      if (!order) {
        return errorResponse('Order not found', 404);
      }
  
      // Calculate the total amount of payments made so far
      const totalPaymentsMade = order.payments.reduce((sum, payment) => sum + payment.cashIn, 0);
  
      // Calculate the remaining amount
      const remainingAmount = order.price - (totalPaymentsMade + cashIn);
  
      if (remainingAmount < 0) {
        return errorResponse('Payment exceeds the total amount due', 400);
      }
  
      // Create the payment
      const payment : any = this.paymentsRepository.create({
        cashIn,
        remainingAmount,
        order, // Associate with the fetched order
        createdBy: user, // Track the user who created this payment
      });
  
      await this.paymentsRepository.save(payment);
  
      return successResponse(payment, 'Payment created successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An unexpected error occurred while creating the payment', 500);
    }
  }

  // Get all payments with optional date range filter
  async getAllPayments(getPaymentsDto: GetPaymentsDto): Promise<any> {
    try {
      const { startDate, endDate } = getPaymentsDto;

      const payments : any = await this.paymentsRepository.find({
        where: {
          createdAt: startDate && endDate ? Between(startDate, endDate) : undefined,
        },
        relations: ['createdBy', 'updatedBy'], // Include user relations
      });

      return successResponse(payments, 'Payments fetched successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An error occurred while fetching payments',
        500,
      );
    }
  }

  // Get a payment by id
  async getPaymentById(id: number): Promise<any> {
    try {
      const payment : any = await this.paymentsRepository.findOne({
        where: { id },
        relations: ['createdBy', 'updatedBy'], // Include related entities
      });

      if (!payment) {
        return errorResponse('Payment not found', 404);
      }

      return successResponse(payment, 'Payment fetched successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while fetching the payment', 500);
    }
  }

  // Update a payment
  async updatePayment(id: number, updateData: UpdatePaymentDto, user: User): Promise<any> {
    try {
      // Fetch the payment by ID
      const payment : any = await this.paymentsRepository.findOne({
        where: { id },
        relations: ['order'], // Include the associated order
      });
  
      if (!payment) {
        return errorResponse('Payment not found', 404);
      }
  
      // Fetch the related order
      const order = payment.order;
  
      // Calculate the total payments made (excluding the current payment being updated)
      const totalPaymentsMade = await this.paymentsRepository
        .createQueryBuilder('payment')
        .where('payment.orderId = :orderId AND payment.id != :paymentId', { orderId: order.id, paymentId: payment.id })
        .select('SUM(payment.cashIn)', 'sum')
        .getRawOne();
  
      const totalPaymentsExcludingCurrent = totalPaymentsMade?.sum || 0;
  
      // Update the `cashIn` and recalculate `remainingAmount` if `cashIn` is provided
      if (updateData.cashIn !== undefined) {
        const newTotalPayments = totalPaymentsExcludingCurrent + updateData.cashIn;
  
        if (newTotalPayments > order.price) {
          return errorResponse('Updated payment exceeds the total amount due', 400);
        }
  
        payment.cashIn = updateData.cashIn;
        payment.remainingAmount = order.price - newTotalPayments;
      }
  
      // Update the `updatedBy` field
      payment.updatedBy = user;
  
      // Save the updated payment
      await this.paymentsRepository.save(payment);
  
      return successResponse(payment, 'Payment updated successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while updating the payment', 500);
    }
  }

  // Delete a payment
  async deletePayment(id: number): Promise<any> {
    try {
      const payment = await this.paymentsRepository.findOneBy({ id });
      if (!payment) {
        return errorResponse('Payment not found', 404);
      }

      await this.paymentsRepository.remove(payment);

      return successResponse(null, 'Payment deleted successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while deleting the payment', 500);
    }
  }
}
