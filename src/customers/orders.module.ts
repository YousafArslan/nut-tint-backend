import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customers } from './customers.entity';
import { Orders } from 'src/orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customers,Orders])],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}
