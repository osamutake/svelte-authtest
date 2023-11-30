<script lang="ts">
  import { path } from '$lib';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<content class="prose p-4">
  <h1>Welcome to SvelteKit</h1>
  <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
  {#if data.user}
    <p>Hello {data.user.name} !!</p>
    <ul>
      <li><a href={path('/session/delete')}>ログアウト</a></li>
      <li><a href={path('/account/email')}>メールアドレスを変更</a></li>
      <li><a href={path('/account/edit')}>ユーザー情報を変更</a></li>
    </ul>
  {:else}
    <ul>
      <li><a href={path('/session/new')}>ログイン</a></li>
      <li><a href={path('/account/new')}>サインアップ</a></li>
      <li><a href={path('/account/reset')}>パスワードを忘れた</a></li>
    </ul>
  {/if}
</content>
