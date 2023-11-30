import type { Actions, PageServerLoad } from './$types';
import { schema } from '$lib/zod/articles/new';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { path, addErrorToForm } from '$lib/server';
import { db } from '$lib/server/db';
import { articleFromTitleOrId } from '../../articleFromTitleOrId';

export const load = (async (event) => {
  // article を取り出して、必要なら最新版のページへ飛ぶ
  const { article, needRedirect } = await articleFromTitleOrId(event.params.titleOrId);
  if (needRedirect) {
    throw redirect(302, path(article) + '/edit');
  }

  const form = await superValidate(schema);
  form.data.title = article.title;
  form.data.body = article.body;
  return { form };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    // フォームデータのバリデーション
    const form = await superValidate(event, schema);

    const { article, needRedirect } = await articleFromTitleOrId(event.params.titleOrId);
    if (needRedirect) {
      form.message = '編集が衝突しました。最新版のページからやり直してください。';
      form.valid = false;
    }

    const pageWithSameTitle = await db.article.findFirst({
      where: { title: form.data.title, newRevisionId: null, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (pageWithSameTitle && pageWithSameTitle.id != article.id) {
      addErrorToForm(form, 'title', '既存のページと重複しています');
    }

    if (!form.valid) {
      return fail(400, { form });
    }

    if (form.data.title == article.title && form.data.body == article.body) {
      setFlash({ type: 'error', message: '何も変更されませんでした' }, event);
      throw redirect(302, event.url.toString().replace(/\/edit$/, ''));
    }

    // 記事を投稿して古い記事の newRevision に入れる
    // const newArticle = await db.article.create({
    //   data: {
    //     authorId: event.locals.session!.user.userId,
    //     oldRevision: article,
    //     ...form.data,
    //   }
    // });
    // oldRevision には代入できないみたいだ

    // これで良さそうなのだけれどなぜか新しくできた方の
    // newRevision に古い方が入ってしまう。えー。
    //
    // const oldArticle = await db.article.update({
    //   where: { id: article.id },
    //   data: {
    //     newRevision: {
    //       create: {
    //         authorId: event.locals.session!.user.userId,
    //         ...form.data,
    //       },
    //     },
    //   },
    //   include: { newRevision: true },
    // });

    // 仕方がないのでデータの整合性が失われる可能性のある書き方で我慢

    const newArticle = await db.article.create({
      data: {
        authorId: event.locals.session!.user.userId,
        ...form.data,
      },
    });

    await db.article.update({
      where: { id: article.id },
      data: { newRevisionId: newArticle.id },
    });

    setFlash({ type: 'success', message: '編集を反映しました' }, event);
    throw redirect(302, path(newArticle));
  },
} satisfies Actions;
