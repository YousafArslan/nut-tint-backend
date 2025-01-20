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

  async getAllOilStocks(getOilStockDto : GetOilStockDto) : Promise<any> {
    try {
    const { startDate, endDate } = getOilStockDto;

      const oilStocks : any = await this.oilStockRepository.find({
        where: {
          createdAt: Between(new Date(startDate), new Date(endDate)),
        },
        relations: ['createdBy'], // Include related user data
      });
      return successResponse(oilStocks, 'Oil transactions fetched successfully');
    } catch (error) {
      console.error(error);
      return {
        succeeded: false,
        httpStatusCode: 500,
        message: 'An error occurred while fetching oil transactions',
      };
    }
  }

  async createOilStock(createOilStockDto: CreateOilStockDto, user: User): Promise<any> {
    try {
      const oilPurchased = createOilStockDto.oilPurchased || 0;
      const oilUsed = createOilStockDto.oilUsed || 0;
      const purchasePrice = createOilStockDto.purchasePrice || 0; // Default to 0 if not provided
  
      // Fetch the latest entry for the same oil type
      const lastOilStock = await this.oilStockRepository.findOne({
        where: { type: createOilStockDto.oilType as OilType },
        order: { createdAt: 'DESC' },
      });
  
      // Calculate the new remaining oil
      const remainingOil = (lastOilStock ? lastOilStock.remainingOil : 0) + oilPurchased - oilUsed;
  
      if (remainingOil < 0) {
        return {
          succeeded: false,
          httpStatusCode: 400,
          message: 'Not enough oil available to fulfill the request',
        };
      }
  
      // Create a new oil stock entry
      const oilStock = this.oilStockRepository.create({
        ...createOilStockDto,
        oilPurchased,
        oilUsed,
        purchasePrice, // Ensure purchasePrice is set
        remainingOil,
        createdBy: user,
      });
  
      // Save the new oil stock entry
      const savedOilStock : any = await this.oilStockRepository.save(oilStock);
  
      return successResponse(savedOilStock, 'Oil stock transaction created successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An error occurred while creating the oil stock transaction',
        500,
      );
    }
  }
}
