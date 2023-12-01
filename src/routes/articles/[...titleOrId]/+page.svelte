<script lang="ts">
  import type { PageData } from './$types';
  import ArticleElement from '$lib/components/ArticleElement.svelte';
  import { path } from '../lib';

  export let data: PageData;
</script>

<ArticleElement
  title={data.article.title}
  body={data.article.body}
  author={data.article.author.name}
  date={data.article.createdAt}
  permLink={path(data.article)}
/>
