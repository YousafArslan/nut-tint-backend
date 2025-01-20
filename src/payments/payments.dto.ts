import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 500.0 })
  @IsNumber()
  @IsNotEmpty()
  cashIn: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  orderId: number; // The ID of the order this payment is associated with
}


export class GetPaymentsDto {
  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}


export class UpdatePaymentDto {
  @ApiPropertyOptional({ example: 500.0 })
  @IsOptional()
  @IsNumber()
  cashIn?: number;

  @ApiPropertyOptional({ example: 1000.0 })
  @IsOptional()
  @IsNumber()
  remainingAmount?: number;
}
