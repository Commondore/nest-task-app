import type { Role } from 'src/generated/prisma/enums';

type UserMeDtoParams = {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
};

export class UserMeDto {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;

  constructor(user: UserMeDtoParams) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }
}
