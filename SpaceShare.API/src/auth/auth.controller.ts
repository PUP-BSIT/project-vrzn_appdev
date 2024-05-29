import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
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
  signin(@Body() dto: SignInDto, @Res() response): Promise<Object> {
    return this.authService.signin(dto, response);
  }

  @Get('signout')
  signout(@Res() response): Promise<Object> {
    return this.authService.signout(response);
  }
}