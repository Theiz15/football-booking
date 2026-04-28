import { Controller, Post, Body, HttpCode, HttpStatus ,ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { LoginDto } from './dto/request/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/request/Register.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public() 
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<ApiResponseDto<null>> {
        await this.authService.register(registerDto);
        return new ApiResponseDto(
            'Đăng ký tài khoản thành công!'
        );
    }

    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const data = await this.authService.login(loginDto);

        return new ApiResponseDto(
            'Đăng nhập thành công',
            data
        );
    }
}
