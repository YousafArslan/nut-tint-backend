import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payments } from './payments.entity';
import {
  CreatePaymentDto,
  GetPaymentsDto,
  UpdatePaymentDto,
} from './payments.dto';
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

  async createPayment(
    createPaymentDto: CreatePaymentDto,
    user: User,
  ): Promise<any> {
    try {
      const { orderId, cashIn } = createPaymentDto;

      // Fetch the related order
      const order: any = await this.ordersRepository.findOne({
        where: { id: orderId },
        relations: ['payments'], // Include payments relation
      });

      if (!order) {
        return errorResponse('Order not found', 404);
      }

      // Calculate the total amount of payments made so far
      const totalPaymentsMade = order.payments.reduce(
        (sum, payment) => sum + payment.cashIn,
        0,
      );

      // Calculate the remaining amount
      const remainingAmount = order.price - (totalPaymentsMade + cashIn);

      if (remainingAmount < 0) {
        return errorResponse('Payment exceeds the total amount due', 400);
      }

      // Create the payment
      const payment: any = this.paymentsRepository.create({
        cashIn,
        remainingAmount,
        order, // Associate with the fetched order
        createdBy: user, // Track the user who created this payment
      });

      await this.paymentsRepository.save(payment);

      return successResponse(payment, 'Payment created successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An unexpected error occurred while creating the payment',
        500,
      );
    }
  }

  // Get all payments with optional date range filter
  async getAllPayments(getPaymentsDto: GetPaymentsDto): Promise<any> {
    try {
      let { startDate, endDate } = getPaymentsDto;

      // If no date is provided, default to today's date
      if (!startDate || !endDate) {
        const today = new Date();
        startDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        endDate = startDate; // Keep same for single day filtering
      }

      // Convert string dates to Date objects and ensure UTC time
      const startOfDay = new Date(`${startDate}T00:00:00.000Z`);
      const endOfDay = new Date(`${endDate}T23:59:59.999Z`);

      // Fetch payments within the selected date range
      const payments: any = await this.paymentsRepository.find({
        where: {
          createdAt: Between(startOfDay, endOfDay),
        },
        relations: ['createdBy', 'updatedBy'], // Include related users
      });

      return successResponse(payments, 'Payments fetched successfully');
    } catch (error) {
      console.error('Error fetching payments:', error);
      return errorResponse(
        'An unexpected error occurred while fetching payments',
        500,
      );
    }
  }

  // Get a payment by id
  async getPaymentById(id: number): Promise<any> {
    try {
      const payment: any = await this.paymentsRepository.findOne({
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
  async updatePayment(
    id: number,
    updateData: UpdatePaymentDto,
    user: User,
  ): Promise<any> {
    try {
      // Fetch the payment by ID
      const payment: any = await this.paymentsRepository.findOne({
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
        .where('payment.orderId = :orderId AND payment.id != :paymentId', {
          orderId: order.id,
          paymentId: payment.id,
        })
        .select('SUM(payment.cashIn)', 'sum')
        .getRawOne();

      const totalPaymentsExcludingCurrent = totalPaymentsMade?.sum || 0;

      // Update the `cashIn` and recalculate `remainingAmount` if `cashIn` is provided
      if (updateData.cashIn !== undefined) {
        const newTotalPayments =
          totalPaymentsExcludingCurrent + updateData.cashIn;

        if (newTotalPayments > order.price) {
          return errorResponse(
            'Updated payment exceeds the total amount due',
            400,
          );
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

  // Inside PaymentsService
  async getOrdersByPaymentDateRange(getPaymentsDto: GetPaymentsDto): Promise<any> {
    try {
      const { startDate, endDate } = getPaymentsDto;
  
      if (!startDate || !endDate) {
        return errorResponse('Both startDate and endDate are required', 400);
      }
  
      const dateStart = new Date(`${startDate}T00:00:00.000Z`);
      const dateEnd = new Date(`${endDate}T23:59:59.999Z`);
  
      // Fetch payments within the date range and their orders
      const filteredPayments = await this.paymentsRepository
        .createQueryBuilder('payment')
        .innerJoinAndSelect('payment.order', 'order')
        .innerJoinAndSelect('order.customer', 'customer')  // Join the customer data
        .where('payment.createdAt BETWEEN :startDate AND :endDate', {
          startDate: dateStart,
          endDate: dateEnd,
        })
        .getMany();
  
      // Get unique order IDs from payments
      const orderIds = [...new Set(filteredPayments.map(payment => payment.order.id))];
  
      if (orderIds.length === 0) {
        return successResponse(
          { orders: [], totalPaymentAllOrders: 0 },
          'No orders found for the given date range'
        );
      }
  
      // Fetch all orders including their full payment history and customer information
      const orders = await this.ordersRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.payments', 'payments')
        .leftJoinAndSelect('order.customer', 'customer')  // Include customer in the query
        .where('order.id IN (:...orderIds)', { orderIds })
        .getMany();
  
      // Process orders to mark `paidInGivenDateFilter` and calculate `totalPayment`
      let totalPaymentAllOrders = 0; // Variable to store total payment of all orders
  
      const result = orders.map(order => {
        const updatedPayments = order.payments.map(payment => ({
          ...payment,
          paidInGivenDateFilter:
            payment.createdAt >= dateStart && payment.createdAt <= dateEnd,
        }));
  
        const totalPayment = updatedPayments
          .filter(payment => payment.paidInGivenDateFilter)
          .reduce((sum, payment) => sum + payment.cashIn, 0); // Assuming `cashIn` represents the payment amount
  
        totalPaymentAllOrders += totalPayment; // Add to total across all orders
  
        return {
          ...order,
          customer: order.customer,  // Include the customer data in the response
          payments: updatedPayments,
          totalPayment, // Total for this specific order
        };
      });
  
      return successResponse(
        { orders: result, totalPaymentAllOrders },
        'Orders fetched successfully'
      );
    } catch (error) {
      console.error('Error fetching orders by payment date range:', error);
      return errorResponse('An unexpected error occurred', 500);
    }
  }
  
  
}
