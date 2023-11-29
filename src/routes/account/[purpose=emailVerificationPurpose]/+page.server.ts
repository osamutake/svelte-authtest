import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { schema } from '$lib/zod/account/emailVerification';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { purposes } from '$params/emailVerificationPurpose';
import { path } from '$lib/server';
import { db } from '$lib/server/db';
import { transporter } from '$lib/server/transporter';
import { appName, appEmail } from '$lib';
import { addErrorToForm } from '$lib/server';

function getPurpose(event: PageServerLoadEvent | RequestEvent) {
  const purpose = event.params.purpose as keyof typeof purposes;
  if ((purpose == 'email') !== !!event.locals.session?.user) {
    setFlash({ type: 'error', message: 'ログイン状態が無効です' }, event);
    throw redirect(302, path('/'));
  }
  return purpose;
}

export const load = (async (event) => {
  const form = await superValidate(schema);
  const purpose = getPurpose(event);
  return { form, purpose };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    // フォームデータのバリデーション
    const form = await superValidate(event, schema);
    const purpose = getPurpose(event);

    // パスワードリセットは既存のアカウントがなければエラー
    if (purpose == 'reset') {
      if (!(await db.user.findUnique({ where: { email: form.data.email } }))) {
        addErrorToForm(form, 'email', '登録されていません');
      }
    }

    // メールアドレス変更は既存のアカウントがあければエラー
    if (purpose == 'email') {
      if (await db.user.findUnique({ where: { email: form.data.email } })) {
        form.errors.email = [...(form.errors.email || []), '既存のアカウントと重複しています'];
        form.valid = false;
      }
    }

    if (!form.valid) {
      return fail(400, { form, purpose });
    }

    // emailVerification レコードが既に存在するか？
    const existing = await db.emailVerification.findUnique({ where: { email: form.data.email } });
    if (existing) {
      // ２時間以内に送っていればエラーにする
      if (existing.createdAt.getTime() > Date.now() - 1000 * 60 * 60 * 2) {
        setFlash(
          {
            type: 'error',
            message: '先ほどメールを送信しましたのでしばらく経ってから試してください',
          },
          event
        );
        throw redirect(302, path('/'));
      }

      // 既存のものを削除
      await db.emailVerification.delete({ where: { email: form.data.email } });
    }

    // レコードを作成する
    const record = await db.emailVerification.create({ data: { email: form.data.email } });
    const token = record.id;

    // メールを送信
    const url = `${event.url.origin}/account/${purpose}/${token}`;

    try {
      await transporter.sendMail({
        from: appEmail,
        to: form.data.email,
        subject: `[${appName}] ${purposes[purpose]} 用のリンクをお送りします`,
        text: `次の URL より ${purposes[purpose]} の手続きをお進めください\n${url}`,
      });
    } catch (error) {
      if (error instanceof Object) {
        console.log(error.toString());
      }
      setFlash({ type: 'error', message: 'メールを送信できませんでした' }, event);
      throw redirect(302, event.url);
    }

    setFlash({ type: 'success', message: 'メールを送信しました' }, event);
    throw redirect(302, path('/'));
  },
} satisfies Actions;
