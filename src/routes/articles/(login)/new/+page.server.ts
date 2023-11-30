import type { Actions, PageServerLoad } from './$types';
import { schema } from '../../zod-schema';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { addErrorToForm } from '$lib/server';
import { db } from '$lib/server/db';
import { path } from '../../lib-server';

export const load = (async () => {
  const form = await superValidate(schema);
  return { form };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    // フォームデータのバリデーション
    const form = await superValidate(event, schema);
    if (await db.article.findFirst({ where: { title: form.data.title } })) {
      addErrorToForm(form, 'title', '既存のページと重複しています');
    }
    if (!form.valid) {
      return fail(400, { form });
    }

    // 記事を投稿する
    const article = await db.article.create({
      data: {
        authorId: event.locals.session!.user.userId,
        ...form.data,
      },
    });

    setFlash({ type: 'success', message: '記事を投稿しました' }, event);
    throw redirect(302, path(article));
  },
} satisfies Actions;
