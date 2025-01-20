import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './user.entity';
import { LoginDto, SignupDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, role } = signupDto;
  
    // Check if the role is valid
    if (!Object.values(UserRole).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });
  
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token,payload };
  }
}
