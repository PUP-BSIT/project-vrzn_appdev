import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from './dto/signup-auth.dto';
import { verification } from './dto/verify.dto';
import { User } from '@prisma/client';
import { ChangePassword } from './dto/change.password.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<Object> {
    return await this.authService.signup(dto);
  }

  @Post('signin')
  async signin(@Body() dto: SignInDto, @Res() response): Promise<Object> {
    return await this.authService.signin(dto, response);
  }

  @Get('signout')
  async signout(@Res() response): Promise<Object> {
    return await this.authService.signout(response);
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
  async sendMailer(@Body() verification: verification) {
    return await this.authService.sendMail(verification);
  }

  @Post('forgot')
  async forgotPassword(@Body() mail : { email: string}){
    return await this.authService.forgotPassword(mail.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('password/change')
  async changePassword(@Body() changePassword: ChangePassword){
    const { userId, currentPassword, newPassword } = changePassword;
    return await this.authService.changePassword(userId, currentPassword, newPassword);
  }
}
