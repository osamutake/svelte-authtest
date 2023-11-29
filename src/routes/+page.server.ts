import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  return { user: locals.session?.user };
}) satisfies PageServerLoad;
