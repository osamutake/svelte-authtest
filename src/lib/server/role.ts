import { db } from '$lib/server/db';

// userId が undefined なら権限は空とみなされる
export async function getRoles(userId: string | undefined) {
  if (!userId) {
    return [];
  }
  return (
    (
      await db.user.findUnique({
        where: { id: userId },
        select: { roles: true },
      })
    )?.roles || []
  );
}

export async function getRolesString(userId: string | undefined) {
  return (await getRoles(userId)).map((role) => role.name);
}

export async function hasRole(userId: string | undefined, role: string) {
  return (await getRolesString(userId)).includes(role);
}

export async function addRoles(userId: string, ...roles: string[]) {
  await db.user.update({
    where: { id: userId },
    data: {
      roles: {
        connectOrCreate: roles.map((role) => ({ where: { name: role }, create: { name: role } })),
      },
    },
  });
}

export async function removeRoles(userId: string, ...roles: string[]) {
  await db.user.update({
    where: { id: userId },
    data: {
      roles: {
        deleteMany: roles.map((role) => ({ name: role })),
      },
    },
  });
}
