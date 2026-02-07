import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTaskDto {
  @IsString({ message: 'title должен быть строкой' })
  @MinLength(2, { message: 'title должен содержать минимум 2 символа' })
  @MaxLength(150, { message: 'title должен быть не более 150 символов' })
  title: string;

  @IsOptional()
  @IsBoolean({ message: 'completed должен быть boolean' })
  completed?: boolean;
}
