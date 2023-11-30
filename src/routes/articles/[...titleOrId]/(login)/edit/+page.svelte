<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import ArticleEditor from '../../../ArticleEditor.svelte';

  export let data: PageData;
  const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
    taintedMessage: false,
  });
  export const snapshot = { capture, restore };
</script>

<ArticleEditor
  formTitle="記事を編集"
  submitTitle="編集を反映"
  {...{ message: $message, enhance, disabled: $submitting, errors }}
  bind:title={$form.title}
  bind:body={$form.body}
/>
