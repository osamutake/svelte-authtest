import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { path } from '$lib/server';
import { articleFromTitleOrId } from './articleFromTitleOrId';

export const load = (async (event) => {
  const { article, needRedirect } = await articleFromTitleOrId(event.params.titleOrId);
  if (needRedirect) {
    throw redirect(302, path(article));
  }
  return { article };
}) satisfies PageServerLoad;
