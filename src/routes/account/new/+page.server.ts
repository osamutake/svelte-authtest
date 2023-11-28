import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  default: async () => {
    return fail(405, { message: 'サインアップ処理が未実装' });
  },
};
