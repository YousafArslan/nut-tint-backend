import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Barkat HW',
  })
  @IsString()
  source: string;

  @ApiProperty({
    example: 'self',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  delivery: boolean;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  pickUp: boolean;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  cashIn: number;

  @ApiProperty({
    example: 50,
  })
  @IsNumber()
  balance: number;
}


export class GetOrdersDto {
    @ApiProperty({
      description: 'Start date for the filter',
      type: String,
      required: false,
      example: '2024-11-01T00:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;
  
    @ApiProperty({
      description: 'End date for the filter',
      type: String,
      required: false,
      example: '2024-11-30T23:59:59Z',
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
  }
