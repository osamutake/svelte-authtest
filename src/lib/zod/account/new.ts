import { z } from 'zod';

// メールアドレスを表す現実的な正規表現 by @sakuro
// https://qiita.com/sakuro/items/1eaa307609ceaaf51123
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const schema = z
  .object({
    name: z.string().min(3, { message: 'ユーザー名は3文字以上で入力してください' }),
    email: z.string().regex(emailRegexp, { message: 'メールアドレスが不正です' }),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
      message: 'パスワードは小文字・大文字・数字を一文字以上含めて8文字以上で入力してください',
    }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: '確認用パスワードが一致しません',
    path: ['confirm'],
  });
