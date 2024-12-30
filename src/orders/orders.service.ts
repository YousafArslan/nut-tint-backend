import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Orders } from './orders.entity';
import { CreateOrderDto, GetOrdersDto } from './orders.dto';
import { validate } from 'class-validator'; // Import validate to manually validate DTO
import { errorResponse, successResponse } from 'src/response.utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) // Inject the TypeORM repository for Order
    private readonly orderRepository: Repository<Orders>,
  ) {}

  // Create a new order
  async createOrder(orderData: CreateOrderDto): Promise<any> {
    try {
      // Validate the incoming order data
      const errors = await validate(orderData); // Validate the DTO instance
      if (errors.length > 0) {
        // If validation fails, throw a custom error
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return errorResponse(
          `Validation failed: ${errorMessages.join('; ')}`,
          400,
        );
      }

      // Create a new order
      const order: any = this.orderRepository.create(orderData); // Create an instance of the entity
      await this.orderRepository.save(order); // Save the order to the database

      return successResponse(order, 'Order created successfully');
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
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
  
      return {
        succeeded: true,
        httpStatusCode: 200,
        message: 'Orders fetched successfully',
        data: orders,
      };
    } catch (error) {
      console.error(error);
      return {
        succeeded: false,
        httpStatusCode: 500,
        message: 'An error occurred while fetching orders',
      };
    }
  }


  // Get an order by id
  async getOrderById(id: number): Promise<any> {
    try {
      const order: any = await this.orderRepository.findOneBy({ id }); // Find order by ID
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
  async updateOrder(id: number, updateData: CreateOrderDto): Promise<any> {
    try {
      const order: any = await this.orderRepository.findOneBy({ id });
      if (!order) {
        return errorResponse('Order not found', 404);
      }

      // Merge the current order with the updated data and save it
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
}
