<script lang="ts">
  import { afterUpdate } from 'svelte';

  export let message = '';
  export let enhance: (el: HTMLFormElement) => object = () => {
    return {};
  };
  export let props: svelteHTML.IntrinsicElements['form'] | undefined = undefined;

  let form: HTMLFormElement;
  afterUpdate(() => {
    if (message) {
      // エラーメッセージが付いていたらすべてのコントロールをエラー表示にする
      ['checkbox', 'file-input', 'radio', 'range', 'select', 'ihput', 'textarea', 'toggle'].forEach(
        (kind) => {
          for (const elem of form.querySelectorAll(`.${kind}`)) {
            elem.classList.add(`${kind}-error`);
          }
        }
      );
    }
  });
</script>

{#if message}<span class="text-sm text-error">{message}</span>{/if}
<form bind:this={form} class="space-y-4" method="POST" use:enhance {...props}>
  <slot />
</form>
