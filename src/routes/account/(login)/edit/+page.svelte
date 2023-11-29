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

<Dialog title="ユーザー情報の変更">
  <Form message={$message} {enhance}>
    <InputText
      name="name"
      label="ユーザー名"
      bind:value={$form.name}
      disabled={$submitting}
      {errors}
    />
    <InputText name="email" label="メールアドレス" bind:value={data.user.email} disabled />
    <InputPassword
      name="password"
      label="パスワード"
      labelAlt="変更しない場合は空にしておく"
      bind:value={$form.password}
      disabled={$submitting}
      {errors}
    />
    <InputPassword
      name="confirm"
      label="パスワード（確認）"
      labelAlt="変更しない場合は空にしておく"
      bind:value={$form.confirm}
      disabled={$submitting}
      {errors}
    />
    <Button disabled={$submitting}>ユーザー情報を変更</Button>
    <p>
      アカウントをお持ちなら <a class="link link-primary" href={data.urlRoot + '/session/new'}
        >ログイン</a
      >
    </p>
    <p>
      メールアドレスを変更するには <a
        class="link link-primary"
        href={data.urlRoot + '/session/email'}>メールアドレスの変更</a
      >
    </p>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <p><a class="link link-primary" href="javascript:history.back();">前の画面に戻る</a></p>
  </Form>
</Dialog>
