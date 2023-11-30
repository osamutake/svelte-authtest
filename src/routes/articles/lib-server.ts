import type { Article, User } from '@prisma/client';
import { db } from '$lib/server/db';
import { path as stringPath } from '$lib/server';
import { encodeTitle } from './lib';

export function path(article: Article) {
  return stringPath('/articles/' + encodeTitle(article.title));
}

export async function getNewest(article: (Article & { author: User }) | number | null) {
  if (!article) {
    return null;
  }
  while (typeof article == 'number' || article?.newRevisionId) {
    article = await db.article.findUnique({
      where: {
        id: typeof article == 'number' ? article : article.newRevisionId!,
        deletedAt: null,
      },
      include: { author: true },
    });
  }
  return article;
}
