import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'user.db',
      autoLoadEntities: true,
      synchronize: true, // For development only
    }),
    UserModule,
  ],
})
export class AppModule {}
