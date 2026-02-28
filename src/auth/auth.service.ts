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
import { ConfigService } from '@nestjs/config';
import { Role } from '../generated/prisma/enums';
import { User } from '../generated/prisma/client';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthJwtPayload = {
  sub: User['id'];
  name: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
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

    const tokens = this.generateTokens(user);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
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

    const tokens = this.generateTokens(userWithPassword);

    await this.saveRefreshToken(userWithPassword.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    const payload = this.verifyRefreshToken(refreshToken);
    const userId = payload.sub;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Доступ запрещен');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Доступ запрещен не валидный токен');
    }

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  private generateToken(userId: number, username: string, role: Role): string {
    return this.jwtService.sign(
      { sub: userId, name: username, role },
      { expiresIn: '20m' },
    );
  }

  private generateRefreshToken(userId: number, username: string, role: Role) {
    return this.jwtService.sign(
      { sub: userId, name: username, role },
      {
        expiresIn: '7d',
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );
  }

  private generateTokens(user: Pick<User, 'id' | 'name' | 'role'>): Tokens {
    const accessToken = this.generateToken(user.id, user.name, user.role);
    const refreshToken = this.generateRefreshToken(
      user.id,
      user.name,
      user.role,
    );

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(
    userId: User['id'],
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  private verifyRefreshToken(refreshToken: string): AuthJwtPayload {
    try {
      return this.jwtService.verify<AuthJwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Недействительный refresh token');
    }
  }
}
