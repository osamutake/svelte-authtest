import type { Actions, PageServerLoad } from './$types';
import { schema } from '$lib/zod/account/new';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

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

    // TODO: サインアップ処理をここに

    return { form };
  },
};
