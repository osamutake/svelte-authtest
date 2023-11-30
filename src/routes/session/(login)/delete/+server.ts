import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { path } from '$lib';
import { setFlash } from 'sveltekit-flash-message/server';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  // 読み出し済みセッション情報の無効化
  locals.auth.invalidate();

  // クッキーからセッションID削除
  locals.auth.setSession(null);

  setFlash({ type: 'success', message: 'ログアウトしました' }, cookies);
  throw redirect(302, path('/'));
};
