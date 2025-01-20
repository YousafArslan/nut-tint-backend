import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customers } from './customers.entity';
import { validate } from 'class-validator'; // Import validate to manually validate DTO
import { errorResponse, successResponse } from 'src/response.utils';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customers) // Inject the TypeORM repository for Customers
    private readonly customersRepository: Repository<Customers>,
  ) {}

  // Create a new customer
  async createCustomer(customerData: CreateCustomerDto): Promise<any> {
    try {
      const errors = await validate(customerData);
      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return errorResponse(
          `Validation failed: ${errorMessages.join('; ')}`,
          400,
        );
      }

      const customer : any = this.customersRepository.create(customerData);
      await this.customersRepository.save(customer);

      return successResponse(customer, 'Customer created successfully');
    } catch (error) {
      console.error('Error creating customer:', error);
      return errorResponse(
        'An unexpected error occurred while creating the customer',
        500,
      );
    }
  }

  // Get all customers
  async getAllCustomers(): Promise<any> {
    try {
      const customers : any = await this.customersRepository.find();
      return successResponse(customers, 'Customers fetched successfully');
    } catch (error) {
      console.error('Error fetching customers:', error);
      return errorResponse('An error occurred while fetching customers', 500);
    }
  }

  // Get a customer by ID
  async getCustomerById(id: number): Promise<any> {
    try {
      const customer :any = await this.customersRepository.findOne({
        where: { id },
        relations: ['orders'], // Include orders relation
      });

      if (!customer) {
        return errorResponse('Customer not found', 404);
      }
      return successResponse(customer, 'Customer fetched successfully');
    } catch (error) {
      console.error('Error fetching customer:', error);
      return errorResponse('An error occurred while fetching the customer', 500);
    }
  }

  // Update a customer
  async updateCustomer(
    id: number,
    updateData: UpdateCustomerDto,
  ): Promise<any> {
    try {
      const customer : any = await this.customersRepository.findOneBy({ id });
      if (!customer) {
        return errorResponse('Customer not found', 404);
      }

      Object.assign(customer, updateData); // Merge updated data into the customer object
      await this.customersRepository.save(customer);

      return successResponse(customer, 'Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
      return errorResponse('An error occurred while updating the customer', 500);
    }
  }
}
