import { z } from 'zod';
import { emailRegexp } from '../zod-emailRegexp';

export const schema = z.object({
  email: z.string().regex(emailRegexp, { message: 'メールアドレスが不正です' }),
});
