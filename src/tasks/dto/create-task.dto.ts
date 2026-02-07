import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Тестовая задача', minLength: 2, maxLength: 150 })
  @IsString({ message: 'title должен быть строкой' })
  @MinLength(2, { message: 'title должен содержать минимум 2 символа' })
  @MaxLength(150, { message: 'title должен быть не более 150 символов' })
  title: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean({ message: 'completed должен быть boolean' })
  completed?: boolean;

  @ApiProperty({ example: 1, description: 'Id пользователя' })
  @IsInt({ message: 'userId должен быть числом' })
  userId: number;
}
