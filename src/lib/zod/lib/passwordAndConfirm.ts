import { z } from 'zod';
import { db } from '$lib/server/db';

export { z };
export function passwordAndConfirm<KEYS extends string>(
  additional: {
    [key in KEYS]: z.ZodSchema;
  },
  allowEmpty = false
) {
  return z
    .object({
      ...additional,
      password: z
        .string()
        .regex(
          new RegExp(`${allowEmpty ? '^$|' : ''}^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$`),
          {
            message:
              'パスワードは小文字・大文字・数字を一文字以上含めて8文字以上で入力してください',
          }
        ),
      confirm: z.string(),
    })
    .refine(({ password, confirm }) => password === confirm, {
      message: '確認用パスワードが一致しません',
      path: ['confirm'],
    })
    .superRefine(async (data, ctx) => {
      const record = await db.worstPassword.findUnique({
        where: { value: (data.password as object).toString().toLocaleLowerCase() },
        select: { rank: true },
      });
      if (record) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `容易に推測可能なパスワードです (rank = ${record.rank})`,
          fatal: true,
          path: ['password'],
        });
        return z.NEVER;
      }
    });
}
