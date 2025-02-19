import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { OilStockService } from './oil-stock.service';
import { CreateOilStockDto, GetOilStockDto } from './oil-stock.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Oil Stocks')
@Controller('oil-stocks')
export class OilStockController {
  constructor(private readonly oilStockService: OilStockService) {}

  @Post('/getAll')
  async getAllOilStocks(@Body() getOilStockDto: GetOilStockDto) {
    return await this.oilStockService.getAllOilStocks(getOilStockDto);
  }

  @Post()
  async createOilStock(
    @Body() createOilStockDto: CreateOilStockDto,
    @Req() req: any,
  ) {
    const user = req.user; // Assume user info is available in the request (e.g., via JWT)
    return await this.oilStockService.createOilStock(createOilStockDto, user);
  }
  
  @Post('/remainingOil')
  async getRemainingOil() {
    return await this.oilStockService.getRemainingOil();
  }
}
