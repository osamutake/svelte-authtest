import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { db } from '$lib/server/db';

export const auth = lucia({
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  adapter: prisma(db, {
    user: 'user',
    key: 'authKey',
    session: 'session',
  }),
  getUserAttributes: (data) => {
    return {
      // IMPORTANT!!!!
      // `userId` included by default!!
      name: data.name,
      email: data.email,
    };
  },
});

export type Auth = typeof auth;
