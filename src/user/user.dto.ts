import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example:"abc@gmail.com" })
  @IsString()
  email: string;

  @ApiProperty({ example:"********" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example:UserRole.ADMIN })
  @IsEnum(UserRole, {
    message: 'Role must be one of admin, manager, or employee',
  })
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({ example:"abc@gmail.com" })
  @IsString()
  email: string;

  @ApiProperty({ example:"********" })
  @IsString()
  password: string;
}
