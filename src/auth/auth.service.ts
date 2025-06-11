import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
      },
    });

    return {
      message: 'Пользователь зарегистрирован',
      user,
    };
  }

  async googleLogin(userData: { email: string; name: string; avatar: string }) {
    const user = await this.prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
      },
    });

    const payload = { email: user.email, sub: user.id, avatar: user.avatar };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }
}
