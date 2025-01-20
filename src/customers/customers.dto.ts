// customers.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiPropertyOptional({ example: "Barkat Hardware" })
  @IsString()
  shopName: string;

  @ApiPropertyOptional({ example: "Ali" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: "03200000000" })
  @IsString()
  phoneNumber: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: "Barkat Hardware" })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiPropertyOptional({ example: "Ali" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: "03210000000" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
