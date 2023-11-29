<script lang="ts">
  import InputText from '$lib/components/InputText.svelte';
  import type { Writable } from 'svelte/store';

  export let name: string;
  export let label: string;
  export let labelAlt: string = '';
  export let value: string;
  export let disabled = false;
  export let errors: Writable<{}> | undefined = undefined;
  export let props: svelteHTML.IntrinsicElements['input'] | undefined = undefined;
</script>

<InputText
  {...{ name, label, labelAlt, disabled, errors }}
  props={{ type: 'password', ...props }}
  bind:value
  on:input
/>
