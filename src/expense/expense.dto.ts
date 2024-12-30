import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateExpenseDto {
    @ApiProperty({
      example: 'Office Supplies',
    })
    @IsString()
    description: string;
  
    @ApiProperty({
      example: 150.75,
    })
    @IsNumber()
    amount: number;
  
    @ApiProperty({
      example: '2024-11-30T14:30:00Z',
    })
    @IsOptional()
    @IsDateString()
    createdAt?: string; // Optional, defaults to current date if not provided
  }


  export class GetExpensesDto {
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
