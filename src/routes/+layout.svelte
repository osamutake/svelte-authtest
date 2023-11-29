<script lang="ts">
  import { getFlash } from 'sveltekit-flash-message';
  import { page } from '$app/stores';
  import toast, { Toaster } from 'svelte-french-toast';

  const flash = getFlash(page);

  flash.subscribe(($flash) => {
    if (!$flash) return;

    toast($flash.message, {
      icon: $flash.type == 'success' ? '✅' : '❌',
    });

    // Clearing the flash message could sometimes
    // be required here to avoid double-toasting.
    flash.set(undefined);
  });
</script>

{#if $flash}
  {@const bg = $flash.type == 'success' ? '#3D9970' : '#FF4136'}
  <div style:background-color={bg} class="flash">{$flash.message}</div>
{/if}

<Toaster />
<slot />
