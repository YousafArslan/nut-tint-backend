import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: 'Barkat HW',
  })
  @IsOptional()
  @IsString()
  source?: string;

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

  @ApiPropertyOptional({
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  cashIn?: number;

  @ApiPropertyOptional({
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  balance?: number;
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
      example: '2025-12-30T23:59:59Z',
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
  }
