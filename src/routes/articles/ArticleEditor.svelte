<script lang="ts">
  import type { Writable } from 'svelte/store';
  import Form from '$lib/components/Form.svelte';
  import InputText from '$lib/components/InputText.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import Button from '$lib/components/Button.svelte';

  export let formTitle: string;
  export let submitTitle: string;
  export let message = '';
  export let enhance: (el: HTMLFormElement) => object = () => {
    return {};
  };
  export let title: string;
  export let body: string;
  export let disabled: boolean;
  export let errors: Writable<{}> | undefined = undefined;
</script>

<div>
  <h1>{formTitle}</h1>
  <Form {message} {enhance}>
    <InputText name="title" label="タイトル" bind:value={title} {disabled} {errors} />

    <TextArea
      name="body"
      label="本文"
      bind:value={body}
      {disabled}
      {errors}
      props={{ style: 'height: 30em; overflow-y: scroll' }}
    />

    <Button {disabled}>{submitTitle}</Button>
    <div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a class="link" href="javascript:history.back()">戻る</a>
    </div>
  </Form>
</div>
