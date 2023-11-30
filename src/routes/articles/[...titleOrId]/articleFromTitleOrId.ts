import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { getNewest } from '../lib-server';
import { decodeTitle } from '../lib';

export async function articleFromTitleOrId(titleOrId: string) {
  // 数値で指定なら該当記事にリダイレクト
  if (titleOrId.match(/^\d+$/)) {
    const article = await getNewest(Number(titleOrId));
    if (!article) throw error(404);
    return { article, needRedirect: true };
  }
  // タイトルで指定
  const article = await db.article.findFirst({
    where: {
      deletedAt: null,
      title: decodeTitle(titleOrId),
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: { author: true },
  });
  if (!article) throw error(404);

  // 最新版があればリダイレクト
  const newest = await getNewest(article);
  return { article: newest || article, needRedirect: newest?.id != article.id };
}
