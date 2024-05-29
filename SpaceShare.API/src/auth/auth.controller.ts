import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from './dto/signup-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto): Promise<Object> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SignInDto): Promise<Object> {
    return this.authService.signin(dto);
  }

  @Get('signout')
  signout(): Promise<Object> {
    return this.authService.signout();
  }
}
