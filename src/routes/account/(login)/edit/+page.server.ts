import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { schema } from '$lib/zod/account/edit';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import { auth } from '$lib/server/lucia';
import { db } from '$lib/server/db';

async function getUser(event: PageServerLoadEvent | RequestEvent) {
  const session = await event.locals.auth.validate();
  return session!.user;
}

export const load = (async (event) => {
  const form = await superValidate(schema);
  const user = await getUser(event);
  form.data.name = user.name;
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

    const changed = [] as string[];
    if (form.data.name != user.name) {
      await db.user.update({ where: { id: user.userId }, data: { name: form.data.name } });
      changed.push('名前');
    }
    if (form.data.password) {
      await auth.updateKeyPassword('email', user.email, form.data.password);
      changed.push('パスワード');
    }

    let message: string;
    if (changed.length == 0) {
      message = '何も変更されませんでした';
    } else {
      message = changed.join('と') + 'が変更されました';
    }
    throw redirect(302, '/', { type: 'success', message }, event);
  },
} satisfies Actions;
