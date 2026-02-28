import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import type { Response } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import {
  CurrentUser,
  type JwtUser,
} from 'src/auth/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(dto);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 20,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 7,
    });

    return { success: true };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 20,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 7,
    });

    return { success: true };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): { success: true } {
    res.clearCookie('access_token');
    return { success: true };
  }

  // @UseGuards(JwtGuard)
  // @Get('me')
  // me(@CurrentUser() user: JwtUser) {
  //   return user;
  // }
}
