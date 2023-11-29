import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function POST({ request }) {
  const { password } = await request.json();
  const record = await db.worstPassword.findUnique({
    where: { value: password },
    select: { rank: true },
  });
  if (record) {
    return json(record.rank + 1);
  }
  return json(0);
}
