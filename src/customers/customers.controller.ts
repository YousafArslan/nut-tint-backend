import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customers } from './customers.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';

@ApiTags('Customers')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(
    @Body() customerData: CreateCustomerDto,
  ): Promise<Customers> {
    return this.customersService.createCustomer(customerData);
  }

  @Get()
  async getAllCustomers(): Promise<Customers[]> {
    return this.customersService.getAllCustomers();
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: number): Promise<Customers> {
    return this.customersService.getCustomerById(id);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: number,
    @Body() updateData: UpdateCustomerDto,
  ): Promise<Customers> {
    return this.customersService.updateCustomer(id, updateData);
  }
}
