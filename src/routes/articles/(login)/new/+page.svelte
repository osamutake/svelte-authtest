<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import Form from '$lib/components/Form.svelte';
  import InputText from '$lib/components/InputText.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;
  const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
    taintedMessage: false,
  });
  export const snapshot = { capture, restore };
</script>

<div>
  <h1>記事の投稿</h1>
  <Form message={$message} {enhance}>
    <InputText
      name="title"
      label="タイトル"
      bind:value={$form.title}
      disabled={$submitting}
      {errors}
    />

    <TextArea
      name="body"
      label="本文"
      bind:value={$form.body}
      disabled={$submitting}
      {errors}
      props={{ style: 'height: 30em; overflow-y: scroll' }}
    />

    <Button disabled={$submitting}>記事を投稿</Button>
    <div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a class="link" href="javascript:history.back()">トップへ戻る</a>
    </div>
  </Form>
</div>
