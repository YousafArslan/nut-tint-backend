import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  customerId: number;

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
}

export class GetPendingPyamentDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  customerId?: number;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @ApiPropertyOptional({
    example: 'self',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  delivery?: boolean;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  pickUp?: boolean;

  @ApiPropertyOptional({
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class GetOrdersDto {
  @ApiProperty({
    description: 'Start date for the filter',
    type: String,
    required: false,
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for the filter',
    type: String,
    required: false,
    example: '2025-12-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Customer ID for filtering orders',
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  customerId?: number;
}
