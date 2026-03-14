import type { Role } from 'src/generated/prisma/enums';

export type JwtUser = {
  userId: number;
  role: Role;
};
