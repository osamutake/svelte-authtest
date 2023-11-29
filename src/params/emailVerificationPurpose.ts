import type { ParamMatcher } from '@sveltejs/kit';

export const purposes = {
  new: 'サインアップ',
  reset: 'パスワードリセット',
  email: 'メールアドレス変更',
};

export const match: ParamMatcher = (param) => {
  return Object.hasOwn(purposes, param);
};
