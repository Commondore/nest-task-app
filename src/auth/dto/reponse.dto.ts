import { User } from 'src/generated/prisma/client';

export class UserResponseDto {
  id: number;
  email: string;
  name: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
  }
}
