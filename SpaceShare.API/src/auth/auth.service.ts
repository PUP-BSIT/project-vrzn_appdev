import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { verification } from './dto/verify.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { IsPhoneNumber } from 'class-validator';

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

  async sendMail(body: verification) {
    const email = await this.mailService.sendMail({
      to: body.mailTo,
      subject: 'SpaceShare Signup Verification',
      html: 
      `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
          <div style="border-bottom: 1px solid #eee; display: flex; align-items: center;">
            <img src="https://vrzn-spaceshare-dev.s3.ap-southeast-1.amazonaws.com/logo.png" style="width: 40px; height: 40px; margin-right: 10px;">
            <a href="" style="font-size: 1.4em; color: #8644a2; text-decoration: none; font-weight: 600;">SpaceShare</a>
          </div>
          <p style="font-size: 1.1em">Welcome!</p>
          <p>Thank you for signin up to <span style="font-weight:bold;color:#8644a2;">SpaceShare</span>! <br>Use the OTP below to complete your Sign-up process</p>
          <h2 style="background: #8644a2; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${body.code}</h2>
          <p style="font-size: 0.9em;">Regards,<br />SpaceShare Team</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
           <div style="float: left;padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
              <p>This is an automatic email please do not reply.</p>
           </div>
          <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
            <p>Team Verizon</p>
            <p>We care about details.</p>
          </div>
        </div>
      </div>`,
    });

    return email;
  }

  // #region helper functions
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
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
