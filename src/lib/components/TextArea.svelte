<script lang="ts">
  import type { Writable } from 'svelte/store';

  export let name: string;
  export let label: string;
  export let labelAlt: string = '';
  export let value: string;
  export let disabled = false;
  export let errors: Writable<{}> | undefined = undefined;
  export let props: svelteHTML.IntrinsicElements['textarea'] | undefined = undefined;

  let key = name as keyof typeof errors;
</script>

<div class="form-control w-full">
  <label for={name} class="label">
    <span class="label-text">{label}</span>
    {#if labelAlt}<span class="label-text-alt">{labelAlt}</span>{/if}
  </label>
  <textarea
    {...{ name, ...props }}
    bind:value
    {disabled}
    on:input
    class="w-full textarea textarea-bordered textarea-primary"
    class:input-error={errors && $errors && $errors[key]}
  />
  {#if errors && $errors && $errors[key]}
    <label class="label" for={name}>
      <span class="label-text-alt text-error">{$errors[key]}</span>
    </label>
  {/if}
</div>
