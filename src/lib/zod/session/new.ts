import { z } from 'zod';

export const schema = z.object({
  email: z.string().min(1, 'メールアドレスを入力して下さい'),
  password: z.string().min(1, 'パスワードを入力して下さい'),
});
