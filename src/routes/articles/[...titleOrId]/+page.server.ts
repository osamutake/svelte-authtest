import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { articleFromTitleOrId } from './articleFromTitleOrId';
import { path } from '../lib-server';

export const load = (async (event) => {
  const { article, needRedirect } = await articleFromTitleOrId(event.params.titleOrId);
  if (needRedirect) {
    throw redirect(302, path(article));
  }
  return { article };
}) satisfies PageServerLoad;
