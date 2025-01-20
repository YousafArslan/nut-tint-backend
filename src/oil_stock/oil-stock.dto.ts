import {
  IsString,
  IsDateString,
  Min,
  IsOptional,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OilType {
  BLACK = 'black',
  TYRE = 'tyre',
}

export function IsValidOilTransaction(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidOilTransaction',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const { oilPurchased, purchasePrice, oilUsed } = args.object as any;

          // If oilUsed is present, oilPurchased and purchasePrice must be absent
          if (oilUsed !== undefined) {
            return oilPurchased === undefined && purchasePrice === undefined;
          }

          // If oilPurchased or purchasePrice is present, oilUsed must be absent
          if (oilPurchased !== undefined || purchasePrice !== undefined) {
            return oilUsed === undefined;
          }

          // If none of the fields are provided, it's invalid
          return false;
        },

        defaultMessage(args: ValidationArguments) {
          return `Either 'oilPurchased' and 'purchasePrice' OR 'oilUsed' must be provided, but not both.`;
        },
      },
    });
  };
}
export class GetOilStockDto {
  @ApiProperty({ example: '2024-12-01' })
  @IsString()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-30' })
  @IsString()
  @IsDateString()
  endDate: string;
}

export class CreateOilStockDto {
  @ApiPropertyOptional({ example: 100.0 })
  @IsOptional()
  @Min(0)
  oilPurchased?: number;

  @ApiPropertyOptional({ example: 20.0 })
  @IsOptional()
  @Min(0)
  oilUsed?: number;

  @ApiPropertyOptional({ example: 50.0 })
  @IsOptional()
  @Min(0)
  purchasePrice?: number;

  @ApiProperty({ example: OilType.BLACK })
  @IsString()
  oilType: OilType;

  @IsValidOilTransaction({
    message:
      "Either 'oilPurchased' and 'purchasePrice' OR 'oilUsed' must be provided, but not both.",
  })
  validateTransaction: boolean; // Dummy field for validation
}
