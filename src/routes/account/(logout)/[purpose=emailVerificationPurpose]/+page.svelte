<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import { purposes } from '$params/emailVerificationPurpose';
  import Dialog from '$lib/components/Dialog.svelte';
  import Form from '$lib/components/Form.svelte';
  import InputText from '$lib/components/InputText.svelte';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;
  const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
    taintedMessage: false,
  });
  export const snapshot = { capture, restore };

  const purpose = purposes[data.purpose];
</script>

<Dialog title={purpose}>
  <Form message={$message} {enhance}>
    <InputText
      name="email"
      label="メールアドレス"
      bind:value={$form.email}
      disabled={$submitting}
      {errors}
      props={{ placeholder: 'account@example.com' }}
    />
    <p>
      入力されたアドレスへリンクを含むメールを送信します<br />
      そのリンクから {purpose} 手続きを進めて下さい
    </p>
    <Button disabled={$submitting}>メールを送信</Button>
  </Form>
</Dialog>
