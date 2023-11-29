<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import Dialog from '$lib/components/Dialog.svelte';
  import Form from '$lib/components/Form.svelte';
  import InputText from '$lib/components/InputText.svelte';
  import InputPassword from '$lib/components/InputPassword.svelte';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;
  const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
    taintedMessage: false,
  });
  export const snapshot = { capture, restore };
</script>

<Dialog title="ログイン">
  <Form message={$message} {enhance}>
    <InputText
      name="email"
      label="メールアドレス"
      bind:value={$form.email}
      disabled={$submitting}
      {errors}
      props={{ placeholder: 'account@example.com' }}
    />
    <InputPassword
      name="password"
      label="パスワード"
      bind:value={$form.password}
      disabled={$submitting}
      {errors}
    />
    <Button disabled={$submitting}>ログイン</Button>
    <p>
      アカウントをお持ちでなければ <a class="link link-primary" href={data.urlRoot + '/account/new'}
        >サインアップ</a
      >
    </p>
    <p>
      パスワードを忘れた場合は <a class="link link-primary" href={data.urlRoot + '/account/reset'}>
        パスワードのリセット</a
      >
    </p>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <p><a class="link link-primary" href="javascript:history.back();">前の画面に戻る</a></p>
  </Form>
</Dialog>
