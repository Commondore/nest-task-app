import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserResponseDto } from './dto/reponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    const token = this.generateToken(user.id, user.name);

    return { token, user: new UserResponseDto(user) };
  }

  async login(dto: LoginDto) {
    const userWithPassword = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!userWithPassword) {
      throw new UnauthorizedException('Неверный email адресс');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      userWithPassword.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const token = this.generateToken(
      userWithPassword.id,
      userWithPassword.name,
    );

    return { token, user: new UserResponseDto(userWithPassword) };
  }

  private generateToken(userId: number, username: string): string {
    return this.jwtService.sign({ id: userId, name: username });
  }
}
