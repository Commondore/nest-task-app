import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import type { JwtUser } from 'src/auth/types';
import { UserMeDto } from 'src/user/dto/user-me.dto';
import { UserService } from 'src/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@CurrentUser() user: JwtUser): Promise<UserMeDto> {
    return this.userService.getMe(user.userId);
  }
}
