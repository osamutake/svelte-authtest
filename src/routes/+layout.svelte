<script lang="ts">
  import { getFlash } from 'sveltekit-flash-message';
  import { page } from '$app/stores';

  const flash = getFlash(page);
</script>

{#if $flash}
  {@const bg = $flash.type == 'success' ? '#3D9970' : '#FF4136'}
  <div style:background-color={bg} class="flash">{$flash.message}</div>
{/if}

<slot />
