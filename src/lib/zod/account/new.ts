import { z } from 'zod';

export const schema = z
  .object({
    name: z.string().min(3, { message: 'ユーザー名は3文字以上で入力してください' }),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
      message: 'パスワードは小文字・大文字・数字を一文字以上含めて8文字以上で入力してください',
    }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: '確認用パスワードが一致しません',
    path: ['confirm'],
  });
