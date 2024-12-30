import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])], // Import the Expense entity
  controllers: [ExpenseController], // Register the controller
  providers: [ExpenseService], // Register the service
})
export class ExpenseModule {}
