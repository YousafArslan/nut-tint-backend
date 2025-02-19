import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Brackets, Repository } from 'typeorm';
import { Orders } from './orders.entity';
import {
  CreateOrderDto,
  GetOrdersDto,
  GetPendingPyamentDto,
  UpdateOrderDto,
} from './orders.dto';
import { validate } from 'class-validator'; // Import validate to manually validate DTO
import { errorResponse, successResponse } from 'src/response.utils';
import { User } from 'src/user/user.entity';
import { Customers } from 'src/customers/customers.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) // Inject the TypeORM repository for Order
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(Customers)
    private readonly customersRepository: Repository<Customers>,
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

      const { customerId } = orderData;

      // Check if the customer exists
      const customer = await this.customersRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(
          'Customer with the given ID does not exist',
        );
      }

      // Assign createdBy relationship
      const order: any = this.orderRepository.create({
        ...orderData,
        createdBy: user, // Set the user object for createdBy
        customer: customer,
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

  async getAllOrders(getOrdersDto: GetOrdersDto): Promise<any> {
    try {
        let { startDate, endDate, customerId } = getOrdersDto;

        // If no date is provided, default to today's date
        if (!startDate || !endDate) {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            startDate = today;
            endDate = today;
        }

        // SQL Query to Fetch Orders
        let query = `
        SELECT 
            o.*, 
            c."shopName", 
            c."name" 
        FROM "Orders" o
        LEFT JOIN "Customers" c ON o."customerId" = c."id"
        WHERE DATE(o."createdAt") BETWEEN ? AND ?
        `;

        const queryParams: any[] = [startDate, endDate];

        if (customerId) {
            query += ' AND o."customerId" = ?';
            queryParams.push(customerId);
        }

        console.log("Executing Query:", query);
        console.log("Query Parameters:", queryParams);

        const orders = await this.orderRepository.query(query, queryParams);

        // Convert boolean fields properly
        const updatedOrders = orders.map(order => ({
            ...order,
            pickUp: order.pickUp === 1, // Convert to boolean
            delivery: order.delivery === 1, // Convert to boolean
        }));

        console.log("Fetched Orders Count:", updatedOrders.length);
        return successResponse(updatedOrders, 'Orders fetched successfully');
    } catch (error) {
        console.error("Error fetching orders:", error);
        return errorResponse('An error occurred while fetching orders', 500);
    }
}


  // Get an order by id
  async getOrderById(id: number): Promise<any> {
    try {
      const order: any = await this.orderRepository.findOne({
        where: { id }, // Find order by ID
        relations: ['createdBy', 'updatedBy', 'deliveredBy', 'customer'], // Include related entities
      });

      if (!order) {
        return errorResponse('Order not found', 404); // Return error if order doesn't exist
      }
      const response = {
        ...order,
        customerId: order.customer?.id || null, // Include only the customer ID
        shopName: order.customer?.shopName || null, // Include shopName
        name: order.customer?.name || null, // Include name
      };
      delete response.customer;
      return successResponse(response, 'Order fetched successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while fetching the order', 500);
    }
  }

  async updateOrder(
    id: number,
    updateData: UpdateOrderDto,
    user: User,
  ): Promise<any> {
    try {
      const order: any = await this.orderRepository.findOne({
        where: { id },
        relations: ['customer'], // Include the customer relation
      });

      if (!order) {
        return errorResponse('Order not found', 404);
      }

      // Handle delivery update
      if (updateData.delivery === true) {
        order.deliveredAt = new Date().toISOString();
        order.deliveredBy = user;
      }

      // Handle customer update
      if (updateData?.customerId) {
        const customer = await this.customersRepository.findOne({
          where: { id: updateData.customerId },
        });

        if (!customer) {
          throw new NotFoundException(
            'Customer with the given ID does not exist',
          );
        }

        order.customer = customer; // Assign the customer entity
      }

      // Always update updatedBy
      order.updatedBy = user;

      // Merge other updates
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

  async getPendingPayments(body: GetPendingPyamentDto): Promise<any> {
    try {
      const queryBuilder = this.orderRepository
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.payments', 'payments')
        .leftJoinAndSelect('orders.customer', 'customer') // Include the customer
        .where('orders.delivery = :delivery', { delivery: true })
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              `NOT EXISTS (
                SELECT 1 
                FROM payments 
                WHERE payments.orderId = orders.id
              )`,
            ).orWhere(
              `(
                SELECT payments.remainingAmount 
                FROM payments 
                WHERE payments.orderId = orders.id 
                ORDER BY payments.createdAt DESC 
                LIMIT 1
              ) > 0`,
            );
          }),
        );
  
      // If customerId is provided, filter the orders by customer
      if (body.customerId) {
        queryBuilder.andWhere('orders.customerId = :customerId', {
          customerId: body.customerId,
        });
      }
  
      // Execute the query and fetch the results
      const orders: any = await queryBuilder.getMany();
  
      // Check if no orders are found
      if (!orders.length) {
        return errorResponse('No orders with pending payments found', 404);
      }
  
      // Return the fetched orders along with customer details
      return successResponse(
        orders,
        'Pending payment orders with customer details fetched successfully',
      );
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error fetching pending payment orders:', error);
  
      // Return an error response
      return errorResponse(
        'An error occurred while fetching pending payment orders',
        500,
      );
    }
  }
  async getPendingOrders(): Promise<any> {
    try {
      const orders = await this.orderRepository.find({
        where: { delivery: false }, // Only fetch orders where deliveredAt is null
        relations: ['customer'], // You can include relations (like customer) if needed
      });

      return successResponse(orders, 'Pending orders retrieved successfully');
    } catch (error) {
      console.error(error);
      return errorResponse('An error occurred while retrieving pending orders', 500);
    }
  }
  
}
