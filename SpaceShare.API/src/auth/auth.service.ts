import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SignInDto } from './dto/signin-auth.dto';
import { CreateUserDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

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

    return { message: 'User sign up successful', user: createdUser };
  }

  async signin(user: SignInDto) {
    const { email, password } = user;

    const findUser = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!findUser) throw new BadRequestException('Wrong Credentials');

    const isMatch = await this.comparePassword({
        password: password,
        hash: findUser.password
    });

    if (!isMatch) throw new BadRequestException('Wrong Credentials');

    return { message: 'User Signin Sucessful' };

  }

  async signout() {
    return { message: 'User Signout Sucessful' };
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(args: { password: string, hash: string }){
    return await bcrypt.compare(args.password, args.hash);
  }
}
