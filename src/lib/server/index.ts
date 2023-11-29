// place files you want to import through the `$lib/server` alias in this folder.

export const urlRoot = process.env['URL_ROOT'] || '';
export function path(relative: string) {
  return urlRoot + relative;
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
