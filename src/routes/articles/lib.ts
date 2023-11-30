export function encodeTitle(title: string) {
  return title
    .split('/')
    .map((str) => encodeURIComponent(str).replaceAll('%20', '+'))
    .join('/');
}

export function decodeTitle(encoded: string) {
  return encoded
    .split('/')
    .map((str) => decodeURIComponent(str.replaceAll('+', '%20')))
    .join('/');
}
