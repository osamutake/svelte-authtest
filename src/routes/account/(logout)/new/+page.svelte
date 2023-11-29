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

<Dialog title="サインアップ">
  <Form message={$message} {enhance}>
    <InputText
      name="name"
      label="ユーザー名"
      bind:value={$form.name}
      disabled={$submitting}
      {errors}
    />
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
    <InputPassword
      name="confirm"
      label="パスワード（確認）"
      bind:value={$form.confirm}
      disabled={$submitting}
      {errors}
    />
    <Button disabled={$submitting}>サインアップ</Button>
    <p>
      アカウントをお持ちなら <a class="link link-primary" href={data.urlRoot + '/session/new'}
        >ログイン</a
      >
    </p>
  </Form>
</Dialog>
