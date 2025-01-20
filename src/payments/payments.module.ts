import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './payments.entity';
import { Orders } from 'src/orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payments, Orders])], // Include both Payments and Orders entities
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
