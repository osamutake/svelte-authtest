import { z } from 'zod';

export { z };
export function passwordAndConfirm<KEYS extends string>(additional: {
  [key in KEYS]: z.ZodSchema;
}) {
  return z
    .object({
      ...additional,
      password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
        message: 'パスワードは小文字・大文字・数字を一文字以上含めて8文字以上で入力してください',
      }),
      confirm: z.string(),
    })
    .refine(({ password, confirm }) => password === confirm, {
      message: '確認用パスワードが一致しません',
      path: ['confirm'],
    });
}
