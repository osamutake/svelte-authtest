import type { Actions, PageServerLoad } from './$types';
import { schema } from '$lib/zod/session/new';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';

import { path } from '$lib/server';
import { auth } from '$lib/server/lucia';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async () => {
  const form = await superValidate(schema);
  return { form };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    // フォームデータのバリデーション
    const form = await superValidate(event, schema);
    if (!form.valid) {
      return fail(400, { form });
    }

    // ログイン処理
    try {
      const key = await auth.useKey('email', form.data.email, form.data.password);
      const session = await auth.createSession({ userId: key.userId, attributes: {} });
      event.locals.auth.setSession(session);
    } catch {
      return fail(400, { form: { ...form, message: 'ログインエラー' } });
    }

    setFlash({ type: 'success', message: 'ログインしました' }, event);
    throw redirect(302, path('/'));
  },
} satisfies Actions;
