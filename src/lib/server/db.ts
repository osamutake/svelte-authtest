import { PrismaClient } from '@prisma/client';

export class ExtendedPrismaClient extends PrismaClient {
  constructor() {
    super();
  }

  // userId が undefined なら権限は空とみなされる
  async getRoles(userId: string | undefined) {
    if (!userId) {
      return [];
    }
    return (
      (
        await this.user.findUnique({
          where: { id: userId },
          select: { roles: true },
        })
      )?.roles || []
    );
  }

  async getRolesString(userId: string | undefined) {
    return (await this.getRoles(userId)).map((role) => role.name);
  }

  async hasRole(userId: string | undefined, role: string) {
    return (await this.getRolesString(userId)).includes(role);
  }

  async addRoles(userId: string, ...roles: string[]) {
    await this.user.update({
      where: { id: userId },
      data: {
        roles: {
          connectOrCreate: roles.map((role) => ({ where: { name: role }, create: { name: role } })),
        },
      },
    });
  }

  async removeRoles(userId: string, ...roles: string[]) {
    await this.user.update({
      where: { id: userId },
      data: {
        roles: {
          deleteMany: roles.map((role) => ({ name: role })),
        },
      },
    });
  }
}

export const db = new ExtendedPrismaClient();
