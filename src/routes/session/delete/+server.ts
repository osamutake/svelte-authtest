import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { path } from '$lib';

export const GET: RequestHandler = async ({ locals }) => {
  // 読み出し済みセッション情報の無効化
  locals.auth.invalidate();

  // クッキーからセッションID削除
  locals.auth.setSession(null);

  throw redirect(302, path('/'));
};
