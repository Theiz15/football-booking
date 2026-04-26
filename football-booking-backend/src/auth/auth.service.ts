import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/request/Register.dto';
import { LoginDto } from './dto/request/login.dto';
import { User } from '../users/user.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_CODES } from 'src/common/constants/error-codes';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { fullName, phone , email, password } = registerDto;

    const existingUser = await this.usersService.findByPhone(phone);
    if (existingUser) {
      throw new BusinessException(
        ERROR_CODES.INVALID_CREDENTIALS,
        'Số điện thoại này đã được đăng ký!'
      );
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await this.usersService.create({
      fullName,
      phone,
      email,
      passwordHash,
      // role mặc định CUSTOMER sẽ được xử lý ở Entity
    });

    return this.generateToken(newUser);
  }

  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new BusinessException(
        ERROR_CODES.INVALID_CREDENTIALS,
        'Số điện thoại hoặc mật khẩu không đúng'
      );
    }

    const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatching) {
      throw new BusinessException(
        ERROR_CODES.INVALID_CREDENTIALS,
        'Số điện thoại hoặc mật khẩu không đúng'
      );
    }

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: user, 
    };
  }
}