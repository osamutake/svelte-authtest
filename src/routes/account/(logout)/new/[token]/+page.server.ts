import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { schema } from '$lib/zod/account/new';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { path } from '$lib/server';
import { setFlash } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';

async function getEmail(event: PageServerLoadEvent | RequestEvent) {
  const record = await db.emailVerification.findUnique({ where: { id: event.params.token } });
  if (!record || Date.now() - 1000 * 60 * 60 * 2 > record.createdAt.getTime()) {
    // 見つからないあるいは古すぎる
    setFlash({ type: 'error', message: '無効なトークンです' }, event);
    throw redirect(302, path('/'));
  }
  return record.email;
}

export const load = (async (event) => {
  const form = await superValidate(schema);
  const email = await getEmail(event);
  return { form, email };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    // フォームデータのバリデーション
    const form = await superValidate(event, schema);
    const email = await getEmail(event);
    if (!form.valid) {
      return fail(400, { form, email });
    }

    // サインアップ処理
    try {
      const user = await auth.createUser({
        key: {
          providerId: 'email',
          providerUserId: email,
          password: form.data.password,
        },
        attributes: {
          name: form.data.name,
          email: email,
        },
      });

      // そのままログイン状態にする
      const session = await auth.createSession({ userId: user.userId, attributes: {} });
      event.locals.auth.setSession(session);
    } catch (e) {
      if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
        return fail(400, {
          form: { ...form, message: '名前またはメールアドレスが既存のアカウントと重複しています' },
          email,
        });
      }
      // provided user attributes violates database rules (e.g. unique constraint)
      // or unexpected database errors
      return fail(400, { form: { ...form, message: 'サインアップエラー' }, email });
    }

    // レコードを消去
    await db.emailVerification.delete({ where: { id: event.params.token } });

    setFlash({ type: 'success', message: 'サインアップ＆ログインしました' }, event);
    throw redirect(302, path('/'));
  },
};
