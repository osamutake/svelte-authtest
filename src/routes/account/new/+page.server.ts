import type { Actions, PageServerLoad } from './$types';
import { schema } from '$lib/zod/account/new';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { path } from '$lib';

export const load = (async () => {
  const form = await superValidate(schema);
  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    // フォームデータのバリデーション
    const form = await superValidate(event, schema);
    if (!form.valid) {
      return fail(400, { form });
    }

    // サインアップ処理
    try {
      const user = await auth.createUser({
        key: {
          providerId: 'email',
          providerUserId: form.data.email,
          password: form.data.password,
        },
        attributes: {
          name: form.data.name,
          email: form.data.email,
        },
      });

      // そのままログイン状態にする
      const session = await auth.createSession({ userId: user.userId, attributes: {} });
      event.locals.auth.setSession(session);
    } catch (e) {
      if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
        return fail(400, {
          form: { ...form, message: '名前またはメールアドレスが既存のアカウントと重複しています' },
        });
      }
      // provided user attributes violates database rules (e.g. unique constraint)
      // or unexpected database errors
      return fail(400, { form: { ...form, message: 'サインアップエラー' } });
    }

    throw redirect(302, path('/'));
  },
};
