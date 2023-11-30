import { z } from 'zod';

export const schema = z.object({
  title: z.string().regex(/[^0-9]/, {
    message: 'タイトルが空あるいは数値のページは作成できません',
  }),
  body: z.string(),
});
