<script lang="ts">
  export let disabled = false;
</script>

<div>
  <button {disabled} class="btn btn-block btn-primary text-white"><slot /></button>
</div>
