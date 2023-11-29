<script lang="ts">
  export let title: string;
</script>

<div class="dialog relative flex flex-col items-center justify-center min-h-screen">
  <div class="w-full lg:max-w-lg p-6 m-auto rounded-md shadow-2xl">
    <h1 class="text-3xl font-semibold text-center text-primary">{title}</h1>

    <slot />
  </div>
</div>

<style lang="postcss">
  .dialog :global(error-message) {
    @apply text-sm text-red-600;
  }
</style>
