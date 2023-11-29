<script lang="ts">
  import type { PageData } from './$types';
  import Dialog from '$lib/components/Dialog.svelte';
  import Form from '$lib/components/Form.svelte';
  import InputText from '$lib/components/InputText.svelte';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;
</script>

<Dialog title="メールアドレスの変更">
  <Form>
    <InputText name="name" label="ユーザー名" value={data.user.name} disabled />
    <InputText name="email-old" label="旧メールアドレス" bind:value={data.user.email} disabled />
    <InputText name="email-new" label="新メールアドレス" bind:value={data.email} disabled />
    <Button>メールアドレスを変更</Button>
  </Form>
</Dialog>
