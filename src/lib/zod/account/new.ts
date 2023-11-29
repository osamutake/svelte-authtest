import { z, passwordAndConfirm } from '$lib/zod/lib/passwordAndConfirm';

export const schema = passwordAndConfirm({
  name: z.string().min(3, { message: 'ユーザー名は3文字以上で入力してください' }),
});
