import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { schema } from './zod-schema';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { auth } from '$lib/server/lucia';
import { db } from '$lib/server/db';
import { path } from '$lib';

async function getUser(event: PageServerLoadEvent | RequestEvent) {
  const record = await db.emailVerification.findUnique({ where: { id: event.params.token } });
  if (!record || Date.now() - 1000 * 60 * 60 * 2 > record.createdAt.getTime()) {
    setFlash({ type: 'error', message: '無効なトークンです' }, event);
    throw redirect(302, path('/'));
  }

  const user = await db.user.findUnique({ where: { email: record.email } });
  if (!user) {
    setFlash({ type: 'error', message: '無効なトークンです' }, event);
    throw redirect(302, path('/'));
  }
  return user;
}

export const load = (async (event) => {
  const form = await superValidate(schema);
  const user = await getUser(event);
  return { form, user };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    // フォームデータのバリデーション
    const form = await superValidate(event, schema);
    const user = await getUser(event);
    if (!form.valid) {
      return fail(400, { form, user });
    }
    // パスワードを変更
    await auth.updateKeyPassword('email', user.email, form.data.password);

    // 直接ログインする
    const session = await auth.createSession({ userId: user.id, attributes: {} });
    event.locals.auth.setSession(session);

    // レコードを消去
    await db.emailVerification.delete({ where: { id: event.params.token } });

    setFlash({ type: 'success', message: 'パスワードを変更してログインしました' }, event);
    throw redirect(302, path('/'));
  },
} satisfies Actions;
