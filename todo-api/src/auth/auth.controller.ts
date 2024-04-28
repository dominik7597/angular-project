import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/DTO/register.dto';
import { LoginDto } from 'src/DTO/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) regDto: RegisterDto) {
    return this.authService.register(regDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) logDto: LoginDto) {
    return this.authService.login(logDto);
  }
}
