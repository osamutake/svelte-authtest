// place files you want to import through the `$lib` alias in this folder.

export const urlRoot = process.env['URL_ROOT'] || '';
export function path(relative: string) {
  return urlRoot + relative;
}
