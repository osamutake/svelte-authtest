// place files you want to import through the `$lib/server` alias in this folder.
import type { Article } from '@prisma/client';
import { db } from '$lib/server/db';

export const urlRoot = process.env['URL_ROOT'] || '';
export function path(relative: string | Article) {
  if (typeof relative == 'string') {
    return urlRoot + relative;
  } else {
    // if (Object.hasOwn(relative, 'newRevisionId')) {
    return urlRoot + '/articles/' + db.articleTitleEncode(relative.title);
  }
}

// superforms の form コントロールにエラーメッセージを追加する
// 使用例：formAddError(form, 'email', 'そのアドレスは使えません');
export function addErrorToForm<
  KEYS extends string,
  FORM extends {
    valid: boolean;
    errors: { [key in KEYS]?: string[] };
  },
>(f: FORM, item: KEYS, message: string) {
  f.errors[item] = [...(f.errors[item] || []), message];
  f.valid = false;
}
