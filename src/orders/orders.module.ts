import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './orders.entity';
import { Payments } from 'src/payments/payments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Payments])], // Import TypeORM module with Order entity
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
