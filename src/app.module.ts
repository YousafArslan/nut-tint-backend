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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes it available throughout the application
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User,Orders,Expense],
      synchronize: true, // Auto-migrate schema, disable in production
    }),
    UserModule,
    OrdersModule,
    ExpenseModule
  ],
  providers: [JwtGuard,Reflector],
})
export class AppModule {}
