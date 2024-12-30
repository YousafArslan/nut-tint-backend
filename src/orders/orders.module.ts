import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders])], // Import TypeORM module with Order entity
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
