import { ApiProperty } from '@nestjs/swagger';

export type UserResponseDtoParams = {
  id: number;
  email: string;
  name: string;
};

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@test.kg' })
  email: string;

  @ApiProperty({ example: 'John' })
  name: string;

  constructor(user: UserResponseDtoParams) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
  }
}

export class AuthResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  constructor(user: UserResponseDtoParams) {
    this.success = true;
    this.user = new UserResponseDto(user);
  }
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  constructor() {
    this.success = true;
  }
}

export class CsrfResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  csrfToken: string;

  constructor(csrfToken: string) {
    this.csrfToken = csrfToken;
  }
}
