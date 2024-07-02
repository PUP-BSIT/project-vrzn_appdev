import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { verification } from './dto/verify.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { environment } from 'environment/app.settings';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  async signup(user: CreateUserDto) {
    const { email, password, phone_number } = user;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new BadRequestException('Email already exist');

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.prismaService.user.create({
      data: {
        ...user,
        email,
        password: hashedPassword,
        phone_number: {
          create: phone_number.map((number) => ({
            number: number.number,
            number_type: 'mobile',
          })),
        },
      },
      include: {
        phone_number: true,
      },
    });

    return {
      success: true,
      message: 'User sign up successful',
      user: createdUser,
    };
  }

  async signin(user: SignInDto, response: Response) {
    const { email, password } = user;

    const findUser = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!findUser) throw new BadRequestException('Wrong Credentials');

    const isMatch = await this.comparePassword(password, findUser.password);

    if (!isMatch) throw new BadRequestException('Wrong Credentials');

    const token = await this.signToken({
      id: findUser.id,
      email: findUser.email,
    });

    return response.send({
      success: true,
      message: 'Sign in successful',
      token: token,
      id: findUser.id,
    });
  }

  async signout(response: Response) {
    response.clearCookie('token');
    return response.send({ success: true, message: 'Sign Out Successful' });
  }

  async getUser(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        first_name: true,
        surname: true,
        email: true,
        birthdate: true,
        phone_number: {
          select: {
            number: true,
          },
        },
      },
    });
  }

  async updateUser(user: User, oldPhoneNumber: string, newPhoneNumber: string) {
    const formattedBirthdate = new Date(user.birthdate).toISOString();

    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        first_name: user.first_name,
        surname: user.surname,
        birthdate: formattedBirthdate,
        phone_number: {
          updateMany: {
            where: {
              number: oldPhoneNumber,
            },
            data: {
              number: newPhoneNumber,
            },
          },
        },
      },
    });
  }

  async changePassword(userId: number, currentPassword: string, newPassword) {
    const user = this.prismaService.user.findUnique({ where: { id: userId } });

    if (
      !user ||
      !(await this.comparePassword(currentPassword, (await user).password))
    ) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password change successful' };
  }

  async forgotPassword(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new BadRequestException('Email does not exist');

    const token = this.generateResetToken();
    const oneHour = 360000;

    await this.prismaService.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + oneHour),
      },
    });

    await this.sendResetPasswordMail(email, token);

    return {
      success: true,
      message: 'Reset password mail sent'
    }
  }

  async sendMail(body: verification) {
    const email = await this.mailService.sendMail({
      to: body.mailTo,
      subject: 'Get Started with Space Share 🚀',
      html: `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <style type="text/css">
                body, p, div {
                    font-family: 'Poppins', Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    color: #000;
                }
                body a {
                    color: #0074a6;
                    text-decoration: none;
                }
                p { margin: 0; padding: 0; }
                table.wrapper {
                    width: 100% !important;
                    table-layout: fixed;
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-size-adjust: 100%;
                    -moz-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
                img.max-width {
                    max-width: 100% !important;
                }
                .title { 
                    font-weight: bold;
                    font-size: 24px; 
                }
                .title span{
                    color: #8644a2;
                }
                .code-block {
                    background-color: #8644a2;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    display: inline-block;
                    padding: 16px 24px;
                    font-size: 18px; 
                    margin-top: 2rem;
                }
                .contact-text {
                    font-size: 12px; 
                }
                @media screen and (max-width:480px) {
                    table.wrapper-mobile {
                        width: 100% !important;
                        table-layout: fixed;
                    }
                    img.max-width {
                        height: auto !important;
                        max-width: 100% !important;
                    }
                    .columns, .column {
                        width: 100% !important;
                        display: block !important;
                    }
                }
            </style>
        </head>
        <body>
            <center class="wrapper" style="font-size: 14px; font-family: Arial, Helvetica, sans-serif; color: #000; background-color: #f6f7f8;">
                <div class="webkit">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f6f7f8">
                        <tr>
                            <td valign="top" bgcolor="#f6f7f8" width="100%">
                                <table width="100%" role="content-container" align="center" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="100%">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;" align="center">
                                                <tr>
                                                    <td style="padding: 0; color: #000; text-align: left;" bgcolor="#fff" width="100%" align="left">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td style="padding: 0;" height="20px" bgcolor="#8644a2"></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 15px 0 10px;" align="center">
                                                                    <img class="max-width" src="https://vrzn-spaceshare-dev.s3.ap-southeast-1.amazonaws.com/logo.png" alt="" width="60">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 18px;" align="center">
                                                                    <div class= "title" style="text-align: center;">
                                                                        📍 Welcome to <span>Space Share</span> 📍</span>
                                                                    </div>
                                                                    <div style="text-align: center; margin-top: 3rem;">
                                                                        Thank you for joining us on our mission to <strong>improve access to shared spaces</strong>, and empower everyday people with the tools to manage their spaces efficiently. 🚀
                                                                    </div>
                                                                    <div style="text-align: center; margin-top: 2rem;">
                                                                        You can set up your account now and access everything Space Share has to offer. Get started by verifying your email address with the OTP code:
                                                                    </div>
                                                                    <div style="text-align: center;">
                                                                        <div class="code-block">${body.code}</div>
                                                                    </div>
                                                                    <div style="text-align: center; margin-top: 2rem;">
                                                                        By joining Space Share, you’re one step closer to unlocking essential space management tools and resources. We're so excited to have you onboard!
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 10px 0;" align="center"></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 30px 50px; background-color: #f6f7f8;" align="center">
                                                                    <div style="text-align: center;">
                                                                        <span class="contact-text">Need a hand? 👋 </span>
                                                                    </div>
                                                                    <div style="text-align: center;">
                                                                        <span class="contact-text">If you have any questions or need help,</span>
                                                                    </div>
                                                                    <div style="text-align: center;">
                                                                        <span class="contact-text">you can reach us at <a href="mailto:support@spaceshare.site">support@spaceshare.site</a>.</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </center>
        </body>
        </html>
        `,
    });

    return email;
  }

  async sendResetPasswordMail(email: string, token: string){
    const sendMail = await this.mailService.sendMail({
      to: email,
      subject: 'Space Share Reset Password',
      html: `
        <p>follow this link to resetPassword:</p>

        <a href="${environment.originUrl}/auth/reset?$token=${token}">RESET PASSWORD</a>

        <p>This is team verizon</p>
      `,
    });

    return sendMail;
  }

  // #region helper functions
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private generateResetToken() {
    return randomBytes(20).toString('hex');
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async signToken(args: { id: number; email: string }) {
    const payload = args;
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
  // #endregion
}
