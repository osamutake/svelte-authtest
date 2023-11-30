// place files you want to import through the `$lib` alias in this folder.
import { PUBLIC_URL_ROOT } from '$env/static/public';

export function path(relative: string) {
  return PUBLIC_URL_ROOT + relative;
}

export const appName = 'authtest';
export const appEmail = '"authtest system" <authtest@my.server.net>';
