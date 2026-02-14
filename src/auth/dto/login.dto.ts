import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@test.kg' })
  @IsEmail({}, { message: 'Укажите правильный email адрес' })
  email: string;

  @ApiProperty({ example: 'qwerty123' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  password: string;
}
