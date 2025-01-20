import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { ExpenseModule } from './expense/expense.module';
import { JwtGuard } from './jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { User } from './user/user.entity';
import { Orders } from './orders/orders.entity';
import { Expense } from './expense/expense.entity';
import { OilStockModule } from './oil_stock/oil-stock.module';
import { OilStock } from './oil_stock/oil-stock.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payments } from './payments/payments.entity';
import { Customers } from './customers/customers.entity';
import { CustomersModule } from './customers/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes it available throughout the application
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User,Orders,Expense, OilStock, Payments, Customers],
      synchronize: true, // Auto-migrate schema, disable in production
    }),
    UserModule,
    OrdersModule,
    ExpenseModule,
    OilStockModule,
    PaymentsModule,
    CustomersModule
  ],
  providers: [JwtGuard,Reflector],
})
export class AppModule {}
