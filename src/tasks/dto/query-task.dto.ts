import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class QueryTaskDto {
  @IsOptional()
  @IsBoolean({ message: 'completed должен быть boolean' })
  completed?: boolean;

  @IsOptional()
  @IsInt({ message: 'page должен быть числом' })
  @Min(1, { message: 'Минимальное значение 1' })
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'limit должен быть числом' })
  @Min(1, { message: 'Минимальное значение 1' })
  limit?: number = 20;

  @IsOptional()
  @IsIn(['createdAt', 'title'], {
    message: 'sortBy должен содержать createdAt или title',
  })
  sortBy?: 'createdAt' | 'title' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'order должен содержать asc или desc',
  })
  order?: 'asc' | 'desc' = 'desc';
}
