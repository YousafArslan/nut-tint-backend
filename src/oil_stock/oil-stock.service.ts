import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OilStock } from './oil-stock.entity';
import { CreateOilStockDto, GetOilStockDto, OilType } from './oil-stock.dto';
import { errorResponse, successResponse } from 'src/response.utils';
import { User } from 'src/user/user.entity';

@Injectable()
export class OilStockService {
  constructor(
    @InjectRepository(OilStock)
    private readonly oilStockRepository: Repository<OilStock>,
  ) {}

  async getAllOilStocks(getOilStockDto: GetOilStockDto): Promise<any> {
    try {
      const { startDate, endDate } = getOilStockDto;
  
      // Convert string dates to full-day range
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0); // Set time to start of day
  
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999); // Set time to end of day
  
      const oilStocks: any = await this.oilStockRepository.find({
        where: {
          createdAt: Between(startOfDay, endOfDay),
        },
        relations: ['createdBy'], // Include related user data
      });
  
      return successResponse(
        oilStocks,
        'Oil transactions fetched successfully',
      );
    } catch (error) {
      console.error(error);
      return {
        succeeded: false,
        httpStatusCode: 500,
        message: 'An error occurred while fetching oil transactions',
      };
    }
  }

  async createOilStock(
    createOilStockDto: CreateOilStockDto,
    user: User,
  ): Promise<any> {
    try {
      const oilPurchased = createOilStockDto.oilPurchased || 0;
      const oilUsed = createOilStockDto.oilUsed || 0;
      const purchasePrice = createOilStockDto.purchasePrice || 0;
  
      // Ensure oilType is correctly assigned
      const oilType: OilType = createOilStockDto.oilType as OilType;
  
      // Fetch the latest entry for the same oil type
      const lastOilStock = await this.oilStockRepository.findOne({
        where: { type: oilType },
        order: { createdAt: 'DESC' },
      });
  
      // Calculate the new remaining oil
      const remainingOil =
        (lastOilStock ? lastOilStock.remainingOil : 0) + oilPurchased - oilUsed;
  
      if (remainingOil < 0) {
        return {
          succeeded: false,
          httpStatusCode: 400,
          message: 'Not enough oil available to fulfill the request',
        };
      }
  
      // Create a new oil stock entry
      const oilStock = this.oilStockRepository.create({
        oilPurchased,
        oilUsed,
        purchasePrice,
        remainingOil,
        type: oilType, // Explicitly set the oil type
        createdBy: user,
      });
  
      // Save the new oil stock entry
      const savedOilStock: any = await this.oilStockRepository.save(oilStock);
  
      return successResponse(savedOilStock, 'Oil stock transaction created successfully');
    } catch (error) {
      console.error('Error:', error);
      return errorResponse(
        'An error occurred while creating the oil stock transaction',
        500,
      );
    }
  }
  

  async getRemainingOil(): Promise<any> {
    try {
      const oilStockData = await this.oilStockRepository
        .createQueryBuilder('oilStock')
        .select('oilStock.type', 'type')
        .addSelect('oilStock.remainingOil', 'remainingOil')
        .where(`oilStock.createdAt IN (
          SELECT MAX(subOil.createdAt)
          FROM oil_stocks subOil
          WHERE subOil.type = oilStock.type
          GROUP BY subOil.type
        )`)
        .getRawMany();
  
      return {
        succeeded: true,
        data: oilStockData,
        message: 'Remaining oil for each type (from last transaction) fetched successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        succeeded: false,
        httpStatusCode: 500,
        message: 'An error occurred while fetching remaining oil data',
      };
    }
  }
  
  
  
}
