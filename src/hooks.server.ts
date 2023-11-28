import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { path } from '$lib';

const authHandler: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  event.locals.session = await event.locals.auth.validate();

  if (event.route.id?.match(/\/\(login\)\//) && !event.locals.session?.user) {
    throw redirect(302, path('/session/new'));
  }

  if (event.route.id?.match(/\/\(logout\)\//) && event.locals.session?.user) {
    throw redirect(302, path('/'));
  }

  return await resolve(event);
};

export const handle = sequence(authHandler);
