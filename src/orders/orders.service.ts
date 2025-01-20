import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Orders } from './orders.entity';
import { CreateOrderDto, GetOrdersDto, UpdateOrderDto } from './orders.dto';
import { validate } from 'class-validator'; // Import validate to manually validate DTO
import { errorResponse, successResponse } from 'src/response.utils';
import { User } from 'src/user/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) // Inject the TypeORM repository for Order
    private readonly orderRepository: Repository<Orders>,
  ) {}

  // Create a new order
  async createOrder(orderData: CreateOrderDto, user: User): Promise<any> {
    try {
      const errors = await validate(orderData);
      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return errorResponse(
          `Validation failed: ${errorMessages.join('; ')}`,
          400,
        );
      }

      // Assign createdBy relationship
      const order: any = this.orderRepository.create({
        ...orderData,
        createdBy: user, // Set the user object for createdBy
      });

      await this.orderRepository.save(order);

      return successResponse(order, 'Order created successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An unexpected error occurred while creating the order',
        500,
      );
    }
  }

  // Get all orders with optional date range filter
  async getAllOrders(getOrdersDto: GetOrdersDto): Promise<any> {
    try {
      const { startDate, endDate } = getOrdersDto;

      let query = 'SELECT * FROM "Orders" WHERE 1=1';
      const queryParams: any[] = [];

      if (startDate) {
        query += ' AND "createdAt" >= ?';
        queryParams.push(startDate);
      }

      if (endDate) {
        query += ' AND "createdAt" <= ?';
        queryParams.push(endDate);
      }

      const orders = await this.orderRepository.query(query, queryParams);

      return successResponse(orders, 'Orders fetched successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while fetching orders', 500);
    }
  }

  // Get an order by id
  async getOrderById(id: number): Promise<any> {
    try {
      const order: any = await this.orderRepository.findOne({
        where: { id }, // Find order by ID
        relations: ['createdBy', 'updatedBy', 'deliveredBy'], // Include related entities
      });

      if (!order) {
        return errorResponse('Order not found', 404); // Return error if order doesn't exist
      }
      return successResponse(order, 'Order fetched successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while fetching the order', 500);
    }
  }

  // Update an order
  async updateOrder(
    id: number,
    updateData: UpdateOrderDto,
    user: User,
  ): Promise<any> {
    try {
      const order: any = await this.orderRepository.findOneBy({ id });
      if (!order) {
        return errorResponse('Order not found', 404);
      }

      // If delivery is true, set deliveredAt and deliveredBy
      if (updateData.delivery === true) {
        order.deliveredAt = new Date().toISOString();
        order.deliveredBy = user; // Set the user object for deliveredBy
      }

      // Always set updatedBy
      order.updatedBy = user; // Set the user object for updatedBy

      // Merge and save the updated order
      Object.assign(order, updateData);
      await this.orderRepository.save(order);

      return successResponse(order, 'Order updated successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while updating the order', 500);
    }
  }

  // Delete an order
  async deleteOrder(id: number): Promise<any> {
    try {
      const order = await this.orderRepository.findOneBy({ id });
      if (!order) {
        return errorResponse('Order not found', 404);
      }
      await this.orderRepository.remove(order); // Remove the order from the database
      return successResponse(null, 'Order deleted successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while deleting the order', 500);
    }
  }

  async getPendingPayments(): Promise<any> {
    try {
      // Fetch orders with pending payments or no payments
      const orders : any = await this.orderRepository
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.payments', 'payments')
        .where('orders.delivery = :delivery', { delivery: true })
        .andWhere(
          `(
            NOT EXISTS (
              SELECT 1 
              FROM payments 
              WHERE payments.orderId = orders.id
            )
            OR (
              SELECT payments.remainingAmount 
              FROM payments 
              WHERE payments.orderId = orders.id 
              ORDER BY payments.createdAt DESC 
              LIMIT 1
            ) > 0
          )`
        )
        .getMany();
  
      // Check if no orders are found
      if (!orders.length) {
        return errorResponse('No orders with pending payments found', 404);
      }
  
      // Return the fetched orders with a success response
      return successResponse(orders, 'Pending payment orders fetched successfully');
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error fetching pending payment orders:', error);
  
      // Return an error response
      return errorResponse('An error occurred while fetching pending payment orders', 500);
    }
  }
}
