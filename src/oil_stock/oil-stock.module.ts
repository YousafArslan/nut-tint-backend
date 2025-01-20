import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OilStock } from './oil-stock.entity';
import { OilStockService } from './oil-stock.service';
import { OilStockController } from './oil-stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OilStock])], // Register OilStock entity
  providers: [OilStockService],
  controllers: [OilStockController],
})
export class OilStockModule {}
