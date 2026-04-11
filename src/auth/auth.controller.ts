import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, type Tokens } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import type { CookieOptions, Request, Response } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';
import { randomUUID } from 'crypto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthResponseDto,
  CsrfResponseDto,
  SuccessResponseDto,
} from 'src/auth/dto/response.dto';

const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 20;
const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'Пользователь зарегистрирован',
    type: AuthResponseDto,
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResult = await this.authService.register(dto);
    this.setAuthCookies(res, authResult);

    return new AuthResponseDto(authResult.user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Пользователь авторизован',
    type: AuthResponseDto,
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResult = await this.authService.login(dto);
    this.setAuthCookies(res, authResult);

    return new AuthResponseDto(authResult.user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Пользователь вышел из системы',
    type: SuccessResponseDto,
  })
  logout(@Res({ passthrough: true }) res: Response): SuccessResponseDto {
    this.clearAuthCookies(res);
    return new SuccessResponseDto();
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Токены обновлены',
    type: SuccessResponseDto,
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponseDto> {
    const refreshToken = this.getCookieValue(req, this.getRefreshCookieName());

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refresh(refreshToken);
    this.setAuthCookies(res, tokens);

    return new SuccessResponseDto();
  }

  @Get('csrf')
  @ApiOkResponse({
    description: 'CSRF token',
    type: CsrfResponseDto,
  })
  getCsrf(@Res({ passthrough: true }) res: Response): CsrfResponseDto {
    const token = randomUUID();

    res.cookie('csrf_token', token, this.getCsrfCookieOptions());

    return new CsrfResponseDto(token);
  }

  private setAuthCookies(res: Response, tokens: Tokens): void {
    const cookieOptions = this.getCookieOptions();

    res.cookie(this.getAccessCookieName(), tokens.accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie(this.getRefreshCookieName(), tokens.refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  private clearAuthCookies(res: Response): void {
    const cookieOptions = this.getCookieOptions();

    res.clearCookie(this.getAccessCookieName(), cookieOptions);
    res.clearCookie(this.getRefreshCookieName(), cookieOptions);
  }

  private getCookieOptions(): CookieOptions {
    const sameSite = this.config.get<string>('COOKIE_SAME_SITE');

    return {
      httpOnly: true,
      secure: this.config.get<string>('COOKIE_SECURE') === 'true',
      sameSite: sameSite === 'strict' || sameSite === 'none' ? sameSite : 'lax',
    };
  }

  private getCsrfCookieOptions(): CookieOptions {
    const sameSite = this.config.get<string>('COOKIE_SAME_SITE');

    return {
      httpOnly: false,
      secure: this.config.get<string>('COOKIE_SECURE') === 'true',
      sameSite: sameSite === 'strict' || sameSite === 'none' ? sameSite : 'lax',
      maxAge: 1000 * 60 * 60,
    };
  }

  private getAccessCookieName(): string {
    return (
      this.config.get<string>('COOKIE_ACCESS_NAME') ??
      this.config.get<string>('COOKIE_NAME') ??
      'access_token'
    );
  }

  private getRefreshCookieName(): string {
    return this.config.get<string>('COOKIE_REFRESH_NAME') ?? 'refresh_token';
  }

  private getCookieValue(req: Request, cookieName: string): string | undefined {
    const cookies: unknown = req.cookies;

    if (!cookies || typeof cookies !== 'object') {
      return undefined;
    }

    const value = (cookies as Record<string, unknown>)[cookieName];
    return typeof value === 'string' ? value : undefined;
  }
}
