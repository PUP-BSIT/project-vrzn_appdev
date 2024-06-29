import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from './dto/signup-auth.dto';
import { verification } from './dto/verify.dto';
import { User } from '@prisma/client';

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

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<Object>{
    return await this.authService.getUser(+id);
  }

  @Post('update')
  async updateUser(
    @Body() body: { user: User; oldPhoneNumber: string; newPhoneNumber: string }
  ) {
    const { user, oldPhoneNumber, newPhoneNumber } = body;
    return await this.authService.updateUser(user, oldPhoneNumber, newPhoneNumber);
  }

  @Post('verify')
  sendMailer(@Body() verification: verification) {
    return this.authService.sendMail(verification);
  }
}
