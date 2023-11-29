import { loadFlash } from 'sveltekit-flash-message/server';
import { urlRoot } from '$lib/server';

export const load = loadFlash(async () => {
  const data = { urlRoot };
  return data;
});
