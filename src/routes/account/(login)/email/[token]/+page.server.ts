import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { path } from '$lib';

async function getEmailAndUser(event: PageServerLoadEvent | RequestEvent) {
  const record = await db.emailVerification.findUnique({ where: { id: event.params.token } });
  if (!record || Date.now() - 1000 * 60 * 60 * 2 > record.createdAt.getTime()) {
    setFlash({ type: 'error', message: '無効なトークンです' }, event);
    throw redirect(302, path('/'));
  }

  const session = await event.locals.auth.validate();
  if (!session?.user) {
    setFlash({ type: 'error', message: '旧メールアドレスでログインしてください' }, event);
    throw redirect(302, path('/session/new'));
  }

  return { email: record.email, user: session.user };
}

export const load = (async (event) => {
  return await getEmailAndUser(event);
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    const { email, user } = await getEmailAndUser(event);

    // メールアドレスを変更
    await db.$transaction([
      db.user.update({
        where: { id: user.userId },
        data: { email },
      }),
      db.authKey.update({
        where: { id: `email:${user.email}`, user_id: user.userId },
        data: { id: `email:${email}` },
      }),
    ]);

    // レコードを消去
    await db.emailVerification.delete({ where: { id: event.params.token } });

    setFlash({ type: 'success', message: 'メールアドレスを変更しました' }, event);
    throw redirect(302, path('/'));
  },
} satisfies Actions;
