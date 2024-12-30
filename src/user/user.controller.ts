import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, SignupDto } from './user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SkipJwt } from 'src/exclude-jwt.decorator';

@ApiTags('users')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @SkipJwt()
  async signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto);
  }

  @Post('login')
  @SkipJwt()
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
