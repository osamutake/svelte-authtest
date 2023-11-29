<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import Dialog from '$lib/components/Dialog.svelte';
  import Form from '$lib/components/Form.svelte';
  import InputText from '$lib/components/InputText.svelte';
  import InputPassword from '$lib/components/InputPassword.svelte';
  import Button from '$lib/components/Button.svelte';
  import { verifyPassword } from '$lib/components/InputPasswordVerifier';

  export let data: PageData;
  const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
    taintedMessage: false,
  });
  export const snapshot = { capture, restore };
</script>

<Dialog title="パスワードのリセット">
  <Form message={$message} {enhance}>
    <InputText name="name" label="ユーザー名" bind:value={data.user.name} disabled />
    <InputText name="email" label="メールアドレス" bind:value={data.user.email} disabled />
    <InputPassword
      name="password"
      label="新しいパスワード"
      bind:value={$form.password}
      disabled={$submitting}
      {errors}
      on:input={(e) => verifyPassword(e, errors)}
    />
    <InputPassword
      name="confirm"
      label="新しいパスワード（確認）"
      bind:value={$form.confirm}
      disabled={$submitting}
      {errors}
    />
    <Button disabled={$submitting}>パスワードを変更</Button>
  </Form>
</Dialog>
