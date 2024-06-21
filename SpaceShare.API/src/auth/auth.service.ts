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
        phone_number: {
          select: {
            number: true,
          },
        },
      },
    });
  }

  async updateUser(user: User, oldPhoneNumber: string, newPhoneNumber: string) {
    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        first_name: user.first_name,
        surname: user.surname,
        birthdate: user.birthdate,
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
      text: `Welcome to SpaceShare! \nYour verification code is ${body.code}\nThis is an automatic email. Please do not reply.`,
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
