import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { path } from '$lib/server';

import { db } from '$lib/server/db';

export const load = (async (event) => {
  if (event.params.titleOrId.match(/^\d+$/)) {
    // 数値で指定なら該当記事にリダイレクト
    const article = await db.newestArticle(Number(event.params.titleOrId));
    if (!article) throw error(404);
    throw redirect(302, path(article));
  }
  // タイトルで指定
  const article = await db.article.findFirst({
    where: {
      deletedAt: null,
      title: decodeURI(event.params.titleOrId),
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: { author: true },
  });
  if (!article) throw error(404);

  // 最新版があればリダイレクト
  const newest = await db.newestArticle(article);
  if (newest?.id != article.id) {
    throw redirect(302, path(newest!));
  }
  return { article };
}) satisfies PageServerLoad;
