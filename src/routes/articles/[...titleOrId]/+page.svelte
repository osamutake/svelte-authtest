<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<article class="prose p-4">
  <h1>{data.article.title}</h1>
  <pre>
    {data.article.body}
  </pre>
</article>
