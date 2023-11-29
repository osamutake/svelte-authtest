import type { Writable } from 'svelte/store';

function verifyPasswordSub(password: string, errors?: Writable<{ password?: string[] }>) {
  if (!password.match(/^$|^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)) {
    errors?.update((e) => {
      e.password = ['小文字・大文字・数字を一文字以上含めて8文字以上で入力してください'];
      return e;
    });
  } else {
    const method = 'POST';
    const body = JSON.stringify({ password });
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    };
    fetch('/password-rank', { method, headers, body })
      .then((res) => res.json())
      .then((rank) => {
        if (rank) {
          errors?.update((e) => {
            e.password = [`容易に推測可能なパスワードです (rank = ${rank})`];
            return e;
          });
        } else {
          errors?.update((e) => {
            e.password = undefined;
            return e;
          });
        }
      });
  }
}

let timer: NodeJS.Timeout;
export function verifyPassword(e: Event, errors?: Writable<{ password?: string[] }>) {
  console.log('ok');
  const password = (e.target as HTMLInputElement).value;
  if (password && password.length < 8) {
    errors?.update((e) => {
      e.password = ['小文字・大文字・数字を一文字以上含めて8文字以上で入力してください'];
      return e;
    });
    return;
  }

  // 一旦エラーをキャンセル
  errors?.update((e) => {
    e.password = undefined;
    return e;
  });

  // 設定待ちがあればキャンセル
  clearTimeout(timer);

  // 500 ms 後に設定
  timer = setTimeout(() => verifyPasswordSub(password, errors), 500);
}
