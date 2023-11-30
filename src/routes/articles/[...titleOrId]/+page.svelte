<script lang="ts" context="module">
  import { marked } from 'marked';
  import { baseUrl } from 'marked-base-url';
  import markedLinkifyIt from 'marked-linkify-it';
  import { markedHighlight } from 'marked-highlight';
  import hljs from 'highlight.js';
  import markedKatex from 'marked-katex-extension';

  import 'highlight.js/styles/stackoverflow-dark.min.css';

  marked.use(baseUrl('https://example.com/folder/'));
  const linkifyItSchemas = {};
  const linkifyItOptions = {};
  marked.use(markedLinkifyIt(linkifyItSchemas, linkifyItOptions));
  marked.use(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );
  marked.use(
    markedKatex({
      throwOnError: false,
    })
  );
</script>

<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<article class="prose max-w-full p-4">
  <h1>{data.article.title}</h1>
  <div>
    <span>{data.article.author.name}</span>
    <span>{data.article.createdAt.toLocaleString()}</span>
  </div>
  <content>
    {@html marked.parse(data.article.body)}
  </content>
</article>
