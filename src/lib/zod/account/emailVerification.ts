import { z } from 'zod';
import { emailRegexp } from '$lib/zod/lib/emailRegexp';

export const schema = z.object({
  email: z.string().regex(emailRegexp, { message: 'メールアドレスが不正です' }),
});
