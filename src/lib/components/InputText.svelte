<script lang="ts">
  import type { Writable } from 'svelte/store';

  export let name: string;
  export let label: string;
  export let labelAlt: string = '';
  export let value: string;
  export let disabled = false;
  export let errors: Writable<{}> | undefined = undefined;
  export let props: svelteHTML.IntrinsicElements['input'] | undefined = undefined;

  let key = name as keyof typeof errors;
</script>

<div class="form-control w-full">
  <label for={name} class="label">
    <span class="label-text">{label}</span>
    {#if labelAlt}<span class="label-text-alt">{labelAlt}</span>{/if}
  </label>
  <input
    {...{ name, type: 'text', ...props }}
    bind:value
    {disabled}
    on:input
    class="w-full input input-bordered input-primary"
    class:input-error={errors && $errors && $errors[key]}
  />
  {#if errors && $errors && $errors[key]}
    <label class="label" for={name}>
      <span class="label-text-alt text-error">{$errors[key]}</span>
    </label>
  {/if}
</div>
