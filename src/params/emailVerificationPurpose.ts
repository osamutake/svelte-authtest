import type { ParamMatcher } from '@sveltejs/kit';

export const purposes = {
  new: 'サインアップ',
  reset: 'パスワードリセット',
};

export const match: ParamMatcher = (param) => {
  return Object.hasOwn(purposes, param);
};
