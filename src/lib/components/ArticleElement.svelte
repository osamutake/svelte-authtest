<script lang="ts" context="module">
  import { marked } from 'marked';
  import { baseUrl } from 'marked-base-url';
  import markedLinkifyIt from 'marked-linkify-it';
  import markedKatex from 'marked-katex-extension';
  import { PUBLIC_URL_ROOT } from '$env/static/public';
  import { codeRenderer } from './codeRenderer';

  import 'highlight.js/styles/stackoverflow-dark.min.css';

  import { decolatorsInfo } from './codeDecolators/codeDecolatorInfo';

  // 各デコレータが追加する css をまとめる
  const codeRendererCss = decolatorsInfo.map((info) => info.css).join('\n');

  // シンタックスハイライト
  marked.use(codeRenderer);

  // デフォルトのレンダラ
  const vanillaRenderer = new marked.Renderer();

  // 見出しの階層を1つ下げる
  marked.use({
    renderer: {
      // modified from marked-custom-heading-id
      // https://www.npmjs.com/package/marked-custom-heading-id
      heading(text, level, raw) {
        const headingIdRegex = /\{#([a-z][\w-]*)\}(?: +|$)/i;
        const hasId = text.match(headingIdRegex);
        if (!hasId) {
          return vanillaRenderer.heading(text, level + 1, raw);
        }
        return `<h${level + 1} id="${hasId[1]}">${text.replace(headingIdRegex, '')}</h${level}>\n`;
      },
    },
  });

  // 字の文字に自動的にリンクを張る
  const linkifyItSchemas = {};
  const linkifyItOptions = {};
  marked.use(markedLinkifyIt(linkifyItSchemas, linkifyItOptions));

  // 数式
  marked.use(
    markedKatex({
      throwOnError: false,
    })
  );

  // ベースアドレス
  marked.use(baseUrl(PUBLIC_URL_ROOT));
</script>

<script lang="ts">
  export let title: string;
  export let author: string;
  export let date: Date;
  export let body: string;
  export let permLink: string;
</script>

<svelte:head>
  {@html '<style>' + codeRendererCss + '</style>'}
</svelte:head>

<article class="article prose max-w-full p-4">
  <h1>{title}</h1>
  <div>
    <span>{author}</span>
    <span>{date.toLocaleString()}</span>
    <span><a href={permLink + '/edit'}>編集</a></span>
  </div>
  <content>
    {@html marked.parse(body)}
  </content>
</article>

<style lang="postcss">
  /* Katex */
  .article :global(.katex-display) {
    text-align: left;
    padding-left: 2em;
  }
  .article :global(.katex-display > .katex) {
    text-align: left;
  }

  /* 一般 */
  .article {
    max-width: 800px;
  }
  .article :global(h1) {
    margin-bottom: 5px;
  }
  .article :global(li) {
    margin: 0;
  }
  .article :global(ul),
  .article :global(ol),
  .article :global(dl) {
    margin-top: 0;
    margin-bottom: 0.5em;
  }

  /* コードハイライト */
  .article :global(pre.marked-code) {
    padding-left: 0;
    padding-right: 0;
  }
  .article :global(.tags) {
    padding-left: 0.5em;
    position: relative;
  }
  .article :global(.tags)::after {
    /* clearfix */
    content: ' ';
    display: block;
    clear: both;
    line-height: 4px;
  }
</style>
